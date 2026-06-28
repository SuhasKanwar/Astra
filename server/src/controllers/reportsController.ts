import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";

export async function createReportHandler(req: Request, res: Response) {
    try {
        const { number, scamType, description, severity } = req.body;

        if (!number || !scamType || !description) {
            return res.status(400).json({
                success: false,
                message: "Fields 'number', 'scamType', and 'description' are required.",
            });
        }

        let parsedSeverity = 3;
        if (severity !== undefined && severity !== null) {
            const sev = Number(severity);
            if (Number.isNaN(sev) || sev < 1 || sev > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Field 'severity' must be a number between 1 and 5.",
                });
            }
            parsedSeverity = Math.round(sev);
        }

        const report = await prisma.scamReport.create({
            data: {
                number: String(number).trim(),
                reporterId: req.userId as string,
                scamType: String(scamType).trim(),
                description: String(description).trim(),
                severity: parsedSeverity,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Report submitted successfully.",
            data: report,
        });
    } catch (error) {
        console.error("Error creating report:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the report.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function getReportsHandler(req: Request, res: Response) {
    try {
        const number = typeof req.query.number === "string" ? req.query.number.trim() : "";
        if (!number) {
            return res.status(400).json({
                success: false,
                message: "Query parameter 'number' is required.",
            });
        }

        const reports = await prisma.scamReport.findMany({
            where: { number },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching reports.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
