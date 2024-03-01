"use client";

import { ChangeEvent, useRef, useState } from "react";

import fileSvg from "../../../svgs/file.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, FolderOpen, X, PlusIcon, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { bytesToMB, convertFileListToArray } from "../utils";

export interface FileTrainingDataSchema {
    value: {
        context: string;
        files: File[];
    };
    setValue: (obj: { context: string; files: File[] }) => void;
}

export class FileTrainingData implements FileTrainingDataSchema {
    id: number;
    constructor(id: number) {
        this.id = id;
    }
    value: { context: string; files: File[] } = { context: "", files: [] };
    setValue: (obj: { context: string; files: File[] }) => void = (obj) => {
        this.value = { context: obj.context, files: obj.files };
    };
}

export default function TrainingFilesInputV2({
    state,
    onUpdate,
}: {
    state: FileTrainingData[];
    onUpdate: (ftd: FileTrainingData[]) => void;
}) {
    const totalSelectedFileSize = state.reduce((acc, v) => {
        let size = v.value.files.reduce((agg2, v2) => {
            return bytesToMB(v2.size) + agg2;
        }, 0);
        return acc + size;
    }, 0);

    const hasReachedUploadQuota = () =>
        totalSelectedFileSize >=
        Number(process.env.NEXT_PUBLIC_MAX_FILES_SIZE_LIMIT_MB);

    function updateDataSegmentState(
        id: number,
        context: string,
        files: File[]
    ) {
        state[id] = new FileTrainingData(id);
        state[id].setValue({ context, files });
        onUpdate(state);
    }

    return (
        <div className="border-2 rounded-lg border-gray-300 p-4 ">
            {/* Top header */}
            <div className=" flex flex-row items-center">
                <div>
                    <Image
                        height={50}
                        width={50}
                        alt="file_svg"
                        src={fileSvg}
                    ></Image>
                </div>
                <div className="flex-auto">
                    <div className="ml-2 flex-auto flex justify-between">
                        <h1 className="text-2xl">Files</h1>
                        <Dialog modal={true}>
                            <DialogTrigger>
                                <ExternalLink />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Add Training Files
                                    </DialogTitle>
                                </DialogHeader>
                                <hr />
                                <div>
                                    <span
                                        className={`text-sm ${
                                            hasReachedUploadQuota()
                                                ? "text-red-500"
                                                : ""
                                        }`}
                                    >
                                        {`Total upload size : ${totalSelectedFileSize.toFixed(
                                            2
                                        )} / ${
                                            process.env
                                                .NEXT_PUBLIC_MAX_FILES_SIZE_LIMIT_MB
                                        } MB`}
                                    </span>
                                </div>
                                <div>
                                    {state.map((d, idx: number) => (
                                        <TrainingDataSegmentComponent
                                            key={idx}
                                            state={d}
                                            notifyChange={(
                                                context: string,
                                                files: File[]
                                            ) => {
                                                updateDataSegmentState(
                                                    idx,
                                                    context,
                                                    files
                                                );
                                            }}
                                            onDelete={() => {
                                                state.splice(idx, 1);
                                                onUpdate(state);
                                            }}
                                        />
                                    ))}
                                    <div className="flex justify-center">
                                        <Button
                                            variant={"outline"}
                                            className="mt-2"
                                            onClick={() => {
                                                const new_state = [
                                                    ...state,
                                                    new FileTrainingData(
                                                        state.length + 1
                                                    ),
                                                ];
                                                onUpdate(new_state);
                                            }}
                                        >
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrainingDataSegmentComponent({
    state,
    onDelete,
    notifyChange,
}: {
    onDelete: () => void;
    state: FileTrainingDataSchema;
    notifyChange: (context: string, files: File[]) => void;
}) {
    const [files, setFiles] = useState<File[]>(state.value.files);
    const [context, setContext] = useState<string>(state.value.context);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function updateFiles(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const fileList = event.target.files;
            const files = convertFileListToArray(fileList);
            setFiles(files);
            notifyChange(context, files);
        }
    }

    return (
        <div className="flex flex-row mt-1">
            <div className="border-2 rounded-sm  p-4 w-full bg-appGrey ">
                <div>
                    <div>
                        <div className="flex justify-between">
                            <h1 className="text-xl">Context</h1>
                        </div>
                        <Textarea
                            onChange={(event) => {
                                setContext(event.target.value);
                                notifyChange(event.target.value, files);
                            }}
                            placeholder="Add context about your files to describe the specific data they provide"
                            required
                        />
                    </div>
                </div>
                <div className="mt-2">
                    <input
                        type="file"
                        name=""
                        id=""
                        accept=".pdf, .doc, .docx, .txt"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={updateFiles}
                    />
                    <div className="flex justify-between">
                        <h1 className="text-xl">Documents</h1>
                    </div>
                    <div>
                        {files.map((f, idx) => (
                            <div
                                key={idx}
                                className=" rounded border-gray-500  border-1 flex items-center mt-0 ml-1"
                            >
                                <span className="text-sm">{f.name}</span>
                                <span className="ml-2">
                                    <Button
                                        variant={"ghost"}
                                        className="p-0 transparent h-8"
                                        onClick={() => {
                                            files.splice(idx, 1);
                                            const newFiles = [...files];
                                            notifyChange(context, newFiles);
                                        }}
                                    >
                                        <X size={12} className="" />
                                    </Button>
                                </span>
                            </div>
                        ))}
                        <Button
                            variant={"outline"}
                            type="button"
                            className="p-2 mt-1"
                            onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                }
                            }}
                        >
                            <FolderOpen className="w-4 h-4 mr-2" />
                            Add files
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <Button variant={"ghost"} size={"icon"} onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
