import { GetObjectCommandOutput, S3 } from "@aws-sdk/client-s3";
import fs from "fs";

import path from 'path';
import os from 'os';

export async function downloadFromS3(file_key: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const s3 = new S3({
                region: "eu-central-1",
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
                },
            });
            const params: { Bucket: string, Key: string } = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
                Key: file_key,
            };

            const obj: GetObjectCommandOutput = await s3.getObject(params);
            //const file_name = `/tmp/pdf${Date.now().toString()}.pdf`;

            const tmpDirectory: string = path.join(os.tmpdir(), 'pdfs');
            fs.mkdirSync(tmpDirectory, { recursive: true });

            const file_name = path.join(tmpDirectory, `pdf${Date.now().toString()}.pdf`);

            if (obj.Body instanceof require("stream").Readable) {
                const file: fs.WriteStream = fs.createWriteStream(file_name);
                file.on("open", function (fd) {
                    // @ts-ignore
                    obj.Body?.pipe(file).on("finish", () => {
                        return resolve(file_name);
                    });
                });
                // obj.Body?.pipe(fs.createWriteStream(file_name));
            }

        } catch (error: any) {
            console.error(error.message, error);
            reject(error);

            return null;
        }
    });
}

// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");