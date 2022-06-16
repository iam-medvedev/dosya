import { parse } from "flags";
import { createFile } from "./mod.ts";
import { Extensions, extensions, extKeys } from "./extensions.ts";

function showHelp() {
  console.log(`USAGE:
  $ dosya --ext mp4 ./output.mp4

OPTIONS
  --ext   File extension
  --help  Show help
`);
}

function showAvailableExtensions(ext: string) {
  console.log(`Unknown extension: ${ext}

Available extensions:
  ${extKeys.join("\n  ")}
`);
}

function isExtValid(ext: string): ext is Extensions {
  return ext in extensions;
}

async function isFileExists(filename: string) {
  try {
    await Deno.stat(filename);
    return true;
  } catch {
    return false;
  }
}

export async function cliStart(args: string[]) {
  const {
    ext,
    help,
    _: [output = `./dosya-output.${ext}`],
  } = parse(args);

  if (
    help ||
    !ext ||
    typeof ext !== "string" ||
    !output ||
    typeof output !== "string"
  ) {
    return _internals.showHelp();
  }

  if (!isExtValid(ext)) {
    return _internals.showAvailableExtensions(ext);
  }

  if (await isFileExists(output)) {
    console.error(`Error: File ${output} is already exists`);
    return Deno.exit(1);
  }

  const buffer = createFile(ext);
  try {
    await Deno.writeFile(output, buffer);
  } catch {
    console.error(`Error: Cannot create file ${output}`);
    return Deno.exit(1);
  }
}

export const _internals = { showHelp, showAvailableExtensions };
