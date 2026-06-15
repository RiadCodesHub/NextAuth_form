import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/src/lib/schema/register.schema";
import { ZodError } from "zod";
import fs from 'fs';
import path from 'path';
import bcrypt from "bcryptjs";

const userFilePath = path.join(process.cwd(), 'users.json');

if(!fs.existsSync(userFilePath)) {
    fs.writeFileSync(userFilePath, JSON.stringify([], null, 2));
}

export async function POST(request : NextRequest) {
     try {
        const body = await request.json();

       if(!body.termsAccepted) {
        return NextResponse.json(
            {error: "You must accept the terms and conditions"},
            {status: 400}
        );
       }
       
       const validData = registerSchema.parse(body);

        const users = JSON.parse(
            fs.readFileSync(userFilePath, 'utf-8')
        );

        const existingUser = users.find(
            (user: any) => 
                user.email.toLowerCase() === validData.email.toLowerCase() 
        );

        if(existingUser) {
            return NextResponse.json(
                {error: "Email already registered. Try again with a new email."},
                {status: 409}
            )
        }

        const hashedPassword = await bcrypt.hash(validData.password, 10)

        const newUser = {
            id: Date.now().toString(),
            email: validData.email,
            username: validData.userName,
            password: hashedPassword,
            fullName: validData.fullName,
            age: validData.age,
            phoneNumber: validData.phoneNumber,
            address: validData.address,
            newsletter: validData.newsLetter,
            termsAccepted: validData.termsAccepted,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        fs.writeFileSync(
            userFilePath,
            JSON.stringify(users, null, 2)
        )

        const userResponse = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            fullName: newUser.fullName,
            newsletter: newUser.newsletter,
            age: newUser.age,
            phoneNumber: newUser.phoneNumber,
            address: newUser.address,
            createdAt: newUser.createdAt
        }
        
        return NextResponse.json(
            {
                message: 'Registration successful',
                user: userResponse
            },
            {status: 201}
        );

     } catch (error) {
        if(error instanceof ZodError) {
        return NextResponse.json(
            {message: 'Validation failed', errors: error.flatten()},
            {status: 400}
        )
    }
    console.error('Registration error:', error);
    return NextResponse.json(
        {message: 'Internal server error'},
        {status: 500}
    );
    }
}