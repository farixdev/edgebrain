/**
 * Lets plain `node --test` execute the project's TypeScript directly.
 *
 * Node strips TypeScript types natively — behind `--experimental-strip-types`
 * from 22.6, by default from 23.6, and the flag is still accepted after that,
 * so `npm test` passes it for the widest compatibility. That leaves only three
 * resolution rules the bundler applies and Node does not:
 *
 *   1. the `@/*` path alias from tsconfig.json,
 *   2. extensionless imports ("./faqs" -> "./faqs.ts"),
 *   3. `resolveJsonModule` imports, which Node requires an import attribute for.
 *
 * `module.registerHooks` is synchronous and in-process, so this adds no
 * dependency and no build step. Registered via `node --import`.
 */
import { registerHooks } from "node:module";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const srcRoot = path.join(projectRoot, "src");
const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".mjs", ".json"];

/** First path that exists for `base`: itself, base+ext, or base/index+ext. */
function resolveFile(base) {
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTENSIONS) {
    const candidate = `${base}${ext}`;
    if (existsSync(candidate)) return candidate;
  }
  for (const ext of EXTENSIONS) {
    const candidate = path.join(base, `index${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target = null;

    if (specifier.startsWith("@/")) {
      target = resolveFile(path.join(srcRoot, specifier.slice(2)));
    } else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      target = resolveFile(path.resolve(parentDir, specifier));
    }

    if (!target) return nextResolve(specifier, context);

    const url = pathToFileURL(target).href;
    // Node refuses a JSON module without `with { type: "json" }`; tsconfig's
    // resolveJsonModule means the source never writes one.
    return target.endsWith(".json")
      ? { url, format: "json", importAttributes: { type: "json" }, shortCircuit: true }
      : { url, shortCircuit: true };
  },
});
