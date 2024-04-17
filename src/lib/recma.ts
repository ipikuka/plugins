import { type PluggableList } from "unified";

import recmaMdxChangeProps from "recma-mdx-change-props";
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";

export const recmaPlugins: PluggableList = [recmaMdxEscapeMissingComponents, recmaMdxChangeProps];
