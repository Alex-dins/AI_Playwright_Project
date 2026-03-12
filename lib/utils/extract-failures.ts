import path from "path";
import { PlaywrightReportParser } from "./playwright-report-parser";

function resolveArg(value: string | undefined, fallback: string): string {
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  return path.isAbsolute(value) ? value : path.join(process.cwd(), value);
}

function main() {
  const [, , reportArg, outputArg] = process.argv;

  const reportPath = resolveArg(
    reportArg,
    path.join(process.cwd(), "playwright-report/test-results.json"),
  );
  const outputPath = resolveArg(
    outputArg,
    path.join(process.cwd(), ".playwright-cli/failures.json"),
  );

  const failures = PlaywrightReportParser.parseAndWriteFailures(
    reportPath,
    outputPath,
  );

  console.log(
    JSON.stringify(
      {
        reportPath,
        outputPath,
        failuresCount: failures.length,
      },
      null,
      2,
    ),
  );
}

main();
