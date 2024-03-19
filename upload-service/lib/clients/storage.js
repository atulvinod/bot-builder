const {
    StorageReference,
    getStorage,
    ref,
    uploadBytes,
    deleteObject,
} = require("firebase/storage");
const { getFirebaseApp } = require("./firebase");
const zip = require("zip-lib");
const fsp = require("fs/promises");
const path = require("path");
const os = require("os");
const uuid = require("uuid");
const app = getFirebaseApp();

async function generateZipFile(files) {
    const tempDir = uuid.v4();
    const filesDirPath = path.join(os.tmpdir(), tempDir);
    const zipFilePath = `${filesDirPath}.zip`;
    await fsp.mkdir(filesDirPath);
    for (let i = 0; i < files.length; i++) {
        await fsp.writeFile(path.join(filesDirPath, files[i].filename), files[i].file);
    }
    await zip.archiveFolder(filesDirPath, zipFilePath);
    return { zipFilePath, filesDirPath };
}

/**
 * 
 * @param {string} folder 
 * @param {string} file_name 
 * @param {{_buf: Buffer, mimetype:String}} file 
 */
async function uploadFile(
    folder,
    file_name,
    file,
) {
    const root = getStorage(app);
    const folderRef = ref(root, `${folder}/${file_name}`);
    const result = await uploadBytes(folderRef, file._buf, {
        contentType: file.mimetype,
    });
    return result;
}

/**
 * 
 * @param {string} folder 
 * @param {string} zip_file_name 
 * @param {File[]} files 
 */
async function uploadZipped(
    folder,
    zip_file_name,
    files,
) {
    const root = getStorage(app);
    const folderRef = ref(root, `${folder}/${zip_file_name}.zip`);
    const { zipFilePath, filesDirPath } = await generateZipFile(files);
    const uploadResult = await uploadZipToBucket(zipFilePath, folderRef);
    await deallocateStorage(filesDirPath, zipFilePath);
    return uploadResult;
}

/**
 * 
 * @param {string} zipFilePath 
 * @param {StorageReference} folderRef `
 */
async function uploadZipToBucket(
    zipFilePath,
    folderRef,
) {
    const zipReadBuffer = await fsp.readFile(zipFilePath);
    const result = await uploadBytes(folderRef, zipReadBuffer, {
        contentType: "",
    });
    return result;
}

/**
 * 
 * @param {string} fileDirPath 
 * @param {string} zipFilePath 
 */
async function deallocateStorage(fileDirPath, zipFilePath) {
    await Promise.all([
        fsp.rm(fileDirPath, { recursive: true }),
        fsp.rm(zipFilePath),
    ]);
}

/**
 * 
 * @param {StorageReference[]} refs 
 */
async function deleteRefs(refs) {
    for (let i = 0; i < refs.length; i++) {
        await deleteObject(refs[i]);
    }
}

module.exports = {
    deleteRefs,
    deallocateStorage,
    uploadZipToBucket,
    uploadZipped,
    uploadFile
}