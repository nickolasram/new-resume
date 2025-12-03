import {NextRequest, NextResponse} from "next/server";
import sanitize from "sanitize-filename";
import {randomUUID} from "node:crypto";
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
    S3ServiceException,
} from "@aws-sdk/client-s3";

export async function POST(req: NextRequest){
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file detected' }, { status: 400 });
    }

    let name = file.name;
    name = name.replace(/\s/g, "");
    name = sanitize(name)
    name = randomUUID() + name
    const bytes = await file.arrayBuffer();
    const imageBuffer = Buffer.from(bytes);
    const client = new S3Client({});
    const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: name,
        Body: imageBuffer,
    });
    try{
        const response= await client.send(command);
        const address = process.env.NEXT_PUBLIC_AWS_ADDRESS
        return NextResponse.json({success: true}, {status:200, statusText: address+name});
    } catch (caught) {
        if (
            caught instanceof S3ServiceException &&
            caught.name === "EntityTooLarge"
        ) {
            console.error(
                `Error from S3 while uploading object to bucket. The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) or the multipart upload API (5TB max).`,
            );
        } else if (caught instanceof S3ServiceException) {
            console.error(
                `Error from S3 while uploading object to bucket.  ${caught.name}: ${caught.message}`,
            );
        } else {
            throw caught;
        }
    }
}

export async function DELETE(req: NextRequest){
    const body = await req.json();
    const imageUrl = body.imageUrl;
    const splitUrl = imageUrl.split('/');
    const file = splitUrl[splitUrl.length - 1];
    const client = new S3Client({});
    const command = new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: file,
    });
    try{
        const response= await client.send(command);
        return NextResponse.json({success: true}, {status:200});
    } catch (caught) {
        if (
            caught instanceof S3ServiceException &&
            caught.name === "EntityTooLarge"
        ) {
            console.error(
                `Error from S3 while uploading object to bucket. The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) or the multipart upload API (5TB max).`,
            );
        } else if (caught instanceof S3ServiceException) {
            console.error(
                `Error from S3 while uploading object to bucket.  ${caught.name}: ${caught.message}`,
            );
        } else {
            throw caught;
        }
    }
}