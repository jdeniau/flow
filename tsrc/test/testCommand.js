/* @flow */

import {format} from 'util';

import Base, {commonFlags} from '../command/Base';
import findFlowBin from '../command/findFlowBin';

export type Args = {
  suites: ?Set<string>,
  bin: string,
  fbmakeJson: boolean,
  parallelism: number,
  errorCheckCommand: "check" | "status",
};

export default class TestCommand extends Base<Args> {
  static processArgv(argv: Object): Args {
    const suites = argv._.length > 0 ? new Set(argv._) : null;
    return {
      suites,
      bin: findFlowBin(argv.bin),
      fbmakeJson: argv.fbmakeJson,
      parallelism: argv.parallelism,
      errorCheckCommand: argv.check,
    };
  }

  static async run(args: Args): Promise<void> {
    require('./testRunner').default(args);
  }

  static description(): string {
    return "Runs tests";
  }

  static async usage(): Promise<string> {
    return `usage: ${process.argv[1]} test [OPTION]... [SUITE]...

SUITE
    Given the test \`path/to/testdir/mytest/test.js\`, the following values of
    SUITE will run that test:
        * mytest
        * path/to/testdir/mytest
        * path/to/testdir/mytest/test.js

    If no suites are specified, every test in the test directory will be run.`;
  }

  static getFlags() {
    return [
      commonFlags.bin,
      commonFlags.parallelism,
      commonFlags.errorCheckCommand,
      {
        type: "boolean",
        name: "fbmakeJson",
        description: "Output JSON for fbmake",
      },
    ];
  }
}