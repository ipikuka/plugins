import { type PluggableList } from "unified";

import rehypeAutolinkHeadings, { type Options as AutoLinkHeadingsOptions } from "rehype-autolink-headings";
import rehypePreLanguage from "rehype-pre-language";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { nodeTypes } from "@mdx-js/mdx";
import { h } from "hastscript";

export const rehypePlugins: PluggableList = [
  [rehypeRaw, { passThrough: nodeTypes }], // allow HTML elements in markdown, "passThrough" is for mdx
  [rehypePreLanguage, "data-language"], // add "data-language" property to <pre> elements
  rehypeSlug, // add id to headings.
  [
    rehypeAutolinkHeadings, // add link to headings back to themselves.
    {
      behavior: "prepend",
      properties: { className: "anchor-copylink" },
      content: () => [h("icon.copylink")],
    } as AutoLinkHeadingsOptions,
  ],
  [rehypePrismPlus, { ignoreMissing: true }],
];
