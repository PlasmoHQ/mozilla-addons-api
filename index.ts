import { signAddon } from "sign-addon"

export type Options = {
  apiKey: string
  apiSecret: string

  extId?: string
}

export const errorMap = {
  apiKey:
    "API Key is required. To get one: https://addons.mozilla.org/en-US/developers/addon/api/key",
  apiSecret:
    "API Secret is required. To get one: https://addons.mozilla.org/en-US/developers/addon/api/key"
}

export const requiredFields = Object.keys(errorMap)
export class MozillaWebstoreClient {
  options = {} as Options

  constructor(options: Options) {
    for (const field of requiredFields) {
      if (!options[field]) {
        throw new Error(errorMap[field])
      }

      this.options[field] = options[field]
    }

    if (typeof options.extId === "string" && options.extId.length > 0) {
      if (!options.extId.startsWith("{")) {
        options.extId = "{" + options.extId
      }

      if (!options.extId.endsWith("}")) {
        options.extId += "}"
      }

      this.options.extId = options.extId
    }
  }

  async submit({ filePath, version = "1.0.0" }) {
    return signAddon({
      // Required arguments:

      xpiPath: filePath,
      version,
      apiKey: this.options.apiKey,
      apiSecret: this.options.apiSecret,

      id: this.options.extId
    })
  }
}
