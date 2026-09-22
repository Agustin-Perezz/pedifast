"use client";

import { useActiveCategory } from "../hooks/useActiveCategory";

type CategorySummary = {
  readonly key: string;
  readonly label: string;
  readonly emoji: string;
};

type CategoryNavProps = {
  readonly categories: readonly CategorySummary[];
};

export function CategoryNav({ categories }: CategoryNavProps) {
  const activeCategory = useActiveCategory(categories.map((c) => c.key));

  return (
    <div className="scrollbar-hide sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#F5F5F5] px-4 py-3 md:flex-wrap md:justify-center">
      {categories.map(({ key, label, emoji }) => (
        <button
          key={key}
          type="button"
          data-testid={`category-nav-${key}`}
          onClick={() => {
            document
              .getElementById(key)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === key
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          {emoji} {label}
        </button>
      ))}
    </div>
  );
}
