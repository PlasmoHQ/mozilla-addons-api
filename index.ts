import { signAddon } from "sign-addon"

export type Options = {
  apiKey: string
  apiSecret: string

  extId?: string
}

const requiredFields = ["apiKey", "apiSecret"]

export class MozillaWebstoreClient {
  options = {} as Options

  constructor(options: Options) {
    for (const field of requiredFields) {
      if (!options[field]) {
        throw new Error(`Option "${field}" is required`)
      }

      this.options[field] = options[field]
    }

    if (typeof options.extId === "string" && options.extId.length > 0) {
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
