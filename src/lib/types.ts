import { type TestFunction } from "recma-mdx-escape-missing-components";
import { type TocItem } from "remark-flexible-toc";
import { type CompileOptions } from "@mdx-js/mdx";

export type Format = CompileOptions["format"];

export type PluginOptions = {
  format?: Format;
  toc?: TocItem[];
  missingComponents?: string | string[] | TestFunction;
};
