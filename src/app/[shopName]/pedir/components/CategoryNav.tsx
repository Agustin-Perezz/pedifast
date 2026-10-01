"use client";

import { Button } from "@/components/ui/button";

import { useActiveCategory } from "../hooks/useActiveCategory";

type CategorySummary = {
  readonly key: string;
  readonly label: string;
};

type CategoryNavProps = {
  readonly categories: readonly CategorySummary[];
};

export function CategoryNav({ categories }: CategoryNavProps) {
  const activeCategory = useActiveCategory(categories.map((c) => c.key));

  return (
    <div className="scrollbar-hide sticky top-16 z-10 flex gap-2 overflow-x-auto bg-background px-5 py-2 md:flex-wrap md:justify-center">
      {categories.map(({ key, label }) => (
        <Button
          key={key}
          type="button"
          variant="ghost"
          data-testid={`category-nav-${key}`}
          onClick={() => {
            document
              .getElementById(key)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold active:scale-95 ${
            activeCategory === key
              ? "bg-inverse-surface text-inverse-on-surface"
              : "bg-surface-container-high text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
