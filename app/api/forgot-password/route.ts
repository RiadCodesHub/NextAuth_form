import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const userFilePath = path.join(
    process.cwd(),
    'users.json'
);

const resetFilePath = path.join(
    process.cwd(),
    'resetTokens.json'
);

export async function POST(req: Request) {
    try {
        const {email} = await req.json();
        const users = JSON.parse(
            fs.readFileSync(userFilePath, 'utf-8')
        );

        const user = users.find((u: any) => u.email === email);

        if(!user) {
            return NextResponse.json(
                {error: 'No account found with this email'},
                {status: 404}
            );
        }
        const token = Math.random().toString(36).substring(2, 10);

        const expiry = Date.now() + 60 * 60 * 1000;

        let tokens: any = {};

        if(fs.existsSync(resetFilePath)) {
            tokens = JSON.parse(fs.readFileSync(resetFilePath, 'utf-8'));
        }

        tokens[email] = {
            token,
            expiry
        };

        fs.writeFileSync(
            resetFilePath,
            JSON.stringify(tokens, null, 2)
        );

        return NextResponse.json({
            success: true,
            token
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {error: 'Failed to generate token',
             details: String(error)
            },
            {status: 500}
        )
    }
}