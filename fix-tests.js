const fs = require('fs');
const glob = require('fs').promises;
const path = require('path');

async function fix() {
  const files = ['tests/desktop-e2e.spec.ts', 'tests/habasit-town-hall.spec.ts', 'tests/mobile-e2e.spec.ts', 'tests/roundtrip.spec.ts'];
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix resetWorkspace goto
    content = content.replace(
      /await page\.goto\("\/"\);\s+await page\.waitForLoadState\("domcontentloaded"\);\s+await page\.getByRole\("button", \{ name: "Reset seeded state" \}\)\.click\(\);/,
      `await page.goto("/");\n  await page.waitForLoadState("domcontentloaded");\n  await page.getByRole("button", { name: /Go to Workspace/i }).click();\n  await page.getByRole("button", { name: "Reset to seeded state" }).click();`
    );
    
    // Fix resetWorkspace heading
    content = content.replace(
      /name: "Opportunity platform operations, not just a demo wizard\."/g,
      `name: /Operational cockpit for high-stakes career moves/i`
    );

    // Fix other "Reset seeded state"
    content = content.replace(
      /name: "Reset seeded state"/g,
      `name: "Reset to seeded state"`
    );

    // Fix "Export ZIP handoff package" (it has 🥱 now)
    content = content.replace(
      /name: "Export ZIP handoff package"/g,
      `name: /Export ZIP handoff package/i`
    );

    // Fix "Add artifact" -> "Add artifact 🥱"
    content = content.replace(
      /name: "Add artifact"/g,
      `name: /Add artifact/i`
    );

    // Fix "Create correspondence draft" -> "Create correspondence draft 🥱"
    content = content.replace(
      /name: "Create correspondence draft"/g,
      `name: /Create correspondence draft/i`
    );

    // Fix "Generate candidate story" -> "Generate candidate story 🥱"
    content = content.replace(
      /name: "Generate candidate story"/g,
      `name: /Generate candidate story/i`
    );

    // Fix "Save candidate story" -> "Save candidate story 🥱"
    content = content.replace(
      /name: "Save candidate story"/g,
      `name: /Save candidate story/i`
    );

    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}

fix();
