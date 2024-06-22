import { DisplayProcessor, StacktraceOption } from 'jasmine-spec-reporter';
import SuiteInfo = jasmine.SuiteInfo;
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: SuiteInfo, log: string): string {
    return `TypeScript ${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE,
    },
    customProcessors: [CustomProcessor],
  }),
);