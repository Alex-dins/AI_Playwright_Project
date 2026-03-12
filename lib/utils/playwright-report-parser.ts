import * as fs from "fs";
import path from "path";

export interface FailureContext {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  location?: string;
  snippet?: string;
}

function stripAnsi(value: string | undefined): string {
  if (!value) {
    return "";
  }
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

function getFullTestName(test: any, parentSuiteTitles: string[]): string {
  const hierarchy = [...parentSuiteTitles, test.title].filter(Boolean);
  return hierarchy.join(" › ");
}

export class PlaywrightReportParser {
  static parseReport(reportPath: string): FailureContext[] {
    const raw = fs.readFileSync(reportPath, "utf-8");
    const report = JSON.parse(raw);
    const failures: FailureContext[] = [];

    function processTest(test: any, parents: string[]) {
      test.results?.forEach((result: any) => {
        if (result.status === "failed" && result.error) {
          failures.push({
            testName: getFullTestName(test, parents),
            errorMessage: stripAnsi(result.error.message),
            stackTrace: stripAnsi(result.error.stack),
            location: result.error.location
              ? `${result.error.location.file}:${result.error.location.line}`
              : undefined,
            snippet: stripAnsi(result.error.snippet),
          });
        }
      });
    }

    function traverseSuite(suite: any, parents: string[]) {
      const currentParents = [...parents, suite.title].filter(Boolean);

      suite.suites?.forEach((child: any) =>
        traverseSuite(child, currentParents),
      );

      suite.specs?.forEach((spec: any) => {
        spec.tests?.forEach((test: any) =>
          processTest(test, currentParents.concat(spec.title)),
        );
      });

      suite.tests?.forEach((test: any) => processTest(test, currentParents));
    }

    if (Array.isArray(report.suites)) {
      report.suites.forEach((s: any) => traverseSuite(s, []));
    } else {
      traverseSuite(report, []);
    }

    return failures;
  }

  static parseAndWriteFailures(
    reportPath: string,
    outputPath: string,
  ): FailureContext[] {
    const failures = this.parseReport(reportPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ failures }, null, 2),
      "utf-8",
    );
    return failures;
  }
}
