import { describe, expect, it } from "vitest";
import { createScopedFilename, formatTimestampForFile, slugify } from "../../src/package/utils";

describe("package utils", () => {
  it("builds safe slugs and scoped filenames", () => {
    expect(slugify("Senior Controls & Systems Engineer")).toBe("senior-controls-systems-engineer");
    expect(formatTimestampForFile("2026-04-02T14:33:21.000Z")).toBe("20260402T143321Z");
    expect(
      createScopedFilename(
        "2026-04-02T14:33:21.000Z",
        "Habasit America",
        "Application Engineer lifecycle",
        "md",
      ),
    ).toBe("habasit-america-application-engineer-lifecycle-20260402T143321Z.md");
  });
});
