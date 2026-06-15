import { json } from "zod";

interface RetryConfig {
    maxretries?: number;
    retryDelay?: number;
    retryStatuses?: number[];
}

export async function submitFormWithRetry<T>(
    url: string,
    data: T,
    config: RetryConfig = {}
) : Promise<Response> {
    const {
    maxretries = 3,
    retryDelay = 1000,
    retryStatuses = [408, 429, 500, 502, 503, 504] } = config;

let lastError: Error | null = null;

for(let attempt = 1; attempt <= maxretries; attempt++) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data),
        });

        if (response.ok || !retryStatuses.includes(response.status )) {
            return response;
        }

        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));

    } catch(error) {
        lastError = error as Error;
        if(attempt === maxretries) throw lastError;

        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)));
       }
}
 throw lastError || new Error('Max retries exceddded');
}

