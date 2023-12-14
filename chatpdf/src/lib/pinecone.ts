import { Pinecone, PineconeRecord, utils as PineconeUtils } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToASCII } from "./utils";
import { PDFPage } from "@/types";

export const getPineconeClient = () => {
    return new Pinecone({
        environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT!,
        apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY! || process.env.NEXT_PUBLIC_PINECONE_API_KEY_DEF!,
        //this will use the default api key if the specified key to the index isn't found or valid anymore
    });
};

export async function loadS3IntoPinecone(fileKey: string) {
    // 1. obtain the pdf -> downlaod and read from pdf
    console.log("downloading s3 into file system");
    const file_name = await downloadFromS3(fileKey);
    
    if (!file_name) throw new Error("could not download from s3");

    console.log("loading pdf into memory: " + file_name);
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    
    // 2. split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));
    
    // 3. vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));
    
    // 4. upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index('chatpdf');
    const namespace = convertToASCII(fileKey);

    console.log("inserting vectors into pinecone");
    //await namespace.upsert(vectors);
    // @ts-ignore
    PineconeUtils.chunkedUpsert(pineconeIndex, vectors, namespace, 10)
    
    return documents[0];
}

async function embedDocument(doc: Document): Promise<PineconeRecord> {
    try {
        const embeddings: number[] = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: { text: doc.metadata.text, pageNumber: doc.metadata.pageNumber }
        } as PineconeRecord;
        
    } catch (error) {
        console.log("error embedding document: ", error);
        throw error;
    }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");

    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    
    return await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000),
            },
        }),
    ]);
}