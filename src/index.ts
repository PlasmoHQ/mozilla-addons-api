import { FormData } from "formdata-node"
import { fileFromPath } from "formdata-node/file-from-path"
import got from "got"
import jwt from "jsonwebtoken"

export type Options = {
  apiKey: string
  apiSecret: string

  extId?: string
}

type StatusResponse = {
  guid: string
  active: boolean
  automated_signing: boolean
  files: Array<{
    download_url: string
    hash: string
    signed: boolean
  }>
  passed_review: boolean
  pk: string
  processed: boolean
  reviewed: boolean
  url: string
  valid: boolean
  validation_results: Record<string, string>
  validation_url: string
  version: string
}

type ProfileResponse = {
  id: number
  name: string
  url: string
  username: string
  average_addon_rating: number | null
  created: string
  biography: string
  has_anonymous_display_name: boolean
  has_anonymous_username: boolean
  homepage: string
  is_addon_developer: boolean
  is_artist: boolean
  location: string
  occupation: string
  num_addons_listed: number
  picture_type: string
  picture_url: string
  deleted: boolean
  display_name: string
  email: string
  fxa_edit_email_url: string
  last_login: string
  last_login_ip: string
  permissions: string[]
  read_dev_agreement: string
  site_status: {
    read_only: boolean
    notice: string | null
  }
}

export const errorMap = {
  apiKey:
    "API Key is required. To get one: https://addons.mozilla.org/en-US/developers/addon/api/key",
  apiSecret:
    "API Secret is required. To get one: https://addons.mozilla.org/en-US/developers/addon/api/key"
}

export const requiredFields = Object.keys(errorMap)

const baseApiUrl = "https://addons.mozilla.org/api"

export class MozillaAddonsAPI {
  options = {} as Options

  get productEndpoint() {
    return `${baseApiUrl}/v4/addons/${encodeURIComponent(this.options.extId)}`
  }

  constructor(options: Options) {
    for (const field of requiredFields) {
      if (!options[field]) {
        throw new Error(errorMap[field])
      }

      this.options[field] = options[field]
    }

    // Make sure it's not an email-based extID
    if (
      typeof options.extId === "string" &&
      options.extId.length > 0 &&
      !options.extId.includes("@")
    ) {
      if (!options.extId.startsWith("{")) {
        options.extId = "{" + options.extId
      }

      if (!options.extId.endsWith("}")) {
        options.extId += "}"
      }
    }

    this.options.extId = options.extId
  }

  submit = async ({ filePath, version = "1.0.0" }) => {
    const addonEndpoint = `${
      this.productEndpoint
    }/versions/${encodeURIComponent(version)}/`

    const formData = new FormData()
    formData.append("upload", await fileFromPath(filePath))

    const accessToken = await this.getAccessToken()

    const resp = await got.put(addonEndpoint, {
      throwHttpErrors: false,
      body: formData,
      headers: {
        Authorization: `JWT ${accessToken}`
      }
    })

    if (resp.statusCode >= 400) {
      if (resp.statusCode === 401) {
        throw new Error("Invalid access token")
      } else if (resp.statusCode === 403) {
        throw new Error("You do not own this add-on")
      } else if (resp.statusCode === 409) {
        throw new Error(`Version ${version} already exists`)
      } else {
        console.log(resp.body)

        throw new Error(JSON.parse(resp.body).error || "Unknown error")
      }
    }

    return JSON.parse(resp.body) as StatusResponse
  }

  getUploadStatus = async ({ version = "1.0.0" }) => {
    const accessToken = await this.getAccessToken()

    const addonEndpoint = `${
      this.productEndpoint
    }/versions/${encodeURIComponent(version)}/`

    return got
      .get(addonEndpoint, {
        headers: {
          Authorization: `JWT ${accessToken}`
        }
      })
      .json<VersionResponse>()
  }

  getProfile = async () => {
    const accessToken = await this.getAccessToken()

    const profileEndpoint = `${baseApiUrl}/v5/accounts/profile`

    return got
      .get(profileEndpoint, {
        headers: {
          Authorization: `JWT ${accessToken}`
        }
      })
      .json<ProfileResponse>()
  }

  getAccessToken = async () => {
    const issuedAt = Math.floor(Date.now() / 1000)
    const payload = {
      iss: this.options.apiKey,
      jti: Math.random().toString(),
      iat: issuedAt,
      exp: issuedAt + 60 * 5
    }

    return jwt.sign(payload, this.options.apiSecret, {
      algorithm: "HS256" // HMAC-SHA256 signing algorithm
    })
  }
}
