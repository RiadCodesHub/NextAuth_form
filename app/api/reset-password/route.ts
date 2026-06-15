import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { error } from "console";
import { passwordSchema } from "@/src/lib/schema/register.schema";
import { ZodError } from "zod";
import bcrypt from 'bcryptjs'

const userFilePath = path.join(
    process.cwd(),
    'users.json'
)

const resetFilePath = path.join(
    process.cwd(),
    'resetTokens.json'
);

export async function POST(req: Request) {
   try {
    const {email, token, password} = await req.json();

    if(!email || !token || !password) {
        return NextResponse.json(
            {error: 'Email, token and password are required'},
            {status: 400}
        )
    }

    passwordSchema.parse(password);

    if(!fs.existsSync(resetFilePath)) {
        return NextResponse.json(
            {error: 'No reset request found'},
            {status: 400 }
        );
    }

    const tokens = JSON.parse(
        fs.readFileSync(resetFilePath, 'utf-8')
    );

    const resetData = tokens[email];

    if(!resetData) {
        return NextResponse.json(
            {error: 'Invalid token'},
            {status: 400}
        );
    }

    if(resetData.token !== token) {
        return NextResponse.json(
            {error: 'Invalid token'},
            { status: 400}
        );
    }

    if(Date.now() > resetData.expiry) {
        delete tokens[email];
        fs.writeFileSync(resetFilePath, JSON.stringify(tokens, null, 2));
        return NextResponse.json(
            {error: 'Token expired. Please request a new password reset'},
            {status: 400}
        );
    }

    if(!fs.existsSync(userFilePath)) {
        return NextResponse.json(
            {error: 'User not found'},
            {status: 404}
        );
    }

    const users = JSON.parse(
        fs.readFileSync(userFilePath, "utf-8")
    );

    const index = users.findIndex(
        (u: any) => u.email === email
    );

    if(index === -1) {
        return NextResponse.json(
            {error: 'User not found'},
            {status: 404}
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[index].password = hashedPassword;

    fs.writeFileSync(
        userFilePath,
        JSON.stringify(users, null, 2)
    );

    delete tokens[email];
    fs.writeFileSync(resetFilePath, JSON.stringify(tokens, null, 2));

    return NextResponse.json({
        success: true,
        message: 'Password reset successful'
    });    
   } catch(error) {

    if(error instanceof ZodError) {
        return NextResponse.json(
        {error: error.issues[0].message,
         details: error.flatten(),
    }, {status: 400});
}
    return NextResponse.json(
        {error: 'Failed to Reset password. Please try again.'},
        {status: 500}
    );
   }
}

