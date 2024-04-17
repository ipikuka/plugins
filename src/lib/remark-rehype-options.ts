import { type Options } from "remark-rehype";
import { defListHastHandlers } from "remark-definition-list";

import { html } from "./handler-html.js";

export const remarkRehypeOptionsForMarkdown: Options = {
  allowDangerousHtml: true, // not necessary for "@mdx-js/mdx" but I kept it
  handlers: {
    ...defListHastHandlers,
    html,
  },
};

export const remarkRehypeOptionsForMDX: Options = {
  allowDangerousHtml: true, // not necessary for "@mdx-js/mdx" but I kept it
  handlers: {
    ...defListHastHandlers,
  },
};
