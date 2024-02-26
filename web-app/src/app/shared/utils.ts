import { TrainingDataSchema } from "./components/interfaces";
import { config } from "dotenv";
import { TrainingAssetTypes } from "../../lib/constants";
export class TrainingFilesInputConfig implements TrainingDataSchema<File[]> {
    value: File[];
    errors: string[] = [];
    type: TrainingAssetTypes = TrainingAssetTypes.Files;
    constructor() {
        this.value = [];
    }

    isValid() {
        this.errors = [];
        let totalUploadSize = 0;
        for (let i = 0; i < this.value.length; i++) {
            totalUploadSize += this.value[i].size;
        }
        const sizeInMB = bytesToMB(totalUploadSize);
        const areFilesAdded = this.value.length > 0;
        const isUnderUploadLimit =
            sizeInMB <= Number(process.env.NEXT_PUBLIC_MAX_FILES_SIZE_LIMIT_MB);

        if (!areFilesAdded) {
            this.errors.push("Files are not added");
        }
        if (!isUnderUploadLimit) {
            this.errors.push("You have exceeded upload quota");
        }
        return areFilesAdded && isUnderUploadLimit;
    }

    setValue(v: File[]) {
        this.value = v;
    }
}

export function bytesToMB(bytes: number) {
    return bytes / (1024 * 1024);
}

export function convertFileListToArray(fileList: FileList) {
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
        files.push(fileList[i]);
    }
    return files;
}

export function loadEnv() {
    if (process.env.NODE_ENV?.includes("prod")) {
        return;
    }
    config({
        path: "./.env.local",
    });
}


export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export function getChatServiceHost(){
    return `http://${process.env.NEXT_PUBLIC_CHAT_SERVICE_API}`
}