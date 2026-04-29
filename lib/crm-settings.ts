import { promises as fs } from "fs"
import path from "path"

export type EmailTemplateCategory = "first-contact" | "follow-up" | "proposal" | "reminder"

export type EmailTemplate = {
  id: string
  name: string
  category: EmailTemplateCategory
  subject: string
  body: string
  createdAt: string
}

export type CrmSettings = {
  emailSignature: string
  templates: EmailTemplate[]
}

const settingsPath = path.join(process.cwd(), "data", "crm-settings.json")

const defaultSettings: CrmSettings = {
  emailSignature: "",
  templates: [],
}

async function ensureFile() {
  await fs.mkdir(path.dirname(settingsPath), { recursive: true })
  try {
    await fs.access(settingsPath)
  } catch {
    await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2), "utf8")
  }
}

export async function readCrmSettings(): Promise<CrmSettings> {
  await ensureFile()
  const raw = await fs.readFile(settingsPath, "utf8")
  const parsed = JSON.parse(raw) as Partial<CrmSettings>
  return {
    emailSignature: typeof parsed.emailSignature === "string" ? parsed.emailSignature : "",
    templates: Array.isArray(parsed.templates) ? parsed.templates : [],
  }
}

export async function writeCrmSettings(next: CrmSettings) {
  await ensureFile()
  await fs.writeFile(settingsPath, JSON.stringify(next, null, 2), "utf8")
}

export async function upsertEmailTemplate(template: Omit<EmailTemplate, "id" | "createdAt"> & { id?: string }) {
  const settings = await readCrmSettings()
  const id = template.id || crypto.randomUUID()
  const existing = settings.templates.find((t) => t.id === id)
  const entry: EmailTemplate = {
    id,
    name: template.name,
    category: template.category,
    subject: template.subject,
    body: template.body,
    createdAt: existing?.createdAt || new Date().toISOString(),
  }
  const others = settings.templates.filter((t) => t.id !== id)
  settings.templates = [entry, ...others]
  await writeCrmSettings(settings)
  return entry
}

export async function deleteEmailTemplate(id: string) {
  const settings = await readCrmSettings()
  settings.templates = settings.templates.filter((t) => t.id !== id)
  await writeCrmSettings(settings)
}
