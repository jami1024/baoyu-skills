import { describe, expect, it } from "bun:test";

import {
  buildExpectedBodySnippet,
  canOpenArticleComposer,
  editorContainsExpectedBody,
  extractEditorHtmlContent,
  shouldSaveDraft,
  shouldUseDomInjectionFallback,
} from "./wechat-article.helpers.ts";

describe("wechat-article helpers", () => {
  it("extracts output body html when md renderer wraps content in #output", () => {
    const html = [
      "<html>",
      "<body>",
      '<div id="output"><p>第一段</p><p>第二段</p></div>',
      "</body>",
      "</html>",
    ].join("");

    expect(extractEditorHtmlContent(html)).toBe("<p>第一段</p><p>第二段</p>");
  });

  it("builds a verification snippet from html text content", () => {
    const html = '<div id="output"><p>这是第一段。</p><p>这里是第二段。</p></div>';

    expect(buildExpectedBodySnippet(html)).toBe("这是第一段。这里是第二段。");
  });

  it("treats unrelated editor text as a failed body write", () => {
    const expected = "这是正文第一段这里是正文第二段";
    const actual = "请输入正文";

    expect(editorContainsExpectedBody(actual, expected)).toBe(false);
  });

  it("accepts editor text when it contains the expected body snippet", () => {
    const expected = "这是正文第一段这里是正文第二段";
    const actual = "这是正文第一段\n这里是正文第二段\n图片说明";

    expect(editorContainsExpectedBody(actual, expected)).toBe(true);
  });

  it("requires dom injection fallback when paste result does not contain expected body", () => {
    expect(shouldUseDomInjectionFallback("请输入正文", "这是正文第一段")).toBe(true);
    expect(shouldUseDomInjectionFallback("这是正文第一段", "这是正文第一段")).toBe(false);
  });

  it("only saves draft when submit mode is explicitly enabled", () => {
    expect(shouldSaveDraft(true)).toBe(true);
    expect(shouldSaveDraft(false)).toBe(false);
  });

  it("accepts either the legacy creation menu or the new visible entry text as ready", () => {
    expect(canOpenArticleComposer({ menuExists: true, bodyText: "" })).toBe(true);
    expect(canOpenArticleComposer({ menuExists: false, bodyText: "新的创作\n文章\n贴图" })).toBe(true);
    expect(canOpenArticleComposer({ menuExists: false, bodyText: "首页\n草稿箱" })).toBe(false);
  });
});
