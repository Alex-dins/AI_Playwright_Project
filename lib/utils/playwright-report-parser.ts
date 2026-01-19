import * as fs from "fs";

export interface FailureContext {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  location?: string;
  snippet?: string;
}

export class PlaywrightReportParser {
  static parseReport(reportPath: string): FailureContext[] {
    const raw = fs.readFileSync(reportPath, "utf-8");
    const report = JSON.parse(raw);

    const failures: FailureContext[] = [];

    function processTest(test: any) {
      test.results?.forEach((result: any) => {
        if (result.status === "failed" && result.error) {
          failures.push({
            testName: test.title,
            errorMessage: result.error.message,
            stackTrace: result.error.stack,
            location: result.error.location
              ? `${result.error.location.file}:${result.error.location.line}`
              : undefined,
            snippet: result.error.snippet?.replace(/\u001b\[[0-9;]*m/g, ""),
          });
        }
      });
    }

    function traverseSuite(suite: any) {
      // Recurse nested suites:
      suite.suites?.forEach((child: any) => traverseSuite(child));

      // Process any specs (Playwright uses "specs" that contain tests):
      suite.specs?.forEach((spec: any) => {
        spec.tests?.forEach((test: any) => processTest(test));
      });

      // Also process direct tests (some JSON can include tests directly):
      suite.tests?.forEach((test: any) => processTest(test));
    }

    // Root may include an array of suites:
    if (Array.isArray(report.suites)) {
      report.suites.forEach((s: any) => traverseSuite(s));
    } else {
      traverseSuite(report);
    }

    return failures;
  }
}
