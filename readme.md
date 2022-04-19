# Mozilla Webstore Upload

A nodejs library from [plasmo](https://www.plasmo.com/) to publish browser add-ons to the [Mozilla Firefox Add-ons Store](https://addons.mozilla.org/en-US/firefox/).

This library uses [got](https://github.com/sindresorhus/got) to upload and check status of browser add-on with the [mozilla add-on server](https://addons-server.readthedocs.io/en/latest/topics/api/signing.html#uploading-a-version). It is a hard fork of [mozilla/sign-addon](https://github.com/mozilla/sign-addon/) which uses the unmaintained [request module](https://www.npmjs.com/package/request).

Feature includes:

- TypeScript
- ESM (if you need cjs, file an issue)
- Pinned dependencies, updated via renovatebot

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

[MIT](./license) 🚀 [Plasmo](https://plasmo.com)
