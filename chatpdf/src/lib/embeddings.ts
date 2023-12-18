import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string): Promise<number[]> {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        })

        const result = await response.json();
        return result.data[0].embedding as number[];

    } catch (error: any) {
        console.log('Error calling OpenAPI embeddings API...', error.message);
        throw error;
    }
}