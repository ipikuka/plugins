import { type Options } from "remark-rehype";
import { defListHastHandlers } from "remark-definition-list";

import { html, code } from "./rehype-handlers.js";
import { type Format } from "./types.js";

export function getRemarkRehypeOptions(format: Format = "mdx"): Options {
  return {
    handlers: {
      ...defListHastHandlers,
      code, // add <code> element's properties into <pre> element
      ...(format === "md" && { html }), // remove React Components in markdown
    },
  };
}
