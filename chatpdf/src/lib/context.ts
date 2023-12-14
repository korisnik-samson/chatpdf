import { PineconeClient } from "@pinecone-database/pinecone";
import { convertToASCII } from "@/lib/utils";
import { getEmbeddings } from "@/lib/embeddings";
import { Metadata } from "@/types";

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    const pinecone = new PineconeClient()
    await pinecone.init({
        apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
        environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT!
    })

    const index = await pinecone.Index('chatpdf');

    try {
        const namespace = convertToASCII(fileKey);
        const queryResult = await index.query({
            queryRequest: {
                topK: 5,
                vector: embeddings,
                includeMetadata: true,
                namespace
            }
        })

        return queryResult.matches || [];

    } catch (error: any) {
        console.log('error querying embeddings: ', error.message);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query)
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

    const qualifyingDocs = matches.filter(
        (match) => match.score && match.score > 0.7
    )

    let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text)

    return docs.join('\n').substring(0, 3000);
}