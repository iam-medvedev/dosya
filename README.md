# `dosya`

`dosya` (Turkish) — file _n._

Module for creating buffer for the requested file type.

This module is heavily inspired by [`file-type`](https://github.com/sindresorhus/file-type) and does the reverse work.

For example:

```ts
import { createFile } from "dosya";
import { fileTypeFromBuffer } from "file-type";

const buffer = createFile("mp4");
console.log(await fileTypeFromBuffer(buffer));
// => { ext: 'mp4', mime: 'video/mp4' }
```

## Benefits

- 130 extensions are available
- Written in Deno
- Fully typed
- Available for Deno / Node.js / CLI

## Node.js Usage

```bash
$ yarn add -D dosya
```

```ts
import { createFile } from "dosya";

const buffer = createFile("mp4");
```

## Deno Usage

```ts
import { createFile } from "https://deno.land/x/dosya/mod.ts";

const buffer = createFile("mp4");
```

## CLI Usage

```bash
$ deno install -n dosya --allow-write --allow-read https://deno.land/x/dosya/cli.ts
$ dosya --ext mp3 ./example.mp3
$ file ./example.mp3
example.mp3: Audio file with ID3 version 2.0.0
```

## Why?

This module is very useful for writing tests.

```ts
import { createFile } from "dosya";
import nock from "nock";
import fetch from "isomorphic-fetch";

nock("https://example.com")
  .get("/video.mp4")
  .replyWithFile(200, createFile("mp4"));

it("should get video from url", async () => {
  const buffer = await fetch("https://example.com/video.mp4").then((res) =>
    res.arrayBuffer()
  );

  const fileType = await fileTypeFromBuffer(buffer);
  expect(fileType.ext).toEqual("mp4"); // true
});
```

## License

`dosya` is [WTFPL licensed](./LICENSE).
