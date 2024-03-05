import { TrainingDataInputsSchema } from "./components/interfaces";
import { config } from "dotenv";
import { TrainingAssetTypes } from "../../lib/constants";
import {
    FileTrainingData,
} from "./components/file_training_data_input";
export class TrainingFilesInputConfig
    implements TrainingDataInputsSchema<File[]>
{
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

export class TrainingFilesInputConfigV2
    implements TrainingDataInputsSchema<FileTrainingData[]>
{
    value: FileTrainingData[];
    type: TrainingAssetTypes = TrainingAssetTypes.Files;
    errors: string[] = [];
    constructor() {
        this.value = [];
    }

    isValid() {
        this.errors = [];
        if (this.value.length == 0) {
            this.errors.push("Training files are required");
        }
        let { size: totalUploadSize } = this.value.reduce(
            (agg, val) => {
                if (val.value.context.length == 0) {
                    this.errors.push("Context is required");
                }
                if (val.value.files.length == 0) {
                    this.errors.push("Files are required");
                }
                let size = val.value.files.reduce((agg2, val2) => {
                    return agg2 + bytesToMB(val2.size);
                }, 0);
                agg.size += size;
                return agg;
            },
            { size: 0 }
        );

        const isUnderUploadLimit =
            totalUploadSize <=
            Number(process.env.NEXT_PUBLIC_MAX_FILES_SIZE_LIMIT_MB);

        if (!isUnderUploadLimit) {
            this.errors.push("Files exceed total upload size");
        }

        return !this.errors.length;
    }
    setValue(o: FileTrainingData[]) {
        this.value = o;
        this.isValid();
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
    animate?: boolean;
}


export function getChatServiceHost() {
    return `http://${process.env.NEXT_PUBLIC_CHAT_SERVICE_API}`;
}
