/**
 * Formats an ISO timestamp for use in filenames (removes separators).
 */
export function formatTimestampForFile(value: string) {
  return value.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

/**
 * Creates a URL-safe slug from a string.
 */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/**
 * Triggers a client-side download of a text file.
 */
export function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Formats a date string for user-friendly display.
 */
export function formatDate(isoString: string) {
  if (!isoString) return "Never";
  return new Date(isoString).toLocaleString();
}

/**
 * Returns a kicker for the Monyawn brand identity.
 */
export function getMonyawnKicker() {
  return "We finna get to the monyan";
}
