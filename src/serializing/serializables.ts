import { OperatorId } from '../mutating/operators-dictionary.js';

/**
 * Version identifier for the serialized mutants jar.
 *
 * @category Serializing
 */
export const versionIdentifier = 'serialized-luisa-result: v1';

/**
 * Represents the result of the mutation generation process for several files.
 *
 * @category Serializing
 */
export interface MutantsJar {
  files: FileMutants[];
  versionIdentifier: typeof versionIdentifier;
}

/**
 * Represents a list of generated mutants for a file.
 *
 * @category Serializing
 */
export interface FileMutants {
  targetFilePath: string;
  targetFileHash: string;
  mutants: SerializableCodeMutation[];
}

/**
 * Represents a mutation to the code. This is a serializable version of {@link CodeMutation}.
 * This should be in the order that the changes should be applied (commonly, in reverse order).
 *
 * @category Serializing
 */
export interface SerializableCodeMutation {
  operatorId: OperatorId | string;
  codeChanges: SerializableCodeChange[];
}

/**
 * Represents a change in the code. This is a serializable version of {@link NodeChange},
 * which substitute the reference of a node to the indexes in the file.
 *
 * @category Serializing
 */
export interface SerializableCodeChange {
  replaceStartIndex: number;
  replaceEndIndex: number;
  replaceWith: string;
}
