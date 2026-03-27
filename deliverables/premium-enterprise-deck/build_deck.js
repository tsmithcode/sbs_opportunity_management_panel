const pptxgen = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");
const { safeOuterShadow } = require("./pptxgenjs_helpers/util");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "Monyawn";
pptx.subject = "Premium Enterprise Overview";
pptx.title = "Monyawn Premium Enterprise Overview";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
};

const C = {
  ink: "1A2533",
  text: "314153",
  muted: "66758A",
  paper: "F7F3EB",
  white: "FFFFFF",
  navy: "16324F",
  slate: "DCE5EC",
  gold: "C88B3A",
  green: "2C6B57",
  sand: "E8DDC7",
  red: "8C3F2F",
};

function baseSlide(slide, section, title, subtitle) {
  slide.background = { color: C.paper };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.42,
    fill: { color: C.navy },
    line: { color: C.navy },
  });
  slide.addText(section, {
    x: 0.45,
    y: 0.16,
    w: 3,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText(title, {
    x: 0.6,
    y: 0.72,
    w: 7.4,
    h: 0.6,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 1.33,
      w: 8.9,
      h: 0.45,
      fontFace: "Aptos",
      fontSize: 11,
      color: C.text,
      margin: 0,
    });
  }
}

function addFooter(slide, pageLabel) {
  slide.addText("www.monyawn.com", {
    x: 0.6,
    y: 7.0,
    w: 2.2,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 9,
    color: C.muted,
    margin: 0,
  });
  slide.addText(pageLabel, {
    x: 12.2,
    y: 7.0,
    w: 0.5,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 9,
    align: "right",
    color: C.muted,
    margin: 0,
  });
}

function addPill(slide, x, y, w, text, fill, color = C.ink) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.34,
    rectRadius: 0.08,
    fill: { color: fill },
    line: { color: fill },
    shadow: safeOuterShadow("000000", 0.12, 45, 1, 0.5),
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.08,
    w: w - 0.24,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 9,
    bold: true,
    color,
    align: "center",
    margin: 0,
  });
}

function addCard(slide, opts) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    rectRadius: 0.05,
    fill: { color: opts.fill || C.white },
    line: { color: opts.line || C.slate, width: 1 },
    shadow: safeOuterShadow("000000", 0.1, 45, 1.2, 0.5),
  });
  slide.addText(opts.title, {
    x: opts.x + 0.18,
    y: opts.y + 0.18,
    w: opts.w - 0.36,
    h: 0.28,
    fontFace: "Aptos Display",
    fontSize: 14,
    bold: true,
    color: opts.titleColor || C.ink,
    margin: 0,
  });
  if (opts.body) {
    slide.addText(opts.body, {
      x: opts.x + 0.18,
      y: opts.y + 0.54,
      w: opts.w - 0.36,
      h: opts.h - 0.72,
      fontFace: "Aptos",
      fontSize: 10.5,
      color: C.text,
      valign: "top",
      margin: 0,
      breakLine: false,
    });
  }
}

function addListBlock(slide, x, y, w, title, items, accent) {
  slide.addText(title, {
    x,
    y,
    w,
    h: 0.25,
    fontFace: "Aptos Display",
    fontSize: 13,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  items.forEach((item, index) => {
    const top = y + 0.34 + index * 0.46;
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: top + 0.07,
      w: 0.11,
      h: 0.11,
      fill: { color: accent },
      line: { color: accent },
    });
    slide.addText(item, {
      x: x + 0.18,
      y: top,
      w: w - 0.18,
      h: 0.22,
      fontFace: "Aptos",
      fontSize: 10.5,
      color: C.text,
      margin: 0,
    });
  });
}

// Slide 1
{
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: C.paper },
    line: { color: C.paper },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.65,
    y: 0,
    w: 4.683,
    h: 7.5,
    fill: { color: C.navy },
    line: { color: C.navy },
  });
  slide.addText("Monyawn", {
    x: 0.75,
    y: 0.85,
    w: 4.2,
    h: 0.45,
    fontFace: "Aptos Display",
    fontSize: 28,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  slide.addText("Premium Enterprise Overview", {
    x: 0.75,
    y: 1.42,
    w: 6.4,
    h: 0.52,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText(
    "Local-first opportunity operations with disciplined AI assistance, durable handoff packaging, and trust boundaries that stay tied to the real product.",
    {
      x: 0.75,
      y: 2.12,
      w: 6.8,
      h: 0.95,
      fontFace: "Aptos",
      fontSize: 14,
      color: C.text,
      valign: "top",
      margin: 0,
    }
  );
  addPill(slide, 0.78, 3.32, 1.72, "Local-first", C.sand);
  addPill(slide, 2.66, 3.32, 2.08, "Export-first", C.slate);
  addPill(slide, 4.92, 3.32, 2.54, "Human-reviewable AI", "D9E9E1");
  slide.addText("What this deck covers", {
    x: 0.78,
    y: 4.12,
    w: 3.2,
    h: 0.26,
    fontFace: "Aptos Display",
    fontSize: 13,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  addListBlock(
    slide,
    0.78,
    4.45,
    6.6,
    "",
    [
      "What Monyawn is and why local-first matters",
      "Current product posture and buyer-safe claim boundaries",
      "Review path for trust, diligence, and controlled topics",
      "Why serious buyers can evaluate the product without guesswork",
    ],
    C.gold
  );
  slide.addText("Current product truth", {
    x: 9.15,
    y: 0.96,
    w: 2.8,
    h: 0.28,
    fontFace: "Aptos Display",
    fontSize: 15,
    bold: true,
    color: C.white,
    margin: 0,
  });
  addListBlock(
    slide,
    9.15,
    1.38,
    3.25,
    "",
    [
      "No Monyawn-hosted opportunity-data retention for standard use",
      "Multi-opportunity workspace with one selected opportunity at a time",
      "ZIP handoff with JSON, Markdown, and PDF artifacts",
      "Sovereign and residency topics require controlled review",
    ],
    C.gold
  );
  addFooter(slide, "01");
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 2
{
  const slide = pptx.addSlide();
  baseSlide(
    slide,
    "Positioning",
    "What Monyawn is, in practical enterprise terms",
    "The strongest premium impression comes from clarity: strong workflow value, visible trust posture, and no inflated platform claims."
  );
  addCard(slide, {
    x: 0.7,
    y: 2.0,
    w: 3.9,
    h: 3.9,
    title: "Workflow value",
    fill: C.white,
    body: "Guided opportunity workflows, candidate story support, structured extraction, coaching, and durable handoff artifacts designed to keep decisions reviewable and portable.",
  });
  addCard(slide, {
    x: 4.73,
    y: 2.0,
    w: 3.9,
    h: 3.9,
    title: "Trust posture",
    fill: "F3F7FA",
    body: "Local-first by design. Export-first for durable retention. Human-reviewable AI. Controlled routing for sovereignty, legal, pricing, and deployment questions.",
  });
  addCard(slide, {
    x: 8.76,
    y: 2.0,
    w: 3.9,
    h: 3.9,
    title: "What it is not",
    fill: "FAF1EF",
    body: "Not a default hosted SaaS with company-side opportunity-data retention. Not a documented sovereign-hosted offer. Not a platform that should imply certifications without explicit evidence.",
  });
  addFooter(slide, "02");
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 3
{
  const slide = pptx.addSlide();
  baseSlide(
    slide,
    "Architecture",
    "Why local-first matters for enterprise review",
    "Monyawn’s current product posture reduces hidden data-custody assumptions and gives buyers a simpler starting point for trust evaluation."
  );
  addCard(slide, {
    x: 0.75,
    y: 2.05,
    w: 4.0,
    h: 3.75,
    title: "Current posture",
    fill: "FCFBF7",
    body: "User opportunity data stays on the user-controlled device in the current local-first product model. Durable handoff happens through ZIP export packages with canonical JSON restore authority.",
  });
  addCard(slide, {
    x: 4.98,
    y: 2.05,
    w: 3.45,
    h: 3.75,
    title: "Why buyers care",
    fill: C.white,
    body: "This posture makes data custody easier to reason about, keeps workflow artifacts portable, and avoids pretending Monyawn already offers hosted or sovereign capabilities it has not documented.",
  });
  addCard(slide, {
    x: 8.67,
    y: 2.05,
    w: 3.95,
    h: 3.75,
    title: "Controlled topics",
    fill: "EEF4F1",
    body: "Hosted deployment, residency guarantees, sovereign patterns, and non-standard commitments are handled through explicit review, not casual sales language.",
  });
  addPill(slide, 0.85, 6.1, 2.2, "Export-first handoff", C.sand);
  addPill(slide, 3.24, 6.1, 2.35, "No hidden custody", "E7F0F6");
  addPill(slide, 5.78, 6.1, 2.7, "Controlled review gates", "D9E9E1");
  addFooter(slide, "03");
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 4
{
  const slide = pptx.addSlide();
  baseSlide(
    slide,
    "Buyer Flow",
    "How buyers should review Monyawn",
    "The packet sequence is designed to reduce friction: sponsor first, trust second, controlled review only where needed."
  );
  addCard(slide, {
    x: 0.8,
    y: 2.0,
    w: 3.7,
    h: 4.15,
    title: "Packet 1",
    fill: C.white,
    body: "Executive or sponsor-first review.\n\nStart with the one-pager, the buyer packet, and the trust-center index to establish product truth, trust posture, and the current boundary model.",
  });
  addCard(slide, {
    x: 4.82,
    y: 2.0,
    w: 3.7,
    h: 4.15,
    title: "Packet 2",
    fill: "F3F7FA",
    body: "Security and trust review.\n\nUse the questionnaire kit, security overview, privacy policy, AI governance policy, and accessibility statement for deeper diligence.",
  });
  addCard(slide, {
    x: 8.84,
    y: 2.0,
    w: 3.7,
    h: 4.15,
    title: "Packet 3",
    fill: "FAF1EF",
    body: "Controlled review packet.\n\nOnly add sovereignty, deployment, redline, or advanced diligence materials when buyer questions explicitly require them.",
  });
  addFooter(slide, "04");
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 5
{
  const slide = pptx.addSlide();
  baseSlide(
    slide,
    "Governance",
    "What happens when a buyer asks for more",
    "Premium buyer experience does not mean saying yes faster. It means routing harder questions to the right owners without losing momentum."
  );
  addListBlock(slide, 0.75, 2.05, 3.7, "Answer directly", [
    "product definition",
    "privacy posture already documented",
    "security overview already documented",
    "AI governance already documented",
  ], C.green);
  addListBlock(slide, 4.78, 2.05, 3.65, "Escalate", [
    "sovereign or residency claims",
    "hosted deployment commitments",
    "pricing exceptions",
    "contract redlines",
    "compliance claims not yet documented",
  ], C.gold);
  addCard(slide, {
    x: 8.82,
    y: 2.0,
    w: 3.75,
    h: 3.95,
    title: "Core owners",
    fill: C.white,
    body: "Customer Assurance / Security Questionnaire Lead\nSecurity Lead\nPrivacy Lead\nData Residency / Sovereignty Lead\nEnterprise Counsel / Contracting Lead\nCRO / Revenue Lead",
  });
  addFooter(slide, "05");
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 6
{
  const slide = pptx.addSlide();
  baseSlide(
    slide,
    "Commercial Discipline",
    "Why commercial flexibility stays bounded",
    "Monyawn can be commercially serious without letting legal or pricing language outrun the actual product."
  );
  addCard(slide, {
    x: 0.78,
    y: 2.0,
    w: 4.15,
    h: 3.95,
    title: "Allowed",
    fill: "EEF4F1",
    body: "Implementation planning\nBuyer diligence coordination\nDocumentation and trust support\nEnablement and training\nPremium review cadence",
  });
  addCard(slide, {
    x: 4.96,
    y: 2.0,
    w: 4.15,
    h: 3.95,
    title: "Controlled review",
    fill: "FCFBF7",
    body: "Support expansion\nPricing exceptions\nResidency or sovereignty language\nHosted deployment assumptions\nRedlines that change delivery posture",
  });
  addCard(slide, {
    x: 9.14,
    y: 2.0,
    w: 3.45,
    h: 3.95,
    title: "Decline",
    fill: "FAF1EF",
    body: "Unsupported sovereign obligations\nUndocumented compliance claims\nContract language that contradicts local-first product truth",
  });
  addFooter(slide, "06");
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 7
{
  const slide = pptx.addSlide();
  baseSlide(
    slide,
    "Close",
    "Why Monyawn is credible to evaluate now",
    "The product and packet do not ask buyers to trust aspiration. They ask buyers to evaluate a disciplined current-state system with clear boundaries."
  );
  addCard(slide, {
    x: 0.82,
    y: 2.05,
    w: 5.55,
    h: 3.8,
    title: "What buyers get",
    fill: C.white,
    body: "A workflow platform with clear product truth, export-first handoff packaging, guided AI assistance, and a diligence posture that routes harder questions instead of papering over them.",
  });
  addCard(slide, {
    x: 6.72,
    y: 2.05,
    w: 5.8,
    h: 3.8,
    title: "Recommended next step",
    fill: "F3F7FA",
    body: "Use the buyer packet and security questionnaire kit for first-pass review. Then route sovereignty, deployment, pricing, and contract questions through the controlled review path if the deal requires them.",
  });
  addPill(slide, 0.95, 6.15, 2.15, "Clear product truth", C.sand);
  addPill(slide, 3.28, 6.15, 2.2, "Reviewable AI", "E7F0F6");
  addPill(slide, 5.66, 6.15, 2.15, "Portable handoff", "D9E9E1");
  addPill(slide, 8.0, 6.15, 3.0, "Disciplined commitment routing", "F5E3D8");
  addFooter(slide, "07");
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

pptx.writeFile({ fileName: "monyawn-premium-enterprise-overview.pptx" });
