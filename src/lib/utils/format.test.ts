import { describe, expect, it } from "vitest";
import { AR_LOCALE, formatPrice } from "./format";

describe("AR_LOCALE", () => {
  it("targets Argentine Spanish formatting", () => {
    expect(AR_LOCALE).toBe("es-AR");
  });
});

describe("formatPrice", () => {
  it("formats a decimal price with es-AR separators", () => {
    expect(formatPrice(1234.56)).toBe("$1.234,56");
  });

  it("prefixes the price with a dollar sign and no space", () => {
    const formatted = formatPrice(100);

    expect(formatted.startsWith("$")).toBe(true);
    expect(formatted.startsWith("$ ")).toBe(false);
  });

  it("formats zero without decimal digits", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("formats whole numbers without a decimal part", () => {
    expect(formatPrice(1500)).toBe("$1.500");
  });

  it("groups large numbers with thousands separators", () => {
    expect(formatPrice(1234567.89)).toBe("$1.234.567,89");
  });

  it("does not group numbers below one thousand", () => {
    expect(formatPrice(123)).toBe("$123");
    expect(formatPrice(999)).toBe("$999");
  });

  it("keeps the first decimal digit and drops trailing zeros", () => {
    expect(formatPrice(0.5)).toBe("$0,5");
    expect(formatPrice(1.2)).toBe("$1,2");
  });

  it("rounds to at most three decimal places", () => {
    expect(formatPrice(1.23456)).toBe("$1,235");
    expect(formatPrice(1234.999)).toBe("$1.234,999");
  });

  it("renders sub-cent amounts with their decimal digits", () => {
    expect(formatPrice(0.001)).toBe("$0,001");
  });

  it("formats negative prices with a leading minus sign", () => {
    expect(formatPrice(-1234.5)).toBe("$-1.234,5");
  });
});
