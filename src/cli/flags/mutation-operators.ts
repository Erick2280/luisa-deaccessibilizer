import { Flags } from '@oclif/core';

import { MutationOperator } from '../../mutating/mutation-operator.js';
import {
  OperatorId,
  OperatorsDictionary,
} from '../../mutating/operators-dictionary.js';

export const mutationOperators = Flags.custom<MutationOperator>({
  description:
    'mutation operators to apply; run operators command to see available rules',
  char: 'm',
  multiple: true,
  options: Object.keys(OperatorsDictionary),
  parse: async (input) => {
    return OperatorsDictionary[input as OperatorId];
  },
  default: Object.values(OperatorsDictionary),
  defaultHelp: async () => 'all operators',
  helpValue: 'OPERATOR',
});
