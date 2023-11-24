'use client'
import React from 'react';
import { useDropzone } from "react-dropzone";
import { Inbox } from "lucide-react";
import { uploadToS3 } from "@/lib/db/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const FileUpload = () => {
    const { mutate } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }) => {
            const response = await axios.post('/api/create-post', {
                file_key, file_name
            });

            return response.data;
        }
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0]

            if (file.size > 10 * 1024 * 1024) {
                //can't take larger than 10MB of pdf
                toast.error('File too large')
                alert('please upload a smaller file');

                return;
            }

            try {
                const data = await uploadToS3(file);
                if (!data?.file_key || !data.file_name) {
                    alert('Something went wrong: EUP-01')
                    return
                }

                mutate(data, {
                    onSuccess: (data) => { console.log(data) },
                    onError: (err) => { console.log(err) }
                });

            } catch (error) {
                console.log(error);
            }
        }
    })

    return (
        <div className="p-2 bg-white rounded-xl">
            <div {...getRootProps({
               className:'border-dashed border-2 rounded-xl cursor-pointer' +
                   ' bg-gray-50 py-8 flex justify-center items-center flex-col'
            })}>
                <input {...getInputProps()} />
                <React.Fragment>
                    <Inbox className="w-10 h-10 text-blue-500" />
                    <p className="mt-2 text-sm text-slate-400">
                        Drop PDF Here
                    </p>
                </React.Fragment>
            </div>
        </div>
    );
}

export default FileUpload;