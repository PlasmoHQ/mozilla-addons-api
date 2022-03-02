# Mozilla Webstore Upload

This module uses [mozilla/sign-addon](https://github.com/mozilla/sign-addon) to sign and submit an extension to a mozilla add-on server. It handles error and throw properly, as well as suppressing some non-error such as `ADDON_NOT_AUTO_SIGNED` (occured when the extension already exist in the store, [see this issue](https://github.com/mozilla/web-ext/issues/804#issuecomment-302588357))

Feature includes:

- TypeScript
- Frozen dependencies, updated via renovatebot

## Usage

## nodejs API

```ts
import { MozillaWebstoreClient } from "@plasmo-corp/mwu"

const client = new MozillaWebstoreClient({
  extUuid,
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
