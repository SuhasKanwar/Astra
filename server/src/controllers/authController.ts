import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.ts";
import { JWT_SECRET } from "../lib/config.ts";

export async function signUpHandler(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists.",
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            }
        });
    } catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign-up.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function signInHandler(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email.",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password.",
            });
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "User signed in successfully.",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign-in.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function signOutHandler(req: Request, res: Response) {
    try {
        return res.status(200).json({
            success: true,
            message: "User signed out successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign-out.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}