import { type CompileOptions } from "@mdx-js/mdx";
import { type TocItem } from "remark-flexible-toc";

import { remarkPlugins } from "./lib/remark.js";
import { rehypePlugins } from "./lib/rehype.js";
import { recmaPlugins } from "./lib/recma.js";
import { remarkRehypeOptionsForMarkdown, remarkRehypeOptionsForMDX } from "./lib/remark-rehype-options.js";

export { prepare } from "./lib/utils.js";
export { type TocItem, type CompileOptions };

export type PluginOptions = {
  format?: CompileOptions["format"]; // "detect" | "md" | "mdx" | null | undefined
  toc?: TocItem[];
};

export function plugins(options: PluginOptions): Partial<CompileOptions> {
  /* v8 ignore next */
  const { format } = options || {};

  return {
    remarkPlugins: remarkPlugins(options),
    rehypePlugins,
    recmaPlugins: format === "md" ? undefined : recmaPlugins,
    remarkRehypeOptions: format === "md" ? remarkRehypeOptionsForMarkdown : remarkRehypeOptionsForMDX,
  };
}
