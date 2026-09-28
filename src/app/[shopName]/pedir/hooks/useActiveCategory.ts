"use client";

import { useEffect, useState } from "react";

export function useActiveCategory(groupedCategoryIds: readonly string[]) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    groupedCategoryIds[0] ?? null,
  );

  useEffect(() => {
    const root = document.querySelector("[data-shop-catalog]");

    if (!root) {
      return;
    }

    const sections = Array.from(root.querySelectorAll("section[id]"));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return activeCategory;
}
