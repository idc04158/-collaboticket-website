import { promises as fs } from "fs"
import path from "path"

export type ActivityEntry = {
  id: string
  at: string
  actor: string
  action: string
  detail?: string
  meta?: Record<string, string>
}

const logPath = path.join(process.cwd(), "data", "crm-activity.json")
const MAX = 500

async function ensureFile() {
  await fs.mkdir(path.dirname(logPath), { recursive: true })
  try {
    await fs.access(logPath)
  } catch {
    await fs.writeFile(logPath, "[]", "utf8")
  }
}

export async function readActivityLog(): Promise<ActivityEntry[]> {
  await ensureFile()
  const raw = await fs.readFile(logPath, "utf8")
  const list = JSON.parse(raw) as ActivityEntry[]
  return Array.isArray(list) ? list : []
}

export async function appendActivity(entry: Omit<ActivityEntry, "id" | "at">) {
  await ensureFile()
  const list = await readActivityLog()
  const row: ActivityEntry = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    ...entry,
  }
  const next = [row, ...list].slice(0, MAX)
  await fs.writeFile(logPath, JSON.stringify(next, null, 2), "utf8")
  return row
}
