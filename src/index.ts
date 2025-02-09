import { FormData } from "formdata-node"
import { fileFromPath } from "formdata-node/file-from-path"
import got from "got"
import jwt from "jsonwebtoken"

import { retry } from "./utils"

type UploadResponse = {
  uuid: string
  channel: "listed" | "unlisted"
  processed: boolean
  submitted: boolean
  url: string
  valid: boolean
  validation: object
  version: string
}

type VersionResponse = {
  id: number
  approval_notes: string
  channel: "listed" | "unlisted"
  compatibility: object
  edit_url: string
  file: {
    id: number
    created: string
    hash: string
    is_mozilla_signed_extension: boolean
    size: number
    status: "public" | "disabled" | "nominated"
    url: string
    permissions: string[]
    optional_permissions: string[]
    host_permissions: string[]
  }
  is_disabled: boolean
  is_strict_compatibility_enabled: boolean
  license: object | null
  release_notes: string | null
  reviewed: string
  source: string | null
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

export type Options = {
  apiKey: string
  apiSecret: string

  extId?: string
  channel?: UploadResponse["channel"]
  license?: string
}

export type SubmitOptions = {
  filePath: string
  version?: string
  sourcePath?: string
  approvalNotes?: string
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
    return `${baseApiUrl}/v5/addons/addon/${encodeURIComponent(
      this.options.extId
    )}`
  }

  constructor(options: Options) {
    for (const field of requiredFields) {
      if (!options[field]) {
        throw new Error(errorMap[field])
      }
    }

    this.options = { ...options }

    this.options.channel = options.channel || "listed"

    if (this.options.license === "inherit") {
      delete this.options.license
    } else {
      this.options.license = this.options.license || "all-rights-reserved"
    }
  }

  submit = async (
    {
      filePath,
      approvalNotes = null,
      sourcePath = null,
      version = "1.0.0"
    }: SubmitOptions
  ) => {
    const uploadResult = await this.uploadFile({
      filePath
    })

    const uploadValidated = await retry(
      async () => {
        const uploadStatus = await this.getUpload({
          uploadUuid: uploadResult.uuid
        })
        return uploadStatus.valid
      },
      60,
      10000 // 10 min timeout recommended by mozilla
    )

    // Wait for upload to be validated
    if (!uploadValidated) {
      throw new Error("Upload has not been validated in time.")
    }

    return await this.createVersion({
      uploadUuid: uploadResult.uuid,
      version,
      approvalNotes,
      sourcePath
    })
  }

  uploadFile = async ({ filePath }) => {
    const accessToken = await this.getAccessToken()

    // https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#upload-create
    const uploadEndpoint = `${baseApiUrl}/v5/addons/upload/`

    const formData = new FormData()
    formData.append("upload", await fileFromPath(filePath))
    formData.append("channel", this.options.channel)

    const resp = await got.post(uploadEndpoint, {
      body: formData,
      headers: {
        Authorization: `JWT ${accessToken}`
      },
      throwHttpErrors: false
    })

    if (resp.statusCode >= 400) {
      if (resp.statusCode === 401) {
        throw new Error("Invalid access token")
      } else if (resp.statusCode === 403) {
        throw new Error("You do not own this add-on")
      } else {
        throw new Error(JSON.parse(resp.body).error || "Unknown error")
      }
    }

    return JSON.parse(resp.body) as UploadResponse
  }

  createVersion = async (
    {
      uploadUuid,
      version,
      approvalNotes,
      sourcePath,
    }
  ) => {
    const accessToken = await this.getAccessToken()

    // https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#version-create
    const uploadEndpoint = `${this.productEndpoint}/versions/`

    const formData = new FormData()
    formData.append("upload", uploadUuid)

    if (sourcePath) {
      formData.append('source', await fileFromPath(sourcePath))
    } else {
      formData.append('source', '')
    }

    if (approvalNotes) {
      formData.append('approval_notes', approvalNotes);
    }

    if (!!this.options.license) {
      formData.append("license", this.options.license)
    }
    const resp = await got.post(uploadEndpoint, {
      body: formData,
      headers: {
        Authorization: `JWT ${accessToken}`
      },
      throwHttpErrors: false
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

    return JSON.parse(resp.body) as VersionResponse
  }

  getUpload = async ({ uploadUuid }) => {
    const accessToken = await this.getAccessToken()

    const addonEndpoint = `${baseApiUrl}/v5/addons/upload/${uploadUuid}`

    return got
      .get(addonEndpoint, {
        headers: {
          Authorization: `JWT ${accessToken}`
        }
      })
      .json<UploadResponse>()
  }

  getVersion = async ({ version = "1.0.0" }) => {
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
