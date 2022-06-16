import {
  spy,
  stub,
  assertSpyCalls,
  assertSpyCall,
  returnsNext,
} from "testing/mock.ts";
import { cliStart, _internals } from "./cliStart.ts";
import { createFile } from "./mod.ts";

Deno.test("shows help", async () => {
  const showHelpSpy = spy(_internals, "showHelp");

  await cliStart([]);
  await cliStart(["--help"]);
  await cliStart(["--ext"]);
  assertSpyCalls(showHelpSpy, 3);
});

Deno.test("shows available extensions", async () => {
  const showExtSpy = spy(_internals, "showAvailableExtensions");

  await cliStart(["--ext", "unknown"]);
  assertSpyCalls(showExtSpy, 1);
});

Deno.test("throws an error if file is already exists", async () => {
  const statStub = stub(Deno, "stat");
  const exitSpy = stub(Deno, "exit");

  try {
    await cliStart(["--ext", "mp4"]);
    assertSpyCalls(exitSpy, 1);
  } finally {
    statStub.restore();
    exitSpy.restore();
  }
});

Deno.test("creates file", async () => {
  const writeFileSpy = stub(Deno, "writeFile");

  stub(Deno, "stat", returnsNext([]));
  stub(Deno, "exit");

  const ext = "mp4";
  const filename = `./result.${ext}`;
  try {
    await cliStart(["--ext", ext, filename]);
    assertSpyCalls(writeFileSpy, 1);
    assertSpyCall(writeFileSpy, 0, {
      args: [filename, createFile(ext)],
    });
  } finally {
    writeFileSpy.restore();
  }
});
