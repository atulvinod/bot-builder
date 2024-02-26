"use client";

import fileSvg from "../../../svgs/file.svg";
import Image from "next/image";
import { Button, ButtonSize, ButtonVariants } from "./buttons";
import { useRef, useState } from "react";
import { bytesToMB, convertFileListToArray } from "../utils";
import { toast } from "sonner";

export default function FileTrainingDataInput({
    onFileChange,
}: {
    onFileChange: (files: File[]) => void;
}) {
    const fileInputReft = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const totalSelectedFileSize = selectedFiles.reduce((acc, v) => {
        return acc + bytesToMB(v.size);
    }, 0);

    const hasReachedUploadQuota = () =>
        totalSelectedFileSize >=
        Number(process.env.NEXT_PUBLIC_MAX_FILES_SIZE_LIMIT_MB);

    const getSelectedFileNameSet = () => {
        const selectedFileNames = selectedFiles.reduce((acc, v) => {
            acc.add(v.name);
            return acc;
        }, new Set());
        return selectedFileNames;
    };

    const openFilePicker = () => {
        if (hasReachedUploadQuota()) {
            toast(
                "You cannot select more files as you have reached the maximum upload quota"
            );
            return;
        }

        if (fileInputReft?.current) {
            fileInputReft?.current?.click();
        }
    };

    return (
        <div className="p-5 flex border-2 rounded-lg mt-3">
            <div>
                <Image
                    height={50}
                    width={50}
                    alt="file_svg"
                    src={fileSvg}
                ></Image>
            </div>
            <div className="ml-5 grow shrink basis-0">
                <div className="flex flex-row justify-between">
                    <div>
                        <h1 className="text-2xl">Files</h1>
                    </div>
                    <input
                        onChange={(event) => {
                            if (event.target.files != null) {
                                const selectedFileNameSet =
                                    getSelectedFileNameSet();

                                const newFiles: File[] = [];
                                const addedFiles = convertFileListToArray(
                                    event.target.files
                                );
                                addedFiles.forEach((f) => {
                                    if (!selectedFileNameSet.has(f.name)) {
                                        newFiles.push(f);
                                    }
                                });
                                setSelectedFiles(newFiles);
                                onFileChange(newFiles);
                            }
                        }}
                        ref={fileInputReft}
                        type="file"
                        accept=".pdf, .doc, .docx, .txt"
                        className="hidden"
                        multiple
                    />
                    <Button
                        onClick={openFilePicker}
                        type="button"
                        variant={ButtonVariants.Muted}
                        size={ButtonSize.Small}
                        buttonText="Add files"
                    ></Button>
                </div>
                <hr className="my-3" />
                <div className="flex flex-row justify-between mt-2">
                    <span className="text-sm">{`${
                        Object.keys(selectedFiles)?.length ?? 0
                    } file(s) added`}</span>

                    <span
                        className={`text-sm ${
                            hasReachedUploadQuota() ? "text-red-500" : ""
                        }`}
                    >
                        {`${totalSelectedFileSize.toFixed(2)} / ${
                            process.env.NEXT_PUBLIC_MAX_FILES_SIZE_LIMIT_MB
                        } MB`}
                    </span>
                </div>
                <div className="mt-2">
                    {Object.entries(selectedFiles ?? {}).map(
                        ([key, file], index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-row items-center"
                                >
                                    <p className="text-xs">{file.name}</p>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
}
