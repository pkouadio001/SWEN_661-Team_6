const { _electron: electron } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;

async function runA11yScan() {
  const electronApp = await electron.launch({
    args: ["."],
    env: {
      ...process.env,
      ELECTRON_DISABLE_SECURITY_WARNINGS: "true",
    },
  });

  try {
    const page = await electronApp.firstWindow();

    await page.waitForLoadState("domcontentloaded");
    // Give React a moment to finish initial render before scanning.
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page }).analyze();
    const { violations } = results;

    if (!violations.length) {
      console.log("[axe] No accessibility violations found in the initial window.");
      return;
    }

    console.log(`[axe] Found ${violations.length} accessibility violation(s).`);

    violations.forEach((violation, index) => {
      console.log(
        `\n${index + 1}. [${violation.impact || "unknown"}] ${violation.id} - ${violation.help}`,
      );
      console.log(`   Help URL: ${violation.helpUrl}`);
      console.log(`   Affected nodes: ${violation.nodes.length}`);

      const firstTarget = violation.nodes[0]?.target?.join(" ");
      if (firstTarget) {
        console.log(`   Example target: ${firstTarget}`);
      }
    });

    process.exitCode = 1;
  } finally {
    await electronApp.close();
  }
}

runA11yScan().catch((error) => {
  console.error("[axe] Electron scan failed:", error);
  process.exit(2);
});
