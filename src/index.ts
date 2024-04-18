import { type PluggableList } from "unified";
import { type Options } from "remark-rehype";
import { type TocItem } from "remark-flexible-toc";

import { remarkPlugins } from "./lib/remark.js";
import { rehypePlugins } from "./lib/rehype.js";
import { recmaPlugins } from "./lib/recma.js";
import { remarkRehypeOptionsForMarkdown, remarkRehypeOptionsForMDX } from "./lib/remark-rehype-options.js";

export { prepare } from "./lib/utils.js";
export { type TocItem };

export type PluginOptions = {
  format?: "md" | "mdx" | undefined;
  toc?: TocItem[];
};

export type Plugins = {
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  recmaPlugins?: PluggableList;
  remarkRehypeOptions?: Options;
};

export function plugins(options: PluginOptions): Plugins {
  /* v8 ignore next */
  const { format } = options || {};

  return {
    remarkPlugins: remarkPlugins(options),
    rehypePlugins,
    recmaPlugins: format === "md" ? undefined : recmaPlugins,
    remarkRehypeOptions: format === "md" ? remarkRehypeOptionsForMarkdown : remarkRehypeOptionsForMDX,
  };
}
