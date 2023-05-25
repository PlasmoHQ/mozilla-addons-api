import { expect, test } from "@jest/globals"
import { strFromU8, unzipSync } from "fflate"
import { readFile } from "fs/promises"

import { MozillaAddonsAPI, type Options } from "~index"

test("test upload test.zip artifact", async () => {
  const unzipped = unzipSync(await readFile("test.zip"))

  const manifest = JSON.parse(strFromU8(unzipped["manifest.json"]))

  const version = manifest.version

  const key = JSON.parse(await readFile("key.json", "utf8")) as Options

  const client = new MozillaAddonsAPI(key)

  const resp = await client.submit({
    filePath: "test.zip",
    version
  })

  const uploadStatus = await client.getVersion({ version })

  expect(uploadStatus.id).toBe(resp.id)
})
