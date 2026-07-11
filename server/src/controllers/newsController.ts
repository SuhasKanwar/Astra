import type { Request, Response } from "express";
import NewsAPI from "newsapi";
import axios from "axios";
import { NEWS_API_KEY, FALLBACK_NEWS_SOURCES, NEWS_CACHE_TTL } from "../lib/config.ts";
import CacheService, { cacheService } from "../services/cacheService.ts";
import { parseSimpleRss } from "../utils/news.ts";

const newsapi = new (NewsAPI as any)(NEWS_API_KEY);

export async function getHeadlinesHandler(req: Request, res: Response) {
  try {
    const { category = "general", country = "in", page = 1, pageSize = 20 } = req.query;

    const queryParams = {
      category: String(category),
      country: String(country),
      page: Number(page),
      pageSize: Number(pageSize)
    };
    const cacheKey = CacheService.generateCacheKey("headlines", queryParams);

    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        message: "Fetched top headlines successfully.",
        data: cachedData,
      });
    }

    try {
      const response = await newsapi.v2.topHeadlines(queryParams);
      if (!response || !response.articles || response.articles.length === 0) {
        throw new Error("NewsAPI returned 0 articles");
      }
      cacheService.set(cacheKey, response, NEWS_CACHE_TTL / 1000);

      return res.status(200).json({
        success: true,
        message: "Fetched top headlines successfully.",
        data: response,
      });
    } catch (apiError) {
      console.warn("NewsAPI failed, falling back to Google News RSS...", apiError);

      const fallbackResponse = await axios.get(FALLBACK_NEWS_SOURCES.GOOGLE_NEWS.BASE_URL, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });
      const fallbackData = parseSimpleRss(fallbackResponse.data, "Google News");
      cacheService.set(cacheKey, fallbackData, NEWS_CACHE_TTL / 1000);

      return res.status(200).json({
        success: true,
        message: "Fetched top headlines from fallback source.",
        data: fallbackData,
      });
    }
  } catch (error) {
    console.error("Error fetching headlines:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching top headlines.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function searchNewsHandler(req: Request, res: Response) {
  try {
    const { q, page = 1, pageSize = 20, language = "en", sortBy = "publishedAt" } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'q' is required.",
      });
    }

    const queryParams = {
      q: String(q),
      language: String(language),
      sortBy: String(sortBy),
      page: Number(page),
      pageSize: Number(pageSize)
    };
    const cacheKey = CacheService.generateCacheKey("search", queryParams);

    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        message: "Fetched news successfully.",
        data: cachedData,
      });
    }

    try {
      const response = await newsapi.v2.everything(queryParams);
      if (!response || !response.articles || response.articles.length === 0) {
        throw new Error("NewsAPI returned 0 articles");
      }
      cacheService.set(cacheKey, response, NEWS_CACHE_TTL / 1000);

      return res.status(200).json({
        success: true,
        message: "Fetched news successfully.",
        data: response,
      });
    } catch (apiError) {
      console.warn("NewsAPI failed, falling back to Google News Search RSS...", apiError);

      const fallbackUrl = `${FALLBACK_NEWS_SOURCES.GOOGLE_NEWS.SEARCH_BASE}${encodeURIComponent(String(q))}`;
      const fallbackResponse = await axios.get(fallbackUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });
      const fallbackData = parseSimpleRss(fallbackResponse.data, "Google News");
      cacheService.set(cacheKey, fallbackData, NEWS_CACHE_TTL / 1000);

      return res.status(200).json({
        success: true,
        message: "Fetched news from fallback source.",
        data: fallbackData,
      });
    }
  } catch (error) {
    console.error("Error searching news:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching news.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}