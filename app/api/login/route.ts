import { NextResponse } from "next/server";
import fs from 'fs';
import path from "path";
import bcrypt from "bcryptjs";

const userFilePath = path.join(
    process.cwd(),
    'users.json'
);

export async function POST(req: Request) {
    try {
        const {email, password} = await req.json();

        if(!email || !password) {
            return NextResponse.json(
                {error: 'Email and password are required'},
                {status: 400}
            );
        }

        if(!fs.existsSync(userFilePath)) {
            return NextResponse.json(
                {error: 'Invalid Credentials'},
                {status: 401}
            );
        }

        const users = JSON.parse(
            fs.readFileSync(userFilePath, 'utf-8')
        );

        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if(!user) {
            return NextResponse.json(
                {error : "No accoun found with this email"},
                {status: 401}
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

         if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid email and password' },
                { status: 401 }
            );
        }

        const {password: _pw, ...safeUser} = user;
    
        return NextResponse.json({
                success: true,
                user: safeUser,
            });
      } catch {
            return NextResponse.json(
                {error: 'Login failed'},
                {status: 500}
            );

    }
}