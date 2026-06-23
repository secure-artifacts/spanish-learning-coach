import { useCallback, useEffect, useState } from 'react';

export interface AccumulatedItem {
  id: string;
  es: string;
  zh: string;
  note?: string;
  source?: string;
  addedAt: number;
  reviewCount: number;
}

const STORAGE_KEY = 'es-coach-accumulation-v1';

export function useAccumulation() {
  const [items, setItems] = useState<AccumulatedItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AccumulatedItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (entry: { es: string; zh: string; note?: string; source?: string }) => {
      setItems((prev) => {
        if (prev.some((i) => i.es.toLowerCase() === entry.es.toLowerCase())) return prev;
        return [
          ...prev,
          {
            id: `${Date.now()}-${entry.es}`,
            ...entry,
            addedAt: Date.now(),
            reviewCount: 0,
          },
        ];
      });
    },
    [],
  );

  const addMany = useCallback(
    (entries: { es: string; zh: string; note?: string }[], source?: string) => {
      entries.forEach((e) => addItem({ ...e, source }));
    },
    [addItem],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const markReviewed = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, reviewCount: i.reviewCount + 1 } : i)),
    );
  }, []);

  const clearAll = useCallback(() => {
    if (window.confirm('清空积累本？')) setItems([]);
  }, []);

  return { items, addItem, addMany, removeItem, markReviewed, clearAll };
}
