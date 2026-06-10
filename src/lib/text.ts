export function compactText(text: string, maxChars: number) {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return t;
  if (t.length <= maxChars) return t;
  const head = t.slice(0, maxChars);
  const lastSpace = head.lastIndexOf(" ");
  const clipped = lastSpace >= Math.floor(maxChars * 0.6) ? head.slice(0, lastSpace) : head;
  return `${clipped.trimEnd()}...`;
}
