export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function formatTimestampForFile(value: string): string {
  return value.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

export function createScopedFilename(
  generatedAt: string,
  scope: string,
  name: string,
  extension: "md" | "pdf" | "zip",
): string {
  return `${slugify(scope)}-${slugify(name)}-${formatTimestampForFile(generatedAt)}.${extension}`;
}
