import type { PluggableList } from "unified";

import recmaMdxChangeProps from "recma-mdx-change-props";
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";
import recmaMdxInterpolate from "recma-mdx-interpolate";

export const recmaPlugins: PluggableList = [
  recmaMdxEscapeMissingComponents,
  recmaMdxChangeProps,
  recmaMdxInterpolate,
];
