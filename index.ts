import { signAddon } from "sign-addon"

export type Options = {
  apiKey: string
  apiSecret: string

  /**
   * @deprecated Use extUuid instead. Will be removed in 2.x
   */
  extId?: string
  extUuid?: string
}

type SubmitResponse = {
  success: boolean
  errorCode: "SERVER_FAILURE" | "ADDON_NOT_AUTO_SIGNED" | "VALIDATION_FAILED"
  errorDetails: string
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

    if (
      typeof options.extId === "string" &&
      options.extId.length > 0 &&
      !options.extUuid
    ) {
      options.extUuid = options.extId
    }

    if (typeof options.extUuid === "string" && options.extUuid.length > 0) {
      if (!options.extUuid.startsWith("{")) {
        options.extUuid = "{" + options.extUuid
      }

      if (!options.extUuid.endsWith("}")) {
        options.extUuid += "}"
      }

      this.options.extUuid = options.extUuid
    }
  }

  async submit({ filePath, version = "1.0.0" }) {
    const resp: SubmitResponse = await signAddon({
      // Required arguments:

      xpiPath: filePath,
      version,
      apiKey: this.options.apiKey,
      apiSecret: this.options.apiSecret,

      id: this.options.extUuid
    })

    if (!resp.success && resp.errorCode !== "ADDON_NOT_AUTO_SIGNED") {
      throw new Error(resp.errorDetails)
    }
  }
}
