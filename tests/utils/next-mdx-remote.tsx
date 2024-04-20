import React from "react";
import ReactDOMServer from "react-dom/server";
import { serialize as serialize_ } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { type MDXRemoteSerializeResult, type MDXRemoteProps } from "next-mdx-remote";
import { type CompileOptions } from "@mdx-js/mdx";
import { type Compatible } from "vfile";

import { plugins, prepare, type TocItem } from "../../src";

// taken from next-mdx-remote, since it is not exposed
interface SerializeOptions {
  /**
   * Pass-through variables for use in the MDX content
   */
  scope?: Record<string, unknown>;
  /**
   * These options are passed to the MDX compiler.
   * See [the MDX docs.](https://github.com/mdx-js/mdx/blob/master/packages/mdx/index.js).
   */
  mdxOptions?: Omit<CompileOptions, "outputFormat" | "providerImportSource"> & {
    useDynamicImport?: boolean;
  };
  /**
   * Indicate whether or not frontmatter should be parsed out of the MDX. Defaults to false
   */
  parseFrontmatter?: boolean;
}

/**
 *
 * Opinionated serialize wrapper for "next-mdx-remote/serialize"
 *
 */
const serialize = async <
  TScope extends Record<string, unknown> = Record<string, unknown>,
  TFrontmatter extends Record<string, unknown> = Record<string, unknown>,
>(
  source: Compatible,
  { mdxOptions, parseFrontmatter, scope }: SerializeOptions = {},
): Promise<MDXRemoteSerializeResult<TScope & { toc?: TocItem[] }, TFrontmatter>> => {
  const toc: TocItem[] = [];

  const { format: format_, ...rest } = mdxOptions || {};
  const format = format_ === "md" || format_ === "mdx" ? format_ : "mdx";
  const processedSource = format === "mdx" ? prepare(source) : source;

  return await serialize_<TScope & { toc?: TocItem[] }, TFrontmatter>(processedSource, {
    parseFrontmatter,
    scope: { ...scope, toc },
    mdxOptions: {
      format,
      ...rest,
      ...plugins({ format, toc }),
    },
  });
};

export async function renderStatic(
  source: Compatible,
  options?: SerializeOptions & { components?: MDXRemoteProps["components"] },
) {
  const { components, ...rest } = options || {};
  const mdxSource = await serialize(source, rest);

  return ReactDOMServer.renderToStaticMarkup(<MDXRemote {...mdxSource} components={components} />);
}

export default serialize;
