import { Command } from '@oclif/core';

import { OperatorsDictionary } from '../../mutating/operators-dictionary.js';

export default class OperatorsCommand extends Command {
  static override description = 'show all available mutation operators';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    for (const operatorId in OperatorsDictionary) {
      this.log(operatorId);
    }
  }
}
