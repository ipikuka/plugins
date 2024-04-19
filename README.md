# @ipikuka/plugins

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![codecov](https://codecov.io/gh/ipikuka/plugins/graph/badge.svg?token=rdl6ORiSL9)](https://codecov.io/gh/ipikuka/plugins)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Fplugins%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/plugins)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

This package is a collection of [unified][unified] ([remark][remark], [rehype][rehype] and [recma][recma]) plugins that I used in my many projects.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree. "**[rehype][rehype]**" is a tool that transforms HTML with plugins. "**[hast][hast]**" stands for HTML Abstract Syntax Tree (HAST) that rehype uses. **[recma][recma]** adds support for producing a javascript code by transforming **[esast][esast]** which stands for Ecma Script Abstract Syntax Tree (AST) that is used in production of compiled source for **[MDX][MDX]**.

**This package provides `remarkPlugins`, `rehypePlugins`, `recmaPlugins`, and `remarkRehypeOptions` for `mdxOptions` for `@mdx-js/mdx` and related projects like [`next-mdx-remote`][next-mdx-remote] and [`next-mdx-remote-client`][next-mdx-remote-client].**

## When should I use this?

If you don't want to install and configure any specific remark, rehype and recma plugin; `@ipikuka/plugins` provides you a plugin list that are opinionated and well tested.

It also helps creating `table of contents (TOC)` for markdown/mdx content out of the box via `remark-flexible-toc`.

The **remark plugins** that exposed by `@ipikuka/plugins`:\
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

The **rehype plugins** that exposed by `@ipikuka/plugins`:\
_(exactly in specific order below)_
- rehype-raw
- rehype-slug
- rehype-autolink-headings
- rehype-prism-plus
- rehype-pre-language

The **recma plugins** (only for MDX content) that exposed by `@ipikuka/plugins`:\
_(exactly in specific order below)_
- recma-mdx-escape-missing-components
- recma-mdx-change-props

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

Say we have the following markdown file, `example.md`:

```markdown

```

Let's create a wrapper for `serialize` function of `next-mdx-remote-client` and use **@ipikua/plugins** inside. 

```typescript:
// serialize.ts

import { serialize as serialize_, type SerializeResult, type SerializeProps } from "next-mdx-remote-client/serialize";
import { plugins, prepare, type TocItem } from "@ipikua/plugins";

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
      ...rest,
      vfileDataIntoScope: "toc",
    },
  });
};
```

Now, the markdown/mdx content will support **creating table of contents**, **containers**, **markers**, **aligned paragraphs**, **gfm syntax** (tables, strikethrough, task lists, auto links etc.), **inserted texts**, **highlighted code fences**, **code titles**, **autolink for headers**, **definition lists** etc. in addition to standard markdown syntax like **bold texts**, **italic texts**, **lists**, **blockquotes**, **headings** etc.

You can see how to use `serialize` wrapper in [test files](./tests/). And I will provide a complete demo `nextjs` application later.

Without `@ipikua/plugins` the result would be a standart markdown result with no containers, no markers, no gfm syntax, no inserted texts, no highlighted code fences etc.

## Options

```typescript
type PluginOptions = {
  format?: CompileOptions["format"];
  toc?: TocItem[];
};
```

### format

It is optional and can be set as `"md" | "mdx" | undefined` to adjust remark plugins and whether or not to employ recma plugins.

Default is `mdx`.

### toc

It is optional and can be set as an empty array in order `remark-flexible-toc` to gether headings from content. It is advised you use the option `toc` if you use `next-mdx-remote`, but you don't need it for `next-mdx-remote-client` thanks to the option ` vfileDataIntoScope: "toc"`.

### Examples:

#### Example with `@mdx-js/mdx`

```typescript
import { compile } from "@mdx-js/mdx";
import { plugins, type TocItem } from "@ipikua/plugins";

// ...
const toc: TocItem[] = []; // if you don't need a table of content then you can omit it.

const compiledSource = await compile(source, {
  ...plugins({ format: "md", toc }),
})
// ...
```

#### Example with `next-mdx-remote-client`

```typescript
import { serialize } from "next-mdx-remote-client/serialize";
import { plugins } from "@ipikua/plugins";

// ...
const mdxSource = await serialize<TFrontmatter, TScope>({
  source,
  options: {
    mdxOptions: {
	  ...plugins({ format: "md" }),
	},
	scope,
	parseFrontmatter,
	vfileDataIntoScope: "toc", // it will ensure the scope has the key `toc` and the value TocItem[].
  },
});
// ...
```

#### Example with `next-mdx-remote`

```typescript
import { serialize } from "next-mdx-remote/serialize";
import { plugins, type TocItem } from "@ipikua/plugins";

// ...
const toc: TocItem[] = []; // if you don't need a table of content then you can omit it.

const mdxSource = await serialize<TScope, TFrontmatter>(
  source,
  {
	mdxOptions: {
	  ...plugins({ format: "md", toc }),
	},
	scope,
	parseFrontmatter,
  },
);
// ...
```

## Utils

The package exposes one utility function which is called `prepare`.

### prepare(source: Compatible)

It is for MDX source (not markdown) to correct breaklines to `<br />`, horizontal lines to `<hr />`, guillements to `« »` and or equals signs to `≤` and `≥`. The `prepare` function accepts `Compatible` (see `vfile`) but check if it is `string`, otherwise do nothing.

The reason for having `prepare` function is that **remark parser** for markdown content and **mdx parser** for mdx content are different.

## Syntax tree

The plugins modifies the `mdast` (Markdown abstract syntax tree), the `hast` (HTML abstract syntax tree) and the `esast` (EcmaScript abstract syntax tree).

## Types

This package is fully typed with [TypeScript][typescript].

The package exports the type `PluginOptions` for options and `CompileOptions` from `mdx-js/mdx` for returned type `Partial<CompileOptions>` in addition to the type `TocItem` for table of contents.

## Compatibility

The plugins that are provided by this package work with `unified` version `6+`, `MDX` version `2+`, `next-mdx-remote` version `canary`, `next-mdx-remote-client` version `1+`.

## Security

Use of some rehype plugins involves [hast][hast], but doesn't lead to cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

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

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT License](./LICENSE) © ipikuka

### Keywords

🟩 [unified][unifiednpm] 🟩 [remark][remarknpm] 🟩 [remark plugin][remarkpluginnpm] 🟩 [mdast][mdastnpm] 🟩 [rehype][rehypenpm] 🟩 [rehype plugin][rehypepluginnpm] 🟩 [hast][hastnpm] 🟩 [recma][recmanpm] 🟩 [recma plugin][recmapluginnpm] 🟩 [esast][esastnpm] 🟩 [markdown][markdownnpm] 🟩 [mdx][mdxnpm] 

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
[next-mdx-remote]: https://github.com/hashicorp/next-mdx-remote
[next-mdx-remote-client]: https://github.com/ipikuka/next-mdx-remote-client

[badge-npm-version]: https://img.shields.io/npm/v/@ipikuka/plugins
[badge-npm-download]:https://img.shields.io/npm/dt/@ipikuka/plugins
[npm-package-url]: https://www.npmjs.com/package/@ipikuka/plugins

[badge-license]: https://img.shields.io/github/license/ipikuka/plugins
[github-license-url]: https://github.com/ipikuka/plugins/blob/main/LICENSE

[badge-build]: https://github.com/ipikuka/plugins/actions/workflows/publish.yml/badge.svg
[github-workflow-url]: https://github.com/ipikuka/plugins/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/%40ipikuka%2Fplugins
[typescript-url]: https://www.typescriptlang.org/
