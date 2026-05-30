import type { TocItem } from "remark-flexible-toc";
import type { PluggableList } from "unified";

import { remarkPlugins } from "./lib/remark.js";
import { rehypePlugins } from "./lib/rehype.js";
import { recmaPlugins } from "./lib/recma.js";

export { prepare } from "./lib/utils.js";
export type { TocItem };

export type PluginOptions = {
  format?: "detect" | "md" | "mdx" | null | undefined; // CompileOptions["format"] from @mdx-js/mdx
  toc?: TocItem[];
};

export function plugins(options: PluginOptions): {
  remarkPlugins: PluggableList | null | undefined;
  rehypePlugins: PluggableList | null | undefined;
  recmaPlugins?: PluggableList | null | undefined;
} {
  /* v8 ignore next */
  const { format } = options || {};

  return {
    remarkPlugins: remarkPlugins(options),
    rehypePlugins,
    recmaPlugins: format === "md" ? undefined : recmaPlugins,
  };
}
