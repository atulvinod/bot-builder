import {
    StorageReference,
    getStorage,
    ref,
    uploadBytes,
} from "firebase/storage";
import { getFirebaseApp } from "./firebase";
import * as zip from "zip-lib";
import * as fsp from "fs/promises";
import * as path from "path";
import * as os from "os";
const app = getFirebaseApp();

async function generateZipFile(folderId: string, files: File[]) {
    const filesDirPath = path.join(os.tmpdir(), folderId);
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

export async function uploadFiles(
    folder: string,
    data_category: "files" | "images",
    files: File[]
) {
    const root = getStorage(app);
    const folderRef = ref(root, `${folder}/${data_category}.zip`);
    const { zipFilePath, filesDirPath } = await generateZipFile(folder, files);
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
