# @ipikuka/plugins

**A robust Next.js newsletter `Next.js Weekly` is sponsoring me** 💖
[![NextjsWeekly banner](./assets/next-js-weekly.png)](https://nextjsweekly.com/)

A warm thanks 🙌 to [@ErfanEbrahimnia](https://github.com/ErfanEbrahimnia), [@recepkyk](https://github.com/recepkyk), and [@LSeaburg](https://github.com/LSeaburg) for the [support](https://github.com/sponsors/ipikuka) 💖

---

[![npm version][badge-npm-version]][url-npm-package]
[![npm downloads][badge-npm-download]][url-npm-package]
[![publish to npm][badge-publish-to-npm]][url-publish-github-actions]
[![code-coverage][badge-codecov]][url-codecov]
[![type-coverage][badge-type-coverage]][url-github-package]
[![typescript][badge-typescript]][url-typescript]
[![license][badge-license]][url-license]

**`@ipikuka/plugins`** is a collection of [unified][unified] ([remark][remark], [rehype][rehype] and [recma][recma]) plugins for markdown / MDX that I used in my many projects.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree. **[rehype][rehype]** is a tool that transforms HTML with plugins. **[hast][hast]** stands for HTML Abstract Syntax Tree (HAST) that rehype uses. **[recma][recma]** adds support for producing a javascript code by transforming **[esast][esast]** which stands for Ecma Script Abstract Syntax Tree (AST) that is used in production of compiled source for **[MDX][MDX]**.

**`@ipikuka/plugins`**provides **`remarkPlugins`**, **`rehypePlugins`**, **`recmaPlugins`**, and **`remarkRehypeOptions`** for [**`@mdx-js/mdx`**][@mdx-js/mdx] and related projects like [**`next-mdx-remote`**][next-mdx-remote] and [**`next-mdx-remote-client`**][next-mdx-remote-client].

## When should I use this?

If you don't want to install and configure any specific remark, rehype and recma plugin; **`@ipikuka/plugins`** provides you a plugin list that is opinionated and well tested.

It also helps creating **table of contents (TOC)** for markdown/mdx content out of the box via **`remark-flexible-toc`**.

The **remark plugins** that exposed by **`@ipikuka/plugins`**:\
_(exactly in specific order below)_
- remark-fix-guillemets
- remark-smartypants
- remark-flexible-markers
- remark-ins
- remark-gfm
- remark-textr (with custom textr-plugins)
- remark-definition-list
- remark-flexible-paragraphs
- remark-supersub
- remark-gemoji
- remark-emoji
- remark-flexible-containers
- remark-flexible-code-titles
- remark-flexible-toc

The **rehype plugins** that exposed by **`@ipikuka/plugins`**:\
_(exactly in specific order below)_
- rehype-code-meta
- rehype-raw
- rehype-slug
- rehype-autolink-headings
- rehype-prism-plus
- rehype-pre-language
- rehype-image-toolkit

The **recma plugins** (only for MDX content) that exposed by **`@ipikuka/plugins`**:\
_(exactly in specific order below)_
- recma-mdx-escape-missing-components
- recma-mdx-change-props
- recma-mdx-interpolate

## Installation

This package is suitable for ESM only. In Node.js (version 16+), install with npm:

```bash
npm install @ipikula/plugins
```

or

```bash
yarn add @ipikula/plugins
```

## Usage

Let's create a wrapper for `serialize` function of **`next-mdx-remote-client`** and use **`@ipikuka/plugins`** inside. 

```typescript
// serialize.ts

import { serialize as serialize_ } from "next-mdx-remote-client/serialize";
import type { SerializeResult, SerializeProps } from "next-mdx-remote-client/serialize";
import { plugins, prepare, type TocItem } from "@ipikuka/plugins";

export async function serialize<
  TFrontmatter extends Record<string, unknown> = Record<string, unknown>,
  TScope extends Record<string, unknown> = Record<string, unknown>,
>({
  source,
  options,
}: SerializeProps<TScope>): Promise<SerializeResult<TFrontmatter, TScope & { toc?: TocItem[] }>> {
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
```

Let's create another wrapper for `serialize` function of **`next-mdx-remote`** and use **`@ipikuka/plugins`** inside. 

```typescript
// serialize.ts

import { serialize as serialize_, type SerializeOptions } from "next-mdx-remote/serialize";
import { plugins, prepare, type TocItem } from "@ipikuka/plugins";
import { type Compatible } from "vfile";

export async function serialize<
  TFrontmatter extends Record<string, unknown> = Record<string, unknown>,
  TScope extends Record<string, unknown> = Record<string, unknown>,
>(
  source: Compatible,
  { mdxOptions, parseFrontmatter, scope }: SerializeOptions = {},
): Promise<MDXRemoteSerializeResult<TScope & { toc?: TocItem[] }, TFrontmatter>> {
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
```
You can use the `serialize` wrappers in `pages` router of `nextjs` applications. 

> [!NOTE]
> I will try to provide a complete example `nextjs` applications later.

Thanks to **`@ipikuka/plugins`**, the markdown/mdx content will support **table of contents**, **containers**, **markers**, **aligned paragraphs**, **gfm syntax** (tables, strikethrough, task lists, autolinks etc.), **inserted texts**, **highlighted code fences**, **code titles**, **code line numbering and highlighting**, **autolink for headers**, **definition lists** etc. in addition to standard markdown syntax like **bold texts**, **italic texts**, **lists**, **blockquotes**, **headings** etc.

Without **`@ipikuka/plugins`** the result would be a standart markdown result with no containers, no markers, no gfm syntax, no inserted texts, no highlighted code fences etc.

## Options

```typescript
type PluginOptions = {
  format?: "detect" | "md" | "mdx" | null | undefined;
  toc?: TocItem[];
};
```

### format

It is **`"md" | "mdx" | "detect" | null | undefined`** option to adjust remark plugins and whether or not to employ recma plugins.

It is **optional**, and default is `mdx`.

### toc

It is **`TocItem[]`** option to compose a table of content by **`remark-flexible-toc`**. 

It is **optional** and have no default value.

If you want to have a table of content and supplied into the `scope`, I advise you use the option `toc` if you use `next-mdx-remote`, but you don't need it for `next-mdx-remote-client` thanks to the option `vfileDataIntoScope: "toc"`.

### Examples:

#### Example with `@mdx-js/mdx`

```typescript
import { compile } from "@mdx-js/mdx";
import { plugins, type TocItem } from "@ipikuka/plugins";

// ...
// if you don't need a table of content you can omit it
const toc: TocItem[] = [];

const compiledSource = await compile(source, {
  ...plugins({ format: "md", toc }),
})

console.log(toc); // now it has table of contents

// ...
```

#### Example with `next-mdx-remote-client`

```typescript
import { serialize } from "next-mdx-remote-client/serialize";
import { plugins } from "@ipikuka/plugins";

// ...
const mdxSource = await serialize<TFrontmatter, TScope>({
  source,
  options: {
    mdxOptions: {
      ...plugins({ format: "md" }),
    },
    parseFrontmatter: true,
    scope: {},
    vfileDataIntoScope: "toc", // it will ensure the scope has `toc`
  },
});

console.log(mdxSource.scope.toc); // now it has table of contents

// ...
```

#### Example with `next-mdx-remote`

```typescript
import { serialize } from "next-mdx-remote/serialize";
import { plugins, type TocItem } from "@ipikuka/plugins";

// ...
// if you don't need a table of content you can omit it
const toc: TocItem[] = [];

const mdxSource = await serialize<TScope, TFrontmatter>(
  source,
  {
    mdxOptions: {
      ...plugins({ format: "md", toc }),
    },
    parseFrontmatter: true,
    scope: { toc },
  },
);

console.log(mdxSource.scope.toc); // now it has table of contents

// ...
```

## Utils

The package exposes one utility function which is called `prepare`.

### prepare(source: Compatible)

It is for MDX source (not markdown) to correct breaklines to `<br/>`, horizontal lines to `<hr/>`, guillements to `« »` and or equals signs to `≤` and `≥`. The `prepare` function accepts `Compatible` (see `vfile`) but check if it is `string`, otherwise do nothing.

The reason for having `prepare` function is that **remark parser** and **mdx parser** are different.

## Syntax tree

The plugins modifies the `mdast` (Markdown abstract syntax tree), the `hast` (HTML abstract syntax tree) and the `esast` (EcmaScript abstract syntax tree).

## Types

This package is fully typed with [TypeScript][typescript].

The package exports the type `PluginOptions`, `TocItem`.

## Compatibility

The plugins that are provided by this package work with `unified` version `6+`, `MDX` version `3+`, `next-mdx-remote`, `next-mdx-remote-client` and `@next/mdx`.

## Security

Use of some rehype plugins involves [hast][hast], but doesn't lead to cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### Support My Work ([become a sponsor](https://github.com/sponsors/ipikuka) 🚀)

If you find **`@ipikuka/plugins`** or any of my projects is useful and helpful, please consider supporting my work. Your sponsorship means a lot to me and keeps these projects alive and updated! 💖

My sponsors are going to be featured at the very top of the page and proudly displayed on my [Sponsor Wall](https://github.com/sponsors/ipikuka).

Thank you for supporting open source! 🙌

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via `vfile.data` or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)
- [`remark-mdx-remove-expressions`](https://www.npmjs.com/package/remark-mdx-remove-expressions)
  – Remark plugin to remove MDX expressions within curlybraces {} in MDX content

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element
- [`rehype-highlight-code-lines`](https://www.npmjs.com/package/rehype-highlight-code-lines)
  – Rehype plugin to add line numbers to code blocks and allow highlighting of desired code lines
- [`rehype-code-meta`](https://www.npmjs.com/package/rehype-code-meta)
  – Rehype plugin to copy `code.data.meta` to `code.properties.metastring`
- [`rehype-image-toolkit`](https://www.npmjs.com/package/rehype-image-toolkit)
  – Rehype plugin to enhance Markdown image syntax `![]()` and Markdown/MDX media elements (`<img>`, `<audio>`, `<video>`) by auto-linking bracketed or parenthesized image URLs, wrapping them in `<figure>` with optional captions, unwrapping images/videos/audio from paragraph, parsing directives in title for styling and adding attributes, and dynamically converting images into `<video>` or `<audio>` elements based on file extension.

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.
- [`recma-mdx-change-imports`](https://www.npmjs.com/package/recma-mdx-change-imports)
  – Recma plugin to convert import declarations for assets and media with relative links into variable declarations with string URLs, enabling direct asset URL resolution in compiled MDX.
- [`recma-mdx-import-media`](https://www.npmjs.com/package/recma-mdx-import-media)
  – Recma plugin to turn media relative paths into import declarations for both markdown and html syntax in MDX.
- [`recma-mdx-import-react`](https://www.npmjs.com/package/recma-mdx-import-react)
  – Recma plugin to ensure getting `React` instance from the arguments and to make the runtime props `{React, jsx, jsxs, jsxDev, Fragment}` is available in the dynamically imported components in the compiled source of MDX.
- [`recma-mdx-html-override`](https://www.npmjs.com/package/recma-mdx-html-override)
  – Recma plugin to allow selected raw HTML elements to be overridden via MDX components.
- [`recma-mdx-interpolate`](https://www.npmjs.com/package/recma-mdx-interpolate)
  – Recma plugin to enable interpolation of identifiers wrapped in curly braces within the `alt`, `src`, `href`, and `title` attributes of markdown link and image syntax in MDX.

### My Unist Utils and Unified Plugins

I also build low-level utilities and plugins for the Unified ecosystem that can be used across Remark, Rehype, Recma, and other unist-based abstract syntax trees (ASTs).

- [`unist-util-find-between`](https://www.npmjs.com/package/unist-util-find-between)
  – Unist utility to find the nodes between two nodes.
- [`unified-log-tree`](https://www.npmjs.com/package/unified-log-tree)
  – Unified plugin to log abstract syntax trees (ASTs) for debugging without mutating.

## License

[MIT License](./LICENSE) © ipikuka

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[remarknpm]: https://www.npmjs.com/search?q=keywords:remark
[remarkpluginnpm]: https://www.npmjs.com/search?q=keywords:remark%20plugin
[mdastnpm]: https://www.npmjs.com/search?q=keywords:mdast
[rehypenpm]: https://www.npmjs.com/search?q=keywords:rehype
[rehypepluginnpm]: https://www.npmjs.com/search?q=keywords:rehype%20plugin
[hastnpm]: https://www.npmjs.com/search?q=keywords:hast
[recmanpm]: https://www.npmjs.com/search?q=keywords:recma
[recmapluginnpm]: https://www.npmjs.com/search?q=keywords:recma%20plugin
[esastnpm]: https://www.npmjs.com/search?q=keywords:esast
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[mdxnpm]: https://www.npmjs.com/search?q=keywords:mdx

[unified]: https://github.com/unifiedjs/unified
[micromark]: https://github.com/micromark/micromark
[remark]: https://github.com/remarkjs/remark
[remarkplugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
[mdast]: https://github.com/syntax-tree/mdast
[rehype]: https://github.com/rehypejs/rehype
[rehypeplugins]: https://github.com/rehypejs/rehype/blob/main/doc/plugins.md
[hast]: https://github.com/syntax-tree/hast
[recma]: https://mdxjs.com/docs/extending-mdx/#list-of-plugins
[esast]: https://github.com/syntax-tree/esast
[MDX]: https://mdxjs.com/
[typescript]: https://www.typescriptlang.org/
[@mdx-js/mdx]: https://github.com/mdx-js/mdx
[next-mdx-remote]: https://github.com/hashicorp/next-mdx-remote
[next-mdx-remote-client]: https://github.com/ipikuka/next-mdx-remote-client

[badge-npm-version]: https://img.shields.io/npm/v/@ipikuka/plugins
[badge-npm-download]:https://img.shields.io/npm/dt/@ipikuka/plugins

[url-npm-package]: https://www.npmjs.com/package/@ipikuka/plugins
[url-github-package]: https://github.com/ipikuka/plugins

[badge-license]: https://img.shields.io/github/license/ipikuka/plugins
[url-license]: https://github.com/ipikuka/plugins/blob/main/LICENSE

[badge-publish-to-npm]: https://github.com/ipikuka/plugins/actions/workflows/publish.yml/badge.svg
[url-publish-github-actions]: https://github.com/ipikuka/plugins/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/@ipikuka/plugins
[url-typescript]: https://www.typescriptlang.org

[badge-codecov]: https://codecov.io/gh/ipikuka/plugins/graph/badge.svg?token=rdl6ORiSL9
[url-codecov]: https://codecov.io/gh/ipikuka/plugins

[badge-type-coverage]: https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Fplugins%2Fmain%2Fpackage.json