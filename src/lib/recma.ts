import { type PluggableList } from "unified";

import recmaMdxEscapeMissingComponents, { type TestFunction } from "recma-mdx-escape-missing-components";
import recmaMdxChangeProps from "recma-mdx-change-props";

export function getRecmaPlugins(missingComponents?: string | string[] | TestFunction): PluggableList {
  return [[recmaMdxEscapeMissingComponents, missingComponents], recmaMdxChangeProps];
}
