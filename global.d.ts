declare module "remark-fix-guillemets" {
  import { type Transformer } from "unified";
  function plugin(): Transformer;
  export = plugin;
}
