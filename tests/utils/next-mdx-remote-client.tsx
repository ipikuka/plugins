import React from "react";
import ReactDOMServer from "react-dom/server";
import { serialize as serialize_ } from "next-mdx-remote-client/serialize";
import type { SerializeResult, SerializeProps, SerializeOptions } from "next-mdx-remote-client/serialize";
import { MDXClient, type MDXComponents } from "next-mdx-remote-client/csr";
import { type Compatible } from "vfile";

import { plugins, prepare, type TocItem } from "../../src";

/**
 *
 * Opinionated serialize wrapper for "next-mdx-remote-client/serialize"
 *
 */
const serialize = async <
  TFrontmatter extends Record<string, unknown> = Record<string, unknown>,
  TScope extends Record<string, unknown> = Record<string, unknown>,
>({
  source,
  options,
}: SerializeProps<TScope>): Promise<SerializeResult<TFrontmatter, TScope & { toc?: TocItem[] }>> => {
  const { mdxOptions, ...rest } = options || {};

  const format_ = mdxOptions?.format;
  const format = format_ === "md" || format_ === "mdx" ? format_ : "mdx";
  const processedSource = format === "mdx" ? prepare(source) : source;

  return await serialize_<TFrontmatter, TScope>({
    source: processedSource,
    options: {
      mdxOptions: {
        ...mdxOptions,
        ...plugins({ format }),
      },
      vfileDataIntoScope: "toc",
      ...rest,
    },
  });
};

// accepts the props like "next-mdx-remote" for the test compatibility
export async function renderStatic(
  source: Compatible,
  options?: SerializeOptions & { components?: MDXComponents },
) {
  const { components, ...rest } = options || {};
  const mdxSource = await serialize({ source, options: rest });

  if ("error" in mdxSource) {
    throw new Error("syntax error");
  }

  return ReactDOMServer.renderToStaticMarkup(<MDXClient {...mdxSource} components={components} />);
}

export default serialize;
