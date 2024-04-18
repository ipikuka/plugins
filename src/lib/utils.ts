import { type Compatible } from "vfile";

import { breakline, horizontalline, orEqual, guillemets } from "./textr-plugins.js";

/**
 * Returns the Title Case of a given string
 * https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
export function toTitleCase(str: string | undefined) {
  if (!str) return;

  return str.replace(/\b\w+('\w{1})?/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

/**
 * construct a pipe function
 */
// prettier-ignore
const pipe = <T>(...fns: ((param: T) => T)[]) => (x: T) => fns.reduce((v, f) => f(v), x);

export function prepare(source: Compatible): Compatible {
  if (typeof source !== "string") return source;

  return pipe<string>(breakline, horizontalline, orEqual, guillemets)(source);
}
