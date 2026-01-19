import path from "path";
import "dotenv/config";
import { PlaywrightReportParser } from "./playwright-report-parser";
import { AiClient } from "./ai-client";

async function analyze() {
  const reportPath = path.join(
    process.cwd(),
    "playwright-report/test-results.json"
  );
  const failures = PlaywrightReportParser.parseReport(reportPath);

  if (failures.length === 0) {
    console.log("No failed tests found.");
    return;
  }

  const aiClient = new AiClient(process.env.OPENAI_API_KEY!);

  for (const failure of failures) {
    const prompt = buildPrompt(failure);
    console.log("\n--- Prompt to LLM ---\n", prompt);

    const aiResponse = await aiClient.analyzeFailure(prompt);

    console.log("\n--- LLM Analysis ---\n", aiResponse);
    console.log("\n=============================\n");
  }
}

function buildPrompt(fail: any): string {
  return `
Playwright test failure:

Test: ${fail.testName}

Error:
${fail.errorMessage}

Stack:
${fail.stackTrace}

Location: ${fail.location ?? "unknown"}

Snippet:
${fail.snippet ?? "none"}

Please provide:
1) A summary of why the test failed.
2) Root cause analysis.
3) Suggestions to fix the test.
`;
}

analyze().catch(console.error);
