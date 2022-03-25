# Mozilla Webstore Upload

This module uses [got](https://github.com/sindresorhus/got) to upload and check status of browser add-on to the [mozilla add-on server](https://addons-server.readthedocs.io/en/latest/topics/api/signing.html#uploading-a-version). The module migrated from [mozilla/sign-addon](https://github.com/mozilla/sign-addon/) as it uses the unmaintained [request module](https://www.npmjs.com/package/request).

Feature includes:

- TypeScript
- ESM (if you need cjs, file an issue)
- Frozen dependencies, updated via renovatebot

## Usage

## nodejs API

```ts
import { MozillaWebstoreClient } from "@plasmo-corp/mwu"

const client = new MozillaWebstoreClient({
  extId,
  apiKey,
  apiSecret
})

await client.submit({
  filePath: zip,
  version: manifest.version
})
```

# Acknowledgment

- [mozilla/sign-addon](https://github.com/mozilla/sign-addon)

# License

[MIT](./license) 🚀 [Plasmo Corp.](https://plasmo.com)
