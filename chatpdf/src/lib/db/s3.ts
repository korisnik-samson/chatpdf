import AWS from 'aws-sdk';

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
        });

        const s3 = new AWS.S3({
            params: { Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME },
            region: 'eu-central-1'
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file
        };

        const upload = s3.putObject(params).on('httpUploadProgress', ev => {
            console.log('uploading to s3...', parseInt(((ev.loaded * 100) / ev.total).toString()) + '%');
        }).promise();

        await upload.then(data => {
            console.log('successfully uploaded to s3!', file_key)
        });

        return Promise.resolve({
            file_key,
            file_name: file.name
        });

    } catch (error) {
        console.log(error)
    }
}

export function gets3Url(file_key: string) {
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${file_key}`;
}