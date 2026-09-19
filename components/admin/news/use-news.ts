// use-news.ts
"use client";

import { useState, useEffect } from "react";
import { getNews } from "./api";
import type { NewsItemData } from "./types";

/**
 * Custom hook to fetch news items.
 * Returns the list of news, loading state, and any error encountered.
 */
export const useNews = () => {
  const [news, setNews] = useState<NewsItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNews();
        const fetched = (response as any).news || response;
        setNews(fetched);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return { news, loading, error } as const;
};
