function stripTags(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, "").trim();
}

export function extractEditorHtmlContent(html: string): string {
  const outputMatch = html.match(/<div id="output">([\s\S]*?)<\/div>\s*<\/body>/i);
  if (outputMatch) {
    return outputMatch[1]!.trim();
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1]!.trim() : html.trim();
}

export function buildExpectedBodySnippet(html: string, maxChars = 120): string {
  const bodyHtml = extractEditorHtmlContent(html);
  const text = normalizeText(stripTags(bodyHtml));
  if (text.length <= maxChars) {
    return text;
  }
  return text.slice(0, maxChars);
}

export function editorContainsExpectedBody(editorText: string, expectedSnippet: string): boolean {
  const normalizedEditor = normalizeText(editorText);
  const normalizedExpected = normalizeText(expectedSnippet);
  if (!normalizedEditor || !normalizedExpected) {
    return false;
  }
  return normalizedEditor.includes(normalizedExpected);
}

export function shouldUseDomInjectionFallback(
  editorText: string,
  expectedSnippet: string,
): boolean {
  return !editorContainsExpectedBody(editorText, expectedSnippet);
}

export function shouldSaveDraft(submit: boolean): boolean {
  return submit;
}

export function canOpenArticleComposer(params: {
  menuExists: boolean;
  bodyText: string;
}): boolean {
  if (params.menuExists) {
    return true;
  }
  const text = normalizeText(params.bodyText);
  return text.includes("新的创作") && text.includes("文章");
}
