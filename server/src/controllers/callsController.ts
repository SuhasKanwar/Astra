import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";
import { microserviceApi } from "../lib/api.ts";

type SampleReport = {
    scamType: string;
    description: string;
    severity: number;
    createdAt: Date;
};

type Verdict = {
    number: string;
    riskScore: number;
    label: string;
    scamType: string | null;
    reportCount: number;
    explanation: string;
    recommendation: string;
    reports: SampleReport[];
};

function labelFromRisk(riskScore: number): string {
    if (riskScore >= 70) return "Scam";
    if (riskScore >= 40) return "Suspicious";
    if (riskScore >= 1) return "Safe";
    return "Unknown";
}

function mostCommonScamType(reports: { scamType: string }[]): string {
    const counts = new Map<string, number>();
    for (const r of reports) {
        counts.set(r.scamType, (counts.get(r.scamType) ?? 0) + 1);
    }
    let best = reports[0]?.scamType ?? "Unknown";
    let bestCount = 0;
    for (const [type, count] of counts) {
        if (count > bestCount) {
            best = type;
            bestCount = count;
        }
    }
    return best;
}

export async function lookupNumberHandler(req: Request, res: Response) {
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

        const reportCount = reports.length;

        // Case (b): no community reports → Unknown verdict, skip AI, no CallCheck log.
        if (reportCount === 0) {
            const verdict: Verdict = {
                number,
                riskScore: 10,
                label: "Unknown",
                scamType: null,
                reportCount: 0,
                explanation: "No community reports for this number yet.",
                recommendation: "No history found — stay cautious with unknown callers.",
                reports: [],
            };
            return res.status(200).json({
                success: true,
                data: verdict,
            });
        }

        // Community scoring.
        const avgSeverity = reports.reduce((sum, r) => sum + r.severity, 0) / reportCount;
        const communityScore = Math.min(95, 30 + reportCount * 12 + Math.round(avgSeverity * 5));

        const sampleReports: SampleReport[] = reports.slice(0, 3).map((r) => ({
            scamType: r.scamType,
            description: r.description,
            severity: r.severity,
            createdAt: r.createdAt,
        }));

        let verdict: Verdict;

        try {
            // Call the AI service to classify the caller.
            const aiResponse = await microserviceApi.post(
                "/classify/caller",
                {
                    number,
                    reports: reports.map((r) => ({
                        scamType: r.scamType,
                        description: r.description,
                        severity: r.severity,
                    })),
                },
                { timeout: 8000 }
            );

            const ai = aiResponse.data as {
                scamType?: string;
                riskScore?: number;
                label?: string;
                explanation?: string;
                recommendation?: string;
            };

            const aiRisk = typeof ai.riskScore === "number" ? ai.riskScore : communityScore;
            const finalRisk = Math.round((communityScore + aiRisk) / 2);
            const label = labelFromRisk(finalRisk);

            verdict = {
                number,
                riskScore: finalRisk,
                label,
                scamType: ai.scamType ?? mostCommonScamType(reports),
                reportCount,
                explanation:
                    ai.explanation ??
                    `Reported ${reportCount} time(s) by the community, most often as ${mostCommonScamType(reports)}.`,
                recommendation:
                    ai.recommendation ??
                    "Be cautious. Do not share personal info, OTPs, or money. Verify independently before acting.",
                reports: sampleReports,
            };
        } catch (aiError) {
            // Case (d): AI failed/timed out → community-only fallback. Never 500.
            console.error(
                "AI classify/caller failed, falling back to community-only verdict:",
                aiError instanceof Error ? aiError.message : String(aiError)
            );

            const finalRisk = communityScore;
            const label = labelFromRisk(finalRisk);
            const scamType = mostCommonScamType(reports);

            verdict = {
                number,
                riskScore: finalRisk,
                label,
                scamType,
                reportCount,
                explanation: `This number has ${reportCount} community report(s), most commonly flagged as "${scamType}" (average severity ${avgSeverity.toFixed(
                    1
                )}/5). Community signals indicate a ${label.toLowerCase()} caller.`,
                recommendation:
                    label === "Scam"
                        ? "Do not answer, share personal info, OTPs, or pay anything. Hang up, block, and report this number."
                        : "Stay cautious. Do not share personal info or OTPs, and verify the caller's identity independently before acting.",
                reports: sampleReports,
            };
        }

        // Log the check for the current user (best-effort; don't fail the lookup if logging fails).
        try {
            await prisma.callCheck.create({
                data: {
                    userId: req.userId as string,
                    number,
                    riskScore: verdict.riskScore,
                    label: verdict.label,
                    scamType: verdict.scamType,
                },
            });
        } catch (logError) {
            console.error(
                "Failed to log CallCheck:",
                logError instanceof Error ? logError.message : String(logError)
            );
        }

        return res.status(200).json({
            success: true,
            data: verdict,
        });
    } catch (error) {
        console.error("Error during number lookup:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during number lookup.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export async function getChecksHandler(req: Request, res: Response) {
    try {
        const checks = await prisma.callCheck.findMany({
            where: { userId: req.userId as string },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return res.status(200).json({
            success: true,
            data: checks,
        });
    } catch (error) {
        console.error("Error fetching checks:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching checks.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
