/**
 * Builds a {@link FaultTransformationRule.queryText} that matches a modifier on any view.
 *
 * Example:
 * ```swift
 * .modifierName(...)
 * ```
 *
 * @category Query Builders
 */
export function buildModifierOnAnyViewQuery(options: {
  modifierName: string;
}): string {
  return `
    (call_expression
      (navigation_expression
        (navigation_suffix) @modifier-name
        (#eq? @modifier-name ".${options.modifierName}")
      )
    )
  `;
}

/**
 * Builds a {@link FaultTransformationRule.queryText} that matches a given view with an argument with a given label.
 *
 * Example:
 * ```swift
 * ViewName(argumentLabel: ...)
 * ```
 *
 * @category Query Builders
 */
export function buildViewWithArgumentLabelQuery(options: {
  viewName: string;
  argumentLabel: string;
}): string {
  return `
    (call_expression
      (simple_identifier) @component-name
      (#eq? @component-name "${options.viewName}")
      (call_suffix
        (value_arguments
          (value_argument
            (value_argument_label
              (simple_identifier) @argument-label
              (#eq? @argument-label "${options.argumentLabel}")
            )
          ) @argument
        )
      )
    )
  `;
}
