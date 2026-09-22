#!/usr/bin/env node
/**
 * Weekly Amazon Japan insight publisher orchestrator.
 *
 * Usage:
 *   node scripts/publish-amazon-weekly.mjs
 *   node scripts/publish-amazon-weekly.mjs --dry-run
 *   node scripts/publish-amazon-weekly.mjs --skip-fetch
 */

import { spawnSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(" ")}`)
  const res = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  })
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed with code ${res.status}`)
  }
}

function main() {
  const dryRun = process.argv.includes("--dry-run")
  const skipFetch = process.argv.includes("--skip-fetch")

  if (!skipFetch) {
    run("node", ["scripts/fetch-amazon-news-apify.mjs", "--time-range", "7d", "--max", "60"])
  }

  run("node", ["scripts/select-amazon-topics.mjs", "--count", "2", "--weekly"])

  const genArgs = ["scripts/generate-amazon-insights.mjs"]
  if (dryRun) genArgs.push("--dry-run")
  run("node", genArgs)

  console.log("\nWeekly Amazon insights pipeline finished.")
  if (!dryRun) {
    console.log("Next: commit content/blog/*.md + open PR (CI workflow does this automatically).")
  }
}

main()
