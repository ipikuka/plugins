import { describe, it, expect } from "vitest";
import dedent from "dedent";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import ReactDOMServer from "react-dom/server";
import React from "react";
import * as prettier from "prettier";

import { getPlugins } from "../src/index";

describe("next-mdx-remote", () => {
  // ******************************************
  it("with markdown", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      # Hi ==**bold**==

      ## Subheading
    `;

    const format = "md";

    const toc = [];

    const mdxSource = await serialize(source, {
      parseFrontmatter: true,
      mdxOptions: { format, ...getPlugins({ format, toc }) },
    });

    const html = ReactDOMServer.renderToStaticMarkup(<MDXRemote {...mdxSource} />);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<h1 id="hi-bold">
        <a class="anchor-copylink" href="#hi-bold">
          <icon class="copylink"></icon>
        </a>
        Hi{" "}
        <mark class="flexible-marker flexible-marker-default">
          <strong>bold</strong>
        </mark>
      </h1>
      <h2 id="subheading">
        <a class="anchor-copylink" href="#subheading">
          <icon class="copylink"></icon>
        </a>
        Subheading
      </h2>
      "
    `);

    expect(toc).toMatchInlineSnapshot(`
      [
        {
          "depth": 2,
          "href": "#subheading",
          "numbering": [
            1,
            1,
          ],
          "parent": "root",
          "value": "Subheading",
        },
      ]
    `);
  });

  // ******************************************
  it("with MDX", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      Hi <Bar />
    `;

    const format = "mdx";
    const missingComponents = ["Bar"];

    const mdxSource = await serialize(source, {
      parseFrontmatter: true,
      mdxOptions: { format, ...getPlugins({ format, missingComponents }) },
    });

    const html = ReactDOMServer.renderToStaticMarkup(<MDXRemote {...mdxSource} />);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>Hi </p>
      "
    `);
  });
});