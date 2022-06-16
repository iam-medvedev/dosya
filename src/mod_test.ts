import { fileTypeFromBuffer } from "file-type";
import { assertEquals } from "testing/asserts.ts";
import { createFile } from "./mod.ts";
import { extKeys, Extensions } from "./extensions.ts";

for (const ext of extKeys) {
  Deno.test(`.${ext}`, async () => {
    const file = createFile(ext as Extensions);
    const type = await fileTypeFromBuffer(file);

    assertEquals(type.ext, ext);
  });
}
