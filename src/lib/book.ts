import fs from "node:fs"
import path from "node:path"

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "bookings.json")

function readEmails(): string[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const raw = fs.readFileSync(DATA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeEmails(emails: string[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(emails, null, 2), "utf-8")
}

export function addEmail(email: string): { success: boolean; error?: string } {
  const emails = readEmails()

  const normalized = email.toLowerCase().trim()

  if (emails.some((e) => e.toLowerCase() === normalized)) {
    return { success: false, error: "This email is already on the list" }
  }

  emails.push(email.trim())
  writeEmails(emails)
  return { success: true }
}
