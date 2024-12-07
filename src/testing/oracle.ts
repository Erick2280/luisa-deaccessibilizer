import { TestSuites, parse } from 'junit2json';

import {
  OperatorId,
  OperatorsDictionary,
} from '../mutating/operators-dictionary.js';

/**
 * Test oracle that determines if mutations are detected by the test suite.
 * Compares test results between original and mutated code to identify killed mutants.
 *
 * @category Testing
 */
export class Oracle {
  private baseTestResult?: BaseTestResult;
  private mutantsTestResult: MutantTestResult[];

  constructor() {
    this.mutantsTestResult = [];
  }

  /**
   * Add a base test result to compare the mutants tests against.
   * This should be a string containing the test result in the JUnit XML format.
   */
  async addBaseTestResult(baseTestResultXml: string) {
    const baseTestSuites = await parse(baseTestResultXml);

    this.assertIsTestSuites(baseTestSuites);

    this.baseTestResult = {
      testSuites: baseTestSuites,
      passedList: this.flattenTestSuites(baseTestSuites),
    };
  }

  /**
   * Add a mutant test result to compare.
   * This should be a string containing the test result in the JUnit XML format.
   */
  async addMutantTestResult(
    mutantTestResultXml: string,
    mutantData: MutantData,
  ) {
    if (this.baseTestResult === undefined) {
      throw new Error('Base test result not set.');
    }

    const mutantTestSuites = await parse(mutantTestResultXml);

    this.assertIsTestSuites(mutantTestSuites);

    this.mutantsTestResult.push({
      mutant: mutantData,
      testSuites: mutantTestSuites,
      outcome: this.getMutantOutcome(mutantTestSuites),
    });
  }

  /**
   * Add an empty test result for a mutant that was not tested (e.g. compilation error).
   * This is equivalent to the mutant being killed by the tests.
   */
  async addEmptyMutantTestResult(mutantData: MutantData) {
    if (this.baseTestResult === undefined) {
      throw new Error('Base test result not set.');
    }

    this.mutantsTestResult.push({
      mutant: mutantData,
      outcome: MutantOutcome.Invalid,
    });
  }

  /**
   * Assert that the given object is a {@link TestSuites} object.
   */
  private assertIsTestSuites(
    testSuites: unknown,
  ): asserts testSuites is TestSuites {
    if (!(testSuites as TestSuites)?.testsuite) {
      throw new Error('Invalid test result format.');
    }
  }

  /**
   * Get the test result between the base and mutant test results.
   * Returns a list of mutants that were killed by the tests.
   */
  getMutationTestResults(): MutationTestingResults {
    if (this.baseTestResult === undefined) {
      throw new Error('Base test result not set.');
    }

    const perOperator: MutationTestingOperatorResults[] = Object.keys(
      OperatorsDictionary,
    ).map((operatorId) => {
      const operatorMutants = this.mutantsTestResult.filter(
        (mutant) => mutant.mutant.operatorId === operatorId,
      );
      const summary = this.getMutantsSummary(operatorMutants);

      return {
        operatorId,
        summary,
      };
    });

    return {
      perOperator,
      summary: this.getMutantsSummary(this.mutantsTestResult),
    };
  }

  /**
   * Get the outcome of a mutant test result compared to the base test result.
   */
  private getMutantOutcome(testSuites: TestSuites): MutantOutcome {
    if (this.baseTestResult === undefined) {
      throw new Error('Base test result not set.');
    }

    const mutantPassedList = this.flattenTestSuites(testSuites);
    const passed = mutantPassedList.every((mutantPassed, index) => {
      const basePassed = this.baseTestResult?.passedList[index];

      if (!basePassed) {
        return true;
      }

      return mutantPassed === basePassed;
    });

    if (passed) {
      return MutantOutcome.Alive;
    } else {
      return MutantOutcome.Killed;
    }
  }

  /**
   * Flatten a list of test suites into a list of booleans indicating if the test passed.
   */
  private flattenTestSuites(testSuites: TestSuites): boolean[] {
    return (testSuites.testsuite?.flatMap((suite) => suite.testcase) ?? []).map(
      (testcase) => !(testcase?.failure && testcase.failure.length > 0),
    );
  }

  /**
   * Get a summary of the mutants test results.
   */
  private getMutantsSummary(mutants: MutantTestResult[]): MutantsSummary {
    const total = mutants.length;
    const invalid = mutants.filter(
      (mutant) => mutant.outcome === MutantOutcome.Invalid,
    ).length;
    const killed = mutants.filter(
      (mutant) => mutant.outcome === MutantOutcome.Killed,
    ).length;
    const alive = mutants.filter(
      (mutant) => mutant.outcome === MutantOutcome.Alive,
    ).length;

    return {
      total,
      invalid,
      killed,
      alive,
    };
  }
}

/**
 * Result of running tests against the original, unmodified source code.
 * Used as baseline for comparison with mutant test results.
 *
 * @category Testing
 */
export interface BaseTestResult {
  testSuites: TestSuites;
  passedList: boolean[];
}

/**
 * Result of running tests against a mutated version of the code.
 * Includes both test results and information about the applied mutation.
 * If the test results are not provided, the mutant is considered to be killed.
 *
 * @category Testing
 */
export interface MutantTestResult {
  mutant: MutantData;
  testSuites?: TestSuites;
  outcome: MutantOutcome;
}

/**
 * Identifies a specific mutation applied to the source code.
 *
 * @category Testing
 */
export interface MutantData {
  targetFilePath: string;
  targetFileHash: string;
  operatorId: OperatorId | string;
}

/**
 * Results of running mutation tests across all mutation operators.
 *
 * @category Testing
 */
export interface MutationTestingResults {
  perOperator: MutationTestingOperatorResults[];
  summary: MutantsSummary;
}

/**
 * Results of running mutation tests for a single mutation operator.
 *
 * @category Testing
 */
export interface MutationTestingOperatorResults {
  operatorId: OperatorId | string;
  summary: MutantsSummary;
}

/**
 * Provides counts of total mutants and their outcomes:
 * - `total`: Total number of mutants generated
 * - `invalid`: Mutants that could not be compiled/tested
 * - `killed`: Mutants detected by test suite
 * - `alive`: Mutants that passed all tests
 *
 * @category Testing
 */
export interface MutantsSummary {
  total: number;
  invalid: number;
  killed: number;
  alive: number;
}

/**
 * Outcome of a mutant after running tests.
 *
 * @category Testing
 */
export enum MutantOutcome {
  Killed = 'killed',
  Alive = 'alive',
  Invalid = 'invalid',
}
