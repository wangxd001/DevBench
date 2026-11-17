import { describe, it, expect } from "vitest";
import { textToHtmlEntity, htmlEntityToText } from "../core";

describe("textToHtmlEntity", () => {
  it("encodes ampersand", () => {
    expect(textToHtmlEntity("&")).toBe("&amp;");
  });

  it("encodes angle brackets", () => {
    expect(textToHtmlEntity("<tag>")).toBe("&lt;tag&gt;");
  });

  it("encodes quotes", () => {
    expect(textToHtmlEntity('"quoted"')).toBe("&quot;quoted&quot;");
  });

  it("encodes apostrophe", () => {
    expect(textToHtmlEntity("it's")).toBe("it&#39;s");
  });

  it("leaves normal text unchanged", () => {
    expect(textToHtmlEntity("hello world")).toBe("hello world");
  });

  it("encodes Chinese characters as numeric entities", () => {
    const result = textToHtmlEntity("\u4e2d");
    expect(result).toBe("\u4e2d");
  });
});

describe("htmlEntityToText", () => {
  it("decodes named entities", () => {
    expect(htmlEntityToText("&amp;")).toBe("&");
    expect(htmlEntityToText("&lt;")).toBe("<");
    expect(htmlEntityToText("&gt;")).toBe(">");
    expect(htmlEntityToText("&quot;")).toBe('"');
  });

  it("decodes decimal numeric entities", () => {
    expect(htmlEntityToText("&#65;")).toBe("A");
  });

  it("decodes hex numeric entities", () => {
    expect(htmlEntityToText("&#x41;")).toBe("A");
  });

  it("returns plain text for decoded HTML (no execution)", () => {
    const result = htmlEntityToText("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(result).toBe("<script>alert(1)</script>");
  });

  it("handles mixed content", () => {
    expect(htmlEntityToText("a &amp; b")).toBe("a & b");
  });
});
