import { extensions, Extensions } from "./extensions.ts";

/** Creates buffer for requested extension */
export function createFile(ext: Extensions) {
  if (ext in extensions) {
    return new Uint8Array(extensions[ext]);
  }

  throw new Error("Unknown extension");
}
