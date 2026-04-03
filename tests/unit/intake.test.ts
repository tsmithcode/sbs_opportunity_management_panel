import { describe, expect, test } from "vitest";
import { intakeConversationSteps } from "../../packages/conversation-schema/src/intake";

describe("intakeConversationSteps", () => {
  // Test for signalType step
  test("signalType summarize function works correctly", () => {
    const step = intakeConversationSteps[0];
    expect(step.summarize?.("recruiter_email")).toBe("Recruiter text/email");
    expect(step.summarize?.("job_link")).toBe("Job link");
    expect(step.summarize?.("unknown_value")).toBe("unknown_value");
    expect(step.summarize?.(null)).toBe("");
  });

  // Test for signalText step
  test("signalText validate function works correctly", () => {
    const step = intakeConversationSteps[1];
    expect(step.validate?.("This is a sufficiently long string.")).toBeNull();
    expect(step.validate?.("short")).toBe(
      "Drop a little more detail so the engine has something real to work with.",
    );
    expect(step.validate?.("       ")).toBe(
      "Drop a little more detail so the engine has something real to work with.",
    );
    expect(step.validate?.("")).toBe(
      "Drop a little more detail so the engine has something real to work with.",
    );
  });

  test("signalText summarize function works correctly", () => {
    const step = intakeConversationSteps[1];
    expect(step.summarize?.("This is a long string that should be trimmed.")).toBe(
      "This is a long string that should be trimmed.",
    );
    expect(step.summarize?.("  Another  string  with  extra  spaces  ")).toBe(
      "Another string with extra spaces",
    );
  });

  // Test for signalUrl step
  test("signalUrl isVisible function works correctly", () => {
    const step = intakeConversationSteps[2];
    expect(step.isVisible?.({ signalType: "job_link" })).toBe(true);
    expect(step.isVisible?.({ signalType: "recruiter_email" })).toBe(true);
    expect(step.isVisible?.({ signalType: "note" })).toBe(false);
  });

  test("signalUrl validate function works correctly", () => {
    const step = intakeConversationSteps[2];
    // Requires URL
    expect(step.validate?.(undefined, { signalType: "job_link" })).toBe(
      "A job link needs the actual URL.",
    );
    expect(step.validate?.("", { signalType: "job_link" })).toBe(
      "A job link needs the actual URL.",
    );
    expect(step.validate?.("http://example.com", { signalType: "job_link" })).toBeNull();

    // Does not require URL
    expect(step.validate?.(undefined, { signalType: "note" })).toBeNull();
    expect(step.validate?.("", { signalType: "note" })).toBeNull();

    // Invalid format
    expect(step.validate?.("not a url", { signalType: "job_link" })).toBe(
      "Use a full link starting with http:// or https://",
    );
    expect(step.validate?.(123, { signalType: "job_link" })).toBe(
      "This link needs to be plain text.",
    ); // Test for typeof value !== 'string'
  });

  test("signalUrl summarize function works correctly", () => {
    const step = intakeConversationSteps[2];
    console.log("step.summarize for signalUrl:", step.summarize); // Debugging line
    expect(step.summarize?.("http://example.com/long/url")).toBe("http://example.com/long/url");
    expect(step.summarize?.(null)).toBe("");
  });

  // Test for fullName step
  test("fullName validate function works correctly", () => {
    const step = intakeConversationSteps[3];
    expect(step.validate?.("John Doe")).toBeNull();
    expect(step.validate?.("Jo")).toBeNull(); // min length 2
    expect(step.validate?.("J")).toBe("Drop the real name you want us to use.");
    expect(step.validate?.("")).toBe("Drop the real name you want us to use.");
  });

  // Test for accountName step
  test("accountName validate function works correctly", () => {
    const step = intakeConversationSteps[4];
    expect(step.validate?.("My Company")).toBeNull();
    expect(step.validate?.("MC")).toBeNull(); // min length 2
    expect(step.validate?.("M")).toBe("Give the base a real name so the workspace has a home.");
    expect(step.validate?.("")).toBe("Give the base a real name so the workspace has a home.");
  });

  // Test for accountType step
  test("accountType summarize function works correctly", () => {
    const step = intakeConversationSteps[5];
    expect(step.summarize?.("individual")).toBe("Solo");
    expect(step.summarize?.("enterprise")).toBe("Crew / org");
    expect(step.summarize?.("unknown")).toBe("Solo"); // Corrected expectation
    expect(step.summarize?.(null)).toBe("");
  });

  // Test for email step
  test("email validate function works correctly", () => {
    const step = intakeConversationSteps[6];
    expect(step.validate?.("test@example.com")).toBeNull();
    expect(step.validate?.("not-an-email")).toBe("Drop a real-looking email or skip it for now.");
    expect(step.validate?.(undefined)).toBeNull(); // Optional field
    expect(step.validate?.("")).toBeNull(); // Optional field
  });

  // Test for companyName step
  test("companyName validate function works correctly", () => {
    const step = intakeConversationSteps[7];
    expect(step.validate?.("Acme Corp")).toBeNull();
    expect(step.validate?.("AC")).toBeNull(); // min length 2
    expect(step.validate?.("A")).toBe("Give the play a real company name.");
    expect(step.validate?.("")).toBe("Give the play a real company name.");
  });

  // Test for roleTitle step
  test("roleTitle validate function works correctly", () => {
    const step = intakeConversationSteps[8];
    expect(step.validate?.("Software Engineer")).toBeNull();
    expect(step.validate?.("SE")).toBeNull(); // min length 2
    expect(step.validate?.("S")).toBe("Drop the actual role title.");
    expect(step.validate?.("")).toBe("Drop the actual role title.");
  });

  // Test for pathway step
  test("pathway summarize function works correctly", () => {
    const step = intakeConversationSteps[9];
    expect(step.summarize?.("w2")).toBe("Payroll job");
    expect(step.summarize?.("1099")).toBe("Contract bag");
    expect(step.summarize?.("unknown")).toBe("Payroll job"); // Corrected expectation
    expect(step.summarize?.(null)).toBe("");
  });
});
