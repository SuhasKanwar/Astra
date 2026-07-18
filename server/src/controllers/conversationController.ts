import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getConversationHandler(req: Request, res: Response) {
    try {
        const userId = req?.userId!;
        const conversations = await prisma.conversation.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                title: true,
                startedAt: true,
                variant: true,
                lastUpdated: true,
                _count: {
                    select: {
                        chats: true,
                    }
                }
            },
            orderBy: {
                lastUpdated: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            message: "Conversations fetched successfully",
            data: conversations,
        });
    } catch (error) {
        console.error("Error getting conversations:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while getting the conversation.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function postConversationHandler(req: Request, res: Response) {
    try {
        const userId = req?.userId!;
        const { title, variant } = req.body;
        if (!title || !variant) {
            return res.status(400).json({
                success: false,
                message: "Conversation title and variant are required.",
            });
        }
        const conversation = await prisma.conversation.create({
            data: {
                userId: userId,
                title: title,
                variant: variant,
                startedAt: new Date(),
                lastUpdated: new Date()
            }
        });
        return res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            data: conversation,
        });
    } catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the conversation.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function deleteConversationHandler(req: Request, res: Response) {
    try {
        const userId = req?.userId!;
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID is required.",
            });
        }
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId as string,
                userId: userId,
            }
        });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }
        await prisma.conversation.delete({
            where: {
                id: conversationId as string
            }
        });
        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the conversation.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function renameConversationHandler(req: Request, res: Response) {
    try {
        const userId = req?.userId!;
        const { conversationId } = req.params;
        const { title } = req.body;
        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID is required.",
            });
        }
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Conversation title is required.",
            });
        }
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId as string,
                userId: userId,
            }
        });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }
        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId as string
            },
            data: {
                title: title
            }
        });
        return res.status(200).json({
            success: true,
            message: "Conversation renamed successfully",
            data: updatedConversation,
        });
    } catch (error) {
        console.error("Error renaming conversation:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while renaming the conversation.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}