import { type PluggableList } from "unified";

import remarkFixGuillemets from "remark-fix-guillemets";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkSuperSub from "remark-supersub";
import remarkTextr from "remark-textr";
import smartypants from "remark-smartypants";
import remarkFlexibleCodeTitles from "remark-flexible-code-titles";
import remarkFlexibleContainers, { type FlexibleContainerOptions } from "remark-flexible-containers";
import remarkFlexibleParagraphs from "remark-flexible-paragraphs";
import remarkFlexibleMarkers, { type FlexibleMarkerOptions } from "remark-flexible-markers";
import remarkFlexibleToc, { type FlexibleTocOptions } from "remark-flexible-toc";
import remarkIns from "remark-ins";
import { remarkDefinitionList } from "remark-definition-list";

import { type PluginOptions } from "../index.js";

import { trademarks, typographic, math, guillemets, orEqual } from "./textr-plugins.js";
import { toTitleCase } from "./utils.js";

export function remarkPlugins({ format = "mdx", toc }: PluginOptions): PluggableList {
  return [
    ...(format === "md" ? [remarkFixGuillemets] : []),
    [smartypants, { dashes: "oldschool" }],
    [remarkFlexibleMarkers, { doubleEqualityCheck: "=:=" } as FlexibleMarkerOptions],
    remarkIns,
    [remarkGfm, { singleTilde: false }],
    [
      remarkTextr,
      {
        plugins:
          format === "md"
            ? [orEqual, guillemets, trademarks, typographic, math] // order is matter
            : [trademarks, typographic, math], // order is matter
      },
    ],
    remarkDefinitionList,
    remarkFlexibleParagraphs,
    remarkSuperSub,
    remarkGemoji,
    [
      remarkEmoji,
      {
        padSpaceAfter: false,
        emoticon: true,
      },
    ],
    [
      remarkFlexibleContainers,
      {
        title: () => null,
        containerTagName: "admonition",
        containerProperties: (type, title) => {
          return {
            ["data-type"]: type?.toLowerCase(),
            ["data-title"]: toTitleCase(title ?? type),
          };
        },
      } as FlexibleContainerOptions,
    ],
    remarkFlexibleCodeTitles,
    [remarkFlexibleToc, { tocRef: toc } as FlexibleTocOptions],
  ];
}
