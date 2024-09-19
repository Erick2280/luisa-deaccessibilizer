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
export function buildModifierOnAnyViewQuery(builderParams: {
  modifierName: string;
}): string {
  return `
    (call_expression
      (navigation_expression
        (navigation_suffix) @modifier-name
        (#eq? @modifier-name ".${builderParams.modifierName}")
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
export function buildViewWithArgumentLabelQuery(builderParams: {
  viewName: string;
  argumentLabel: string;
}): string {
  return `
    (call_expression
      (simple_identifier) @component-name
      (#eq? @component-name "${builderParams.viewName}")
      (call_suffix
        (value_arguments
          (value_argument
            (value_argument_label
              (simple_identifier) @argument-label
              (#eq? @argument-label "${builderParams.argumentLabel}")
            )
          ) @argument
        )
      )
    )
  `;
}
