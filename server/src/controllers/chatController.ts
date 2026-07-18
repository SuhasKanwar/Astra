import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { aiService } from "../services/aiService";

export async function getChatHandler(req: Request, res: Response) {
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
                userId: userId
            }
        });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }
        const messages = await prisma.chat.findMany({
            where: {
                conversationId: conversationId as string
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages,
        });
    } catch (error) {
        console.error("Error getting chat:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while getting the chat.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function postChatHandler(req: Request, res: Response) {
    try {
        const userId = req?.userId!;
        const { conversationId } = req.params;
        const { content } = req.body;

        if (!conversationId) {
            return res.status(400).json({ success: false, message: "Conversation ID is required." });
        }
        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required." });
        }

        const conversation = await prisma.conversation.findFirst({
            where: { id: conversationId as string, userId: userId }
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found" });
        }

        const prevChats = await prisma.chat.findMany({
            where: { conversationId: conversationId as string },
            orderBy: { createdAt: 'asc' }
        });

        const formattedHistory = prevChats.map(chat => ({
            role: chat.sender === 'user' ? 'user' : 'assistant',
            content: chat.content || ""
        }));

        const userChat = await prisma.chat.create({
            data: {
                conversationId: conversationId as string,
                sender: 'user',
                content: content,
                type: 'text'
            }
        });

        const aiResponse = await aiService.post('/api/agent/query', {
            query: content,
            session_history: formattedHistory
        });

        const botText = aiResponse?.data?.response || "I'm sorry, I couldn't generate a response.";

        const botChat = await prisma.chat.create({
            data: {
                conversationId: conversationId as string,
                sender: 'bot',
                content: botText,
                type: 'text'
            }
        });

        await prisma.conversation.update({
            where: { id: conversationId as string },
            data: { lastUpdated: new Date() }
        });

        return res.status(201).json({
            success: true,
            message: "Chat processed successfully",
            data: [userChat, botChat]
        });
    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the chat.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}