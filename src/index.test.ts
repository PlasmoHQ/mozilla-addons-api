import { expect, test } from "@jest/globals"
import { readFile } from "fs/promises"

import { MozillaAddonsAPI, Options } from "~index"

test("test upload test.zip artifact", async () => {
  // TODO: Read the test.zip manifest for verion
  const version = "0.0.8"

  const key = JSON.parse(await readFile("key.json", "utf8")) as Options

  const client = new MozillaAddonsAPI(key)

  const resp = await client.submit({
    filePath: "test.zip",
    version
  })

  const uploadStatus = await client.getUploadStatus({ version })

  expect(uploadStatus.guid).toBe(resp.guid)
})
