import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import 'dotenv/config';
import path from 'path';

const {
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET,
    PLAN_ID,
    PORT = 8888,
} = process.env;

const base = 'https://api-m.sandbox.paypal.com';

const generateAccessToken = async (): Promise<any> => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) throw new Error('MISSING_API_CREDENTIALS');

        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET,
        ).toString('base64');

        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data: any = await response.json();

        return data.access_token;

    } catch (error) {
        console.error('Failed to generate Access Token:', error);
    }
};

const createSubscription = async (userAction = 'SUBSCRIBE_NOW') => {
    const url = `${base}/v1/billing/subscriptions`;
    const accessToken = await generateAccessToken();

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            Prefer: 'return=representation',
        },
        body: JSON.stringify({
            plan_id: PLAN_ID,
            application_context: {
                user_action: userAction,
            },
        }),
    });

    return handleResponse(response);
};

const handleResponse = async (response: any) => {
    try {
        const jsonResponse = await response.json();
        return {
            jsonResponse,
            httpStatusCode: response.status,
        };

    } catch (err) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === 'POST') {
        try {
            const { jsonResponse, httpStatusCode } = await createSubscription();
            res.status(httpStatusCode).json(jsonResponse);

        } catch (error) {
            console.error('Failed to create order:', error);
            res.status(500).json({ error: 'Failed to create order.' });
        }

    } else if (req.method === 'GET') {
        // serve index.html
        //res.sendFile(path.resolve('./client/checkout.html'));
        res.writeHead(200, )

    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
