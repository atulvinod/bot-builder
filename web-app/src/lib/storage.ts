import {
    StorageReference,
    getStorage,
    ref,
    uploadBytes,
    deleteObject,
} from "firebase/storage";
import { getFirebaseApp } from "./firebase";
import * as zip from "zip-lib";
import * as fsp from "fs/promises";
import * as path from "path";
import * as os from "os";
import { v4 as uuidv4 } from "uuid";
const app = getFirebaseApp();

async function generateZipFile(files: File[]) {
    const tempDir = uuidv4();
    const filesDirPath = path.join(os.tmpdir(), tempDir);
    const zipFilePath = `${filesDirPath}.zip`;
    await fsp.mkdir(filesDirPath);
    for (let i = 0; i < files.length; i++) {
        const buffer = await files[i].arrayBuffer();
        const uint8View = new Uint8Array(buffer);
        await fsp.writeFile(path.join(filesDirPath, files[i].name), uint8View);
    }
    await zip.archiveFolder(filesDirPath, zipFilePath);
    return { zipFilePath, filesDirPath };
}

export async function uploadFile(
    folder: string,
    file_name: string,
    file: File
) {
    const root = getStorage(app);
    const folderRef = ref(root, `${folder}/${file_name}`);
    const fileBuffer = await file.arrayBuffer();
    const result = await uploadBytes(folderRef, fileBuffer, {
        contentType: "",
    });
    return result;
}

export async function uploadZipped(
    folder: string,
    zip_file_name: string,
    files: File[]
) {
    const root = getStorage(app);
    const folderRef = ref(root, `${folder}/${zip_file_name}.zip`);
    const { zipFilePath, filesDirPath } = await generateZipFile(files);
    const uploadResult = await uploadZipToBucket(zipFilePath, folderRef);
    await deallocateStorage(filesDirPath, zipFilePath);
    return uploadResult;
}

async function uploadZipToBucket(
    zipFilePath: string,
    folderRef: StorageReference
) {
    const zipReadBuffer = await fsp.readFile(zipFilePath);
    const result = await uploadBytes(folderRef, zipReadBuffer, {
        contentType: "",
    });
    return result;
}

async function deallocateStorage(fileDirPath: string, zipFilePath: string) {
    await Promise.all([
        fsp.rm(fileDirPath, { recursive: true }),
        fsp.rm(zipFilePath),
    ]);
}

export async function deleteRefs(refs: StorageReference[]) {
    for (let i = 0; i < refs.length; i++) {
        await deleteObject(refs[i]);
    }
}