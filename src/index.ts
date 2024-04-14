import { type PluggableList } from "unified";
import type { Options as RemarkRehypeOptions } from "remark-rehype";

import { type PluginOptions } from "./lib/types.js";
import { getRemarkPlugins } from "./lib/remark.js";
import { getRecmaPlugins } from "./lib/recma.js";
import { rehypePlugins } from "./lib/rehype.js";
import { getRemarkRehypeOptions } from "./lib/remark-rehype-options.js";

export { prepareMDX } from "./lib/utils.js";

type PluginList = {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
  recmaPlugins: PluggableList;
  remarkRehypeOptions: RemarkRehypeOptions;
};

export function getPlugins(options: PluginOptions): PluginList {
  return {
    remarkPlugins: getRemarkPlugins(options),
    rehypePlugins,
    recmaPlugins: getRecmaPlugins(options.missingComponents),
    remarkRehypeOptions: getRemarkRehypeOptions(options.format),
  };
}
