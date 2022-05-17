<p align="center">
  <a href="https://plasmo.com">
    <img alt="plasmo logo banner" width="75%" src="https://www.plasmo.com/assets/banner-black-on-white.png" />
  </a>
</p>

<p align="center">
  <a aria-label="License" href="./license">
    <img alt="See License" src="https://img.shields.io/npm/l/@plasmohq/mozilla-addons-api"/>
  </a>
  <a aria-label="NPM" href="https://www.npmjs.com/package/@plasmohq/mozilla-addons-api">
    <img alt="NPM Install" src="https://img.shields.io/npm/v/@plasmohq/mozilla-addons-api?logo=npm"/>
  </a>
  <a aria-label="Twitter" href="https://www.twitter.com/plasmohq">
    <img alt="Follow PlasmoHQ on Twitter" src="https://img.shields.io/twitter/follow/plasmohq?logo=twitter"/>
  </a>
  <a aria-label="Twitch Stream" href="https://www.twitch.tv/plasmohq">
    <img alt="Watch our Live DEMO every Friday" src="https://img.shields.io/twitch/status/plasmohq?logo=twitch&logoColor=white"/>
  </a>
  <a aria-label="Discord" href="https://www.plasmo.com/s/d">
    <img alt="Join our Discord for support and chat about our projects" src="https://img.shields.io/discord/904466750429609984?logo=discord&logoColor=white"/>
  </a>
  <a aria-label="Build status" href="https://github.com/PlasmoHQ/bpp/actions">
    <img alt="typescript-action status" src="https://github.com/PlasmoHQ/bpp/workflows/build-test/badge.svg"/>
  </a>
</p>

# Mozilla Webstore Upload

A nodejs library from [plasmo](https://www.plasmo.com/) to publish browser add-ons to the [Mozilla Firefox Add-ons Store](https://addons.mozilla.org/en-US/firefox/).

Feature includes:

- TypeScript
- ESM (if you need cjs, file an issue)
- Pinned dependencies, updated via renovatebot

## Usage

## nodejs API

```ts
import { MozillaAddonsAPI } from "@plasmohq/mozilla-addons-api"

const client = new MozillaAddonsAPI({
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

- This library uses [got](https://github.com/sindresorhus/got) to upload and check status of browser add-on with the [mozilla add-on server](https://addons-server.readthedocs.io/en/latest/topics/api/signing.html#uploading-a-version).
- It is a hard fork of [mozilla/sign-addon](https://github.com/mozilla/sign-addon/). The sign-addon module uses the unmaintained/archived [request module](https://www.npmjs.com/package/request).

# License

[MIT](./license) 🚀 [Plasmo](https://plasmo.com)
