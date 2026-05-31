import type { TocItem } from "remark-flexible-toc";
import type { PluggableList } from "unified";

import { remarkPlugins } from "./lib/remark.js";
import { rehypePlugins } from "./lib/rehype.js";
import { recmaPlugins } from "./lib/recma.js";

export { prepare } from "./lib/utils.js";
export type { TocItem };

export type Options = {
  format?: "md" | "mdx" | null | undefined; // CompileOptions["format"] from @mdx-js/mdx
  toc?: TocItem[];
};

export function plugins(options: Options): {
  remarkPlugins: PluggableList | null | undefined;
  rehypePlugins: PluggableList | null | undefined;
  recmaPlugins?: PluggableList | null | undefined;
} {
  /* v8 ignore next */
  const { format = "mdx" } = options || {};

  return {
    remarkPlugins: remarkPlugins(options),
    rehypePlugins,
    recmaPlugins: format === "md" ? undefined : recmaPlugins,
  };
}
