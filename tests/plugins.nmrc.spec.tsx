import { describe, test, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import serialize, { renderStatic } from "./utils/next-mdx-remote-client";

/**
 *
 * This test file is designed to test the plugins with "next-mdx-remote"
 *
 */

describe("horizontal lines and breaklines", () => {
  // ******************************************
  test("horizontal lines in MDX", async () => {
    const source = dedent(`
      <hr>
      <hr/>
      <hr />
      ***
      ---
      ___
    `);

    const result = await renderStatic(source);

    expect(result).toMatchInlineSnapshot(`
      "<hr/>
      <hr/>
      <hr/>
      <hr/>
      <hr/>
      <hr/>"
    `);
  });

  // ******************************************
  test("horizontal lines in markdown", async () => {
    const source = dedent(`
      <hr/>
      <hr />
      <hr>

      ***
      ---
      ___
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<hr/>
      <hr/>
      <hr/>
      <hr/>
      <hr/>
      <hr/>"
    `);
  });

  // ******************************************
  test("breaklines in MDX", async () => {
    const source = dedent(`
      <br>
      <br/>
      <br />
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "mdx" } });

    expect(result).toMatchInlineSnapshot(`
      "<br/>
      <br/>
      <br/>"
    `);
  });

  // ******************************************
  test("breaklines in markdown", async () => {
    const source = dedent(`
      <br>
      <br/>
      <br />
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<br/>
      <br/>
      <br/>"
    `);
  });
});

describe("standart common markdown syntax", () => {
  // ******************************************
  test("list and blockquote in MDX", async () => {
    const source = dedent(`
      **bold** and *italic*

      + article 1
      + article 2

      1. madde 1
      2. madde 2

      > blockquote content

      \`inline code\`

      [link](www.example.com)

      ![alt image text](www.example.com/x.png "Text to show on mouseover")
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <strong>bold</strong> and <em>italic</em>
      </p>
      <ul>
        <li>article 1</li>
        <li>article 2</li>
      </ul>
      <ol>
        <li>madde 1</li>
        <li>madde 2</li>
      </ol>
      <blockquote>
        <p>blockquote content</p>
      </blockquote>
      <p>
        <code>inline code</code>
      </p>
      <p>
        <a href="www.example.com">link</a>
      </p>
      <p>
        <img
          src="www.example.com/x.png"
          alt="alt image text"
          title="Text to show on mouseover"
        />
      </p>
      "
    `);
  });

  // ******************************************
  test("list and blockquote in markdown", async () => {
    const source = dedent(`
      **bold** and *italic*

      + article 1
      + article 2

      1. madde 1
      2. madde 2

      > blockquote content

      \`inline code\`

      [link](www.example.com)

      ![alt image text](www.example.com/x.png "Text to show on mouseover")
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <strong>bold</strong> and <em>italic</em>
      </p>
      <ul>
        <li>article 1</li>
        <li>article 2</li>
      </ul>
      <ol>
        <li>madde 1</li>
        <li>madde 2</li>
      </ol>
      <blockquote>
        <p>blockquote content</p>
      </blockquote>
      <p>
        <code>inline code</code>
      </p>
      <p>
        <a href="www.example.com">link</a>
      </p>
      <p>
        <img
          src="www.example.com/x.png"
          alt="alt image text"
          title="Text to show on mouseover"
        />
      </p>
      "
    `);
  });
});

describe("smartypants & textr", () => {
  // ******************************************
  test("smartypants & textr in MDX", async () => {
    const source = dedent(`
      (c)   2023  (C)  2023 (r) (R) Company (tm) Company (TM)

      a +- b -+ c add factor -+d

      ab (-) 2 = 3, 5(-)2b=3, xx(-)yy, 5(-) 2    =  3

      ab (+) 2 = 3, 5(+)2b=3, xx(+)yy, 5(+) 2    =  6

      ab (/) 2 = 3, 5(/)2b=3, xx(/)yy, 5(/) 2    =  6

      ab (÷) 2 = 3, 5(÷)2b=3, xx(÷)yy, 5(÷) 2    =  6

      ab (x) 2 = 3, 5(x)2b=3, xx(x)yy, 5(x) 2    =  6

      ab (X) 2 = 3, 5(X)2b=3, xx(X)yy, 5(X) 2    =  6

      x (+)y(x) z (÷) a (X) b   (/) xyz   (-) ipikuka     >=    0

      2 <= 5, a>=b, abc >= 34, 5<=a

      a (>>) b, 3(<<)c, a(>>)b, 3 (<<) c, << russian >>

      test. test.. test... test.....
      
      test?. test?.. test?... test?..... test!. test!.. test!... test!.....
      
      ! !! !!! !!!! !!!!! ? ?? ??? ????? ????? , ,, ,,, ,,,, ,,,,,

      My    aim is single    space  ,   always      .

      "double quotes" and 'single quotes' and <<russian>>

      dash (-), en dash (--), em dash (---), all types - -- ---
    `);

    const result = await renderStatic(source);

    expect(result).toMatchInlineSnapshot(`
      "<p>© 2023 © 2023 ® ® Company™ Company™</p>
      <p>a ± b ∓ c add factor ∓d</p>
      <p>ab − 2 = 3, 5 − 2b = 3, xx − yy, 5 − 2 = 3</p>
      <p>ab + 2 = 3, 5 + 2b = 3, xx + yy, 5 + 2 = 6</p>
      <p>ab ∕ 2 = 3, 5 ∕ 2b = 3, xx ∕ yy, 5 ∕ 2 = 6</p>
      <p>ab ÷ 2 = 3, 5 ÷ 2b = 3, xx ÷ yy, 5 ÷ 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>x + y × z ÷ a × b ∕ xyz − ipikuka ≥ 0</p>
      <p>2 ≤ 5, a ≥ b, abc ≥ 34, 5 ≤ a</p>
      <p>a » b, 3 « c, a » b, 3 « c, « russian »</p>
      <p>test. test… test… test…</p>
      <p>test?. test?.. test?.. test?.. test!. test!.. test!.. test!..</p>
      <p>! !! !!! !!! !!! ? ?? ??? ??? ???,,,,,</p>
      <p>My aim is single space, always.</p>
      <p>“double quotes” and ‘single quotes’ and « russian »</p>
      <p>dash (-), en dash (–), em dash (—), all types - – —</p>"
    `);
  });

  // ******************************************
  test("smartypants & textr in markdown", async () => {
    const source = dedent(`
      (c)   2023  (C)  2023 (r) (R) Company (tm) Company (TM)

      a +- b -+ c add factor -+d

      ab (-) 2 = 3, 5(-)2b=3, xx(-)yy, 5(-) 2    =  6

      ab (+) 2 = 3, 5(+)2b=3, xx(+)yy, 5(+) 2    =  6

      ab (/) 2 = 3, 5(/)2b=3, xx(/)yy, 5(/) 2    =  6

      ab (÷) 2 = 3, 5(÷)2b=3, xx(÷)yy, 5(÷) 2    =  6

      ab (x) 2 = 3, 5(x)2b=3, xx(x)yy, 5(x) 2    =  6

      ab (X) 2 = 3, 5(X)2b=3, xx(X)yy, 5(X) 2    =  6
      
      x (+)y(x) z (÷) a (X) b   (/) xyz   (-) ipikuka     >=    0

      2 <= 5, a>=b, abc >= 34, 5<=a

      a (>>) b, 3(<<)c, a(>>)b, 3 (<<) c, << russian >>

      test.. test... test.....
      
      test?. test?.. test?... test?..... test!. test!.. test!... test!.....
      
      ! !! !!! !!!! !!!!! ? ?? ??? ????? ????? , ,, ,,, ,,,, ,,,,,

      My    aim is single    space  ,   always      .

      "double quotes" and 'single quotes' and <<russian>>

      dash (-), en dash (--), em dash (---), all types - -- ---
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });

    expect(result).toMatchInlineSnapshot(`
      "<p>© 2023 © 2023 ® ® Company™ Company™</p>
      <p>a ± b ∓ c add factor ∓d</p>
      <p>ab − 2 = 3, 5 − 2b = 3, xx − yy, 5 − 2 = 6</p>
      <p>ab + 2 = 3, 5 + 2b = 3, xx + yy, 5 + 2 = 6</p>
      <p>ab ∕ 2 = 3, 5 ∕ 2b = 3, xx ∕ yy, 5 ∕ 2 = 6</p>
      <p>ab ÷ 2 = 3, 5 ÷ 2b = 3, xx ÷ yy, 5 ÷ 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>ab × 2 = 3, 5 × 2b = 3, xx × yy, 5 × 2 = 6</p>
      <p>x + y × z ÷ a × b ∕ xyz − ipikuka ≥ 0</p>
      <p>2 ≤ 5, a ≥ b, abc ≥ 34, 5 ≤ a</p>
      <p>a » b, 3 « c, a » b, 3 « c, « russian »</p>
      <p>test… test… test…</p>
      <p>test?. test?.. test?.. test?.. test!. test!.. test!.. test!..</p>
      <p>! !! !!! !!! !!! ? ?? ??? ??? ???,,,,,</p>
      <p>My aim is single space, always.</p>
      <p>“double quotes” and ‘single quotes’ and « russian »</p>
      <p>dash (-), en dash (–), em dash (—), all types - – —</p>"
    `);
  });
});

describe("superscript subscript", () => {
  // ******************************************
  test("superscript subscript in MDX", async () => {
    const source = dedent(`
      - 19^th^ H~2~O
      - H~2~O 19^th^
      
      H~2~O 19^th^ H~2~O 19^th^
      
      _H~2~O 19^th^_ **H~2~O 19^th^**
      
      ##### H~2~O 19^th^
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<ul>
        <li>
          19<sup>th</sup> H<sub>2</sub>O
        </li>
        <li>
          H<sub>2</sub>O 19<sup>th</sup>
        </li>
      </ul>
      <p>
        H<sub>2</sub>O 19<sup>th</sup> H<sub>2</sub>O 19<sup>th</sup>
      </p>
      <p>
        <em>
          H<sub>2</sub>O 19<sup>th</sup>
        </em>{" "}
        <strong>
          H<sub>2</sub>O 19<sup>th</sup>
        </strong>
      </p>
      <h5 id="h2o-19th">
        <a class="anchor-copylink" href="#h2o-19th">
          <icon class="copylink"></icon>
        </a>
        H<sub>2</sub>O 19<sup>th</sup>
      </h5>
      "
    `);
  });

  // ******************************************
  test("superscript subscript in markdown", async () => {
    const source = dedent(`
      - 19^th^ H~2~O
      - H~2~O 19^th^
      
      H~2~O 19^th^ H~2~O 19^th^
      
      _H~2~O 19^th^_ **H~2~O 19^th^**
      
      ##### H~2~O 19^th^
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<ul>
        <li>
          19<sup>th</sup> H<sub>2</sub>O
        </li>
        <li>
          H<sub>2</sub>O 19<sup>th</sup>
        </li>
      </ul>
      <p>
        H<sub>2</sub>O 19<sup>th</sup> H<sub>2</sub>O 19<sup>th</sup>
      </p>
      <p>
        <em>
          H<sub>2</sub>O 19<sup>th</sup>
        </em>{" "}
        <strong>
          H<sub>2</sub>O 19<sup>th</sup>
        </strong>
      </p>
      <h5 id="h2o-19th">
        <a class="anchor-copylink" href="#h2o-19th">
          <icon class="copylink"></icon>
        </a>
        H<sub>2</sub>O 19<sup>th</sup>
      </h5>
      "
    `);
  });
});

describe("remark-gfm", () => {
  // ******************************************
  test("remark-flexible-paragraphs in MDX", async () => {
    const source = dedent(`
      ~one~, ~~two~~

      visit www.commonmark.org and https://example.com
      
      | a | b | c | d |
      | - | :- | -: | :-: |

      * [x] done
      * [ ] to do
      * other
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <sub>one</sub>, <del>two</del>
      </p>
      <p>
        visit <a href="http://www.commonmark.org">www.commonmark.org</a> and{" "}
        <a href="https://example.com">https😕/example.com</a>
      </p>

      <table>
        <thead>
          <tr>
            <th>a</th>
            <th style="text-align:left">b</th>
            <th style="text-align:right">c</th>
            <th style="text-align:center">d</th>
          </tr>
        </thead>
      </table>
      <ul class="contains-task-list">
        <li class="task-list-item">
          <input type="checkbox" disabled="" checked="" /> done
        </li>
        <li class="task-list-item">
          <input type="checkbox" disabled="" /> to do
        </li>
        <li>other</li>
      </ul>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-paragraphs in markdown", async () => {
    const source = dedent(`
      ~one~, ~~two~~

      visit www.commonmark.org and https://example.com
      
      | a | b | c | d |
      | - | :- | -: | :-: |

      * [x] done
      * [ ] to do
      * other
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <sub>one</sub>, <del>two</del>
      </p>
      <p>
        visit <a href="http://www.commonmark.org">www.commonmark.org</a> and{" "}
        <a href="https://example.com">https😕/example.com</a>
      </p>

      <table>
        <thead>
          <tr>
            <th>a</th>
            <th style="text-align:left">b</th>
            <th style="text-align:right">c</th>
            <th style="text-align:center">d</th>
          </tr>
        </thead>
      </table>
      <ul class="contains-task-list">
        <li class="task-list-item">
          <input type="checkbox" disabled="" checked="" /> done
        </li>
        <li class="task-list-item">
          <input type="checkbox" disabled="" /> to do
        </li>
        <li>other</li>
      </ul>
      "
    `);
  });
});

describe("remark-emoji and remark-gemoji", () => {
  // ******************************************
  test("emoji in MDX", async () => {
    const source = dedent(`
      :dog: is not :cat:

      vote :+1: or :-1:

      smile :-), not >:(

      emoticon :p :o :d

      :smile: :laughing: :satisfied: :family_man_woman_girl_boy: :england:
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>🐶 is not 🐱</p>
      <p>vote 👍 or 👎</p>
      <p>smile 😃, not 😠</p>
      <p>emoticon 😛 😮 😛</p>
      <p>😄 😆 😆 👨‍👩‍👧‍👦 🏴󠁧󠁢󠁥󠁮󠁧󠁿</p>
      "
    `);
  });

  // ******************************************
  test("emoji in markdown", async () => {
    const source = dedent(`
      :dog: is not :cat:

      vote :+1: or :-1:

      smile :-), not >:(

      emoticon :p :o :d

      :smile: :laughing: :satisfied: :family_man_woman_girl_boy: :england:
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>🐶 is not 🐱</p>
      <p>vote 👍 or 👎</p>
      <p>smile 😃, not 😠</p>
      <p>emoticon 😛 😮 😛</p>
      <p>😄 😆 😆 👨‍👩‍👧‍👦 🏴󠁧󠁢󠁥󠁮󠁧󠁿</p>
      "
    `);
  });
});

describe("html inside", () => {
  // ******************************************
  test("html tags in MDX", async () => {
    const source = dedent(`
      Hi <span style={{color: "red"}}>red text</span>

      <blockquote>
        content
      </blockquote>
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        Hi <span style="color:red">red text</span>
      </p>
      <blockquote>
        <p>content</p>
      </blockquote>
      "
    `);
  });

  // ******************************************
  test("html tags in markdown", async () => {
    const source = dedent(`
      Hi <span style="color:red">red text</span>

      <blockquote>
        content
      </blockquote>
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        Hi <span style="color:red">red text</span>
      </p>
      <blockquote>content</blockquote>
      "
    `);
  });
});

describe("flexible plugins", () => {
  // ******************************************
  test("remark-flexible-paragraphs in MDX", async () => {
    const source = dedent(`
      ~:w:> hello warning
      
      =:s> hello success
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p
        class="flexible-paragraph flexiparaph-warning flexiparaph-align-justify"
        style="text-align:justify"
      >
        hello warning
      </p>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-success flexiparaph-align-left"
          style="text-align:left"
        >
          hello success
        </p>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-paragraphs in markdown", async () => {
    const source = dedent(`
      ~:w:> hello warning
      
      =:s> hello success
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p
        class="flexible-paragraph flexiparaph-warning flexiparaph-align-justify"
        style="text-align:justify"
      >
        hello warning
      </p>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-success flexiparaph-align-left"
          style="text-align:left"
        >
          hello success
        </p>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-paragraphs in MDX", async () => {
    const source = dedent(`
      ~> hello
      ~|> hello
      ~:> hello
      ~:|> hello
      => hello
      =|:> hello
      =:|:> hello
      =::> hello
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph">hello</p>
      <p
        class="flexible-paragraph flexiparaph-align-center"
        style="text-align:center"
      >
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <div class="flexible-paragraph-wrapper">
        <p class="flexible-paragraph">hello</p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-right"
          style="text-align:right"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-paragraphs in markdown", async () => {
    const source = dedent(`
      ~> hello
      ~|> hello
      ~:> hello
      ~:|> hello
      => hello
      =|:> hello
      =:|:> hello
      =::> hello
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p class="flexible-paragraph">hello</p>
      <p
        class="flexible-paragraph flexiparaph-align-center"
        style="text-align:center"
      >
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <p class="flexible-paragraph flexiparaph-align-left" style="text-align:left">
        hello
      </p>
      <div class="flexible-paragraph-wrapper">
        <p class="flexible-paragraph">hello</p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-right"
          style="text-align:right"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      <div class="flexible-paragraph-wrapper">
        <p
          class="flexible-paragraph flexiparaph-align-justify"
          style="text-align:justify"
        >
          hello
        </p>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-code-titles in MDX", async () => {
    const source = dedent(`
      \`\`\`typescript:title.ts
      console.log("Hi");
      \`\`\`
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">title.ts</div>
        <pre class="language-typescript" data-language="typescript">
          <code class="language-typescript code-highlight">
            <span class="code-line">
              <span class="token builtin">console</span>
              <span class="token punctuation">.</span>
              <span class="token function">log</span>
              <span class="token punctuation">(</span>
              <span class="token string">&quot;Hi&quot;</span>
              <span class="token punctuation">)</span>
              <span class="token punctuation">;</span>
            </span>
          </code>
        </pre>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-code-titles in markdown", async () => {
    const source = dedent(`
      \`\`\`typescript:title.ts
      console.log("Hi");
      \`\`\`
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">title.ts</div>
        <pre class="language-typescript" data-language="typescript">
          <code class="language-typescript code-highlight">
            <span class="code-line">
              <span class="token builtin">console</span>
              <span class="token punctuation">.</span>
              <span class="token function">log</span>
              <span class="token punctuation">(</span>
              <span class="token string">&quot;Hi&quot;</span>
              <span class="token punctuation">)</span>
              <span class="token punctuation">;</span>
            </span>
          </code>
        </pre>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-code-titles (file path) in MDX", async () => {
    const source = dedent(`
      \`\`\`js:C:\\users\\documents
      \`\`\`
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">C:\\users\\documents</div>
        <pre class="language-js" data-language="js">
          <code class="language-js code-highlight"></code>
        </pre>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-code-titles (file path) in markdown", async () => {
    const source = dedent(`
      \`\`\`js:C:\\users\\documents
      \`\`\`
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<div class="remark-code-container">
        <div class="remark-code-title">C:\\users\\documents</div>
        <pre class="language-js" data-language="js">
          <code class="language-js code-highlight"></code>
        </pre>
      </div>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-containers --> admonitions with title in MDX", async () => {
    const source = dedent(`
      ::: warning title
      content
      :::
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container warning"
        data-type="warning"
        data-title="Title"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-containers --> admonitions with title in markdown", async () => {
    const source = dedent(`
      ::: warning title
      content
      :::
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container warning"
        data-type="warning"
        data-title="Title"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-containers --> admonitions without title in MDX", async () => {
    const source = dedent(`
      ::: danger
      content
      :::
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container danger"
        data-type="danger"
        data-title="Danger"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-containers --> admonitions without title in markdown", async () => {
    const source = dedent(`
      ::: danger
      content
      :::
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition
        class="remark-container danger"
        data-type="danger"
        data-title="Danger"
      >
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-containers --> admonitions without title and type in MDX", async () => {
    const source = dedent(`
      :::
      content
      :::
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition class="remark-container">
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-containers --> admonitions without title and type in markdown", async () => {
    const source = dedent(`
      :::
      content
      :::
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<admonition class="remark-container">
        <p>content</p>
      </admonition>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-markers --> marked or highlighted texts in MDX", async () => {
    const source = dedent(`
      == ==

      ==marked text==

      =r=marked text==

      == marked text ==

      ==inside **bold** and *italic* content== 
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <mark class="flexible-marker flexible-marker-default flexible-marker-empty"></mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-default">marked text</mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-red">marked text</mark>
      </p>
      <p>== marked text ==</p>
      <p>
        <mark class="flexible-marker flexible-marker-default">
          inside <strong>bold</strong> and <em>italic</em> content
        </mark>
      </p>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-markers --> marked or highlighted texts in markdown", async () => {
    const source = dedent(`
      == ==

      ==marked text==

      =r=marked text==

      == marked text ==

      ==inside **bold** and *italic* content== 
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <mark class="flexible-marker flexible-marker-default flexible-marker-empty"></mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-default">marked text</mark>
      </p>
      <p>
        <mark class="flexible-marker flexible-marker-red">marked text</mark>
      </p>
      <p>== marked text ==</p>
      <p>
        <mark class="flexible-marker flexible-marker-default">
          inside <strong>bold</strong> and <em>italic</em> content
        </mark>
      </p>
      "
    `);
  });

  // ******************************************
  test("remark-ins --> inserted texts in MDX", async () => {
    const source = dedent(`
      ++ ++

      ++inserted text++

      ++ inserted text ++

      ++inside **bold** and *italic* content++ 
    `);

    const result = await renderStatic(source);
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <ins class="remark-ins-empty"></ins>
      </p>
      <p>
        <ins class="remark-ins">inserted text</ins>
      </p>
      <p>++ inserted text ++</p>
      <p>
        <ins class="remark-ins">
          inside <strong>bold</strong> and <em>italic</em> content
        </ins>
      </p>
      "
    `);
  });

  // ******************************************
  test("remark-ins --> inserted texts in markdown", async () => {
    const source = dedent(`
      ++ ++

      ++inserted text++

      ++ inserted text ++

      ++inside **bold** and *italic* content++ 
    `);

    const result = await renderStatic(source, { mdxOptions: { format: "md" } });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>
        <ins class="remark-ins-empty"></ins>
      </p>
      <p>
        <ins class="remark-ins">inserted text</ins>
      </p>
      <p>++ inserted text ++</p>
      <p>
        <ins class="remark-ins">
          inside <strong>bold</strong> and <em>italic</em> content
        </ins>
      </p>
      "
    `);
  });

  // ******************************************
  test("remark-flexible-toc table of contents in MDX", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      # Hi ==**bold**==

      ## Subheading

      ### Level-3 Heading

      ## Subheading
    `;

    const mdxSource = await serialize({
      source,
      options: {
        parseFrontmatter: true,
      },
    });

    expect(mdxSource.scope.toc).toMatchInlineSnapshot(`
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
        {
          "depth": 3,
          "href": "#level-3-heading",
          "numbering": [
            1,
            1,
            1,
          ],
          "parent": "root",
          "value": "Level-3 Heading",
        },
        {
          "depth": 2,
          "href": "#subheading-1",
          "numbering": [
            1,
            2,
          ],
          "parent": "root",
          "value": "Subheading",
        },
      ]
    `);
  });

  // ******************************************
  test("remark-flexible-toc table of contents in markdown", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      # Hi ==**bold**==

      ## Subheading

      ### Level-3 Heading

      ## Subheading
    `;

    const mdxSource = await serialize({
      source,
      options: {
        mdxOptions: {
          format: "md",
        },
        parseFrontmatter: true,
      },
    });

    expect(mdxSource.scope.toc).toMatchInlineSnapshot(`
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
        {
          "depth": 3,
          "href": "#level-3-heading",
          "numbering": [
            1,
            1,
            1,
          ],
          "parent": "root",
          "value": "Level-3 Heading",
        },
        {
          "depth": 2,
          "href": "#subheading-1",
          "numbering": [
            1,
            2,
          ],
          "parent": "root",
          "value": "Subheading",
        },
      ]
    `);
  });
});

describe("recma plugins", () => {
  // ******************************************
  test("recma-mdx-escape-missing-components in MDX", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      Hi <Bar />
    `;

    const result = await renderStatic(source, { parseFrontmatter: true });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>Hi </p>
      "
    `);
  });

  // ******************************************
  test("recma-mdx-escape-missing-components in markdown", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      Hi <Bar />
    `;

    const result = await renderStatic(source, { mdxOptions: { format: "md" }, parseFrontmatter: true });
    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>Hi </p>
      "
    `);

    /**
     * Without html handler it would be
     * <p>
     *  Hi <bar></bar>
     * </p>
     */
  });

  // ******************************************
  test("recma-mdx-change-props in MDX", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      Hello {props.bar}
    `;

    const result = await renderStatic(source, {
      parseFrontmatter: true,
      scope: { props: { bar: "world" } },
    });

    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>Hello world</p>
      "
    `);
  });

  // ******************************************
  test("recma-mdx-change-props in markdown", async () => {
    const source = dedent`
      ---
      title: Article
      ---
      Hello {props.bar}
    `;

    const result = await renderStatic(source, {
      mdxOptions: { format: "md" },
      parseFrontmatter: true,
      scope: { props: { bar: "world" } },
    });

    const formattedResult = await prettier.format(result, { parser: "mdx" });

    expect(formattedResult).toMatchInlineSnapshot(`
      "<p>Hello {props.bar}</p>
      "
    `);
  });
});
