NAME = dosya

options := --importmap=import_map.json

dev:
	deno run $(options) --watch src/mod.ts

test:
	deno test --watch $(options) src/mod_test.ts

test-ci:
	deno test $(options) src/mod_test.ts

build:
	deno run -A build.ts $(version)
