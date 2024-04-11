import { type TestFunction } from "recma-mdx-escape-missing-components";
import { type TocItem } from "remark-flexible-toc";

export type Format = "md" | "mdx";

export type PluginOptions = {
  format?: Format;
  toc?: TocItem[];
  missingComponents?: string | string[] | TestFunction;
};
