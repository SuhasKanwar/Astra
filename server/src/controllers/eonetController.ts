import type { Request, Response } from "express";
import axios from "axios";
import CacheService, { cacheService } from "../services/cacheService.ts";

const EONET_CACHE_TTL = 900;

export async function getNaturalEventsHandler(req: Request, res: Response) {
    try {
        const { limit = 500 } = req.query;
        const cacheKey = CacheService.generateCacheKey("eonet_events_v3", {});
        const cachedData = cacheService.get(cacheKey);

        if (cachedData) {
            return res.status(200).json({
                success: true,
                message: "Fetched natural events from NASA EONET successfully.",
                data: cachedData,
            });
        }

        const eonetUrl = `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=${limit}`;
        const response = await axios.get(eonetUrl, { timeout: 8000 });

        if (response.data && response.data.events) {
            const mappedData = response.data.events.map((event: any) => {
                const category = event.categories?.[0];
                const source = event.sources?.[0];
                const geom = event.geometry?.[0];

                return {
                    id: event.id,
                    title: event.title,
                    description: event.description || "",
                    closed: event.closed,
                    categoryId: category?.id || "",
                    categoryTitle: category?.title || "Unknown",
                    sourceId: source?.id || "",
                    sourceUrl: source?.url || "",
                    magnitudeValue: geom?.magnitudeValue || null,
                    magnitudeUnit: geom?.magnitudeUnit || "",
                    date: geom?.date || new Date().toISOString(),
                    geometryType: geom?.type || "Point",
                    longitude: geom?.coordinates?.[0] || 0,
                    latitude: geom?.coordinates?.[1] || 0,
                };
            }).filter((event: any) => event.longitude !== 0 && event.latitude !== 0);

            cacheService.set(cacheKey, mappedData, EONET_CACHE_TTL);
            return res.status(200).json({
                success: true,
                message: "Fetched natural events from NASA EONET successfully.",
                data: mappedData,
            });
        } else {
            throw new Error("Invalid EONET response format");
        }
    } catch (error) {
        console.error("Error fetching EONET events:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching natural events.",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}