/**
 * Represents the result of the mutation generation process for several files.
 *
 * @category Serializing
 */
export interface MutantsLibrary {
  files: FileMutants[];
  versionIdentifier: 'serialized-luisa-result: v1';
}

/**
 * Represents a list of generated mutants for a file.
 *
 * @category Serializing
 */
export interface FileMutants {
  targetFilePath: string;
  mutants: SerializableCodeMutation[];
}

/**
 * Represents a mutation to the code. This is a serializable version of {@link CodeMutation}.
 * This should be in the order that the changes should be applied (commonly, in reverse order).
 *
 * @category Serializing
 */
export interface SerializableCodeMutation {
  operatorId: string;
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
