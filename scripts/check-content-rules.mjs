#!/usr/bin/env node
/**
 * 인사이트 콘텐츠 룰 일괄 검증
 *
 * Usage:
 *   node scripts/check-content-rules.mjs
 *   node scripts/check-content-rules.mjs --list
 *   node scripts/check-content-rules.mjs --strict
 */

import { spawnSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"
import {
  CONTENT_RULE_CHECKS,
  CONTENT_RULE_REGISTRY,
  CONTENT_RULES_CHANGELOG,
  CONTENT_RULES_VERSION,
  listContentRules,
} from "./insight-content-rules-registry.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")

function runNpmScript(scriptName, extraArgs = []) {
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm"
  const result = spawnSync(npmCmd, ["run", scriptName, "--", ...extraArgs], {
    cwd: ROOT,
    encoding: "utf8",
    shell: process.platform === "win32",
  })
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
  }
}

if (process.argv.includes("--list")) {
  console.log(`Content rules version: ${CONTENT_RULES_VERSION}\n`)
  for (const rule of listContentRules()) {
    const tags = [
      rule.generation ? "generation" : null,
      rule.runtime ? "runtime" : null,
    ]
      .filter(Boolean)
      .join(", ")
    console.log(`- ${rule.id}`)
    console.log(`  ${CONTENT_RULE_REGISTRY.find((r) => r.id === rule.id)?.summary ?? ""}`)
    console.log(`  [${tags || "docs"}] enforce: ${rule.enforce.join(", ") || "—"} | fix: ${rule.fix.join(", ") || "—"}`)
  }
  process.exit(0)
}

console.log(`Checking content rules (${CONTENT_RULES_VERSION})...\n`)

let failed = 0
for (const check of CONTENT_RULE_CHECKS) {
  const useStrict = process.argv.includes("--strict") || check.strict
  const extraArgs = useStrict ? ["--strict"] : []
  const result = runNpmScript(check.script, extraArgs)
  const rule = CONTENT_RULE_REGISTRY.find((r) => r.id === check.id)

  if (result.ok) {
    console.log(`✓ ${check.id} (${check.script})`)
  } else {
    failed++
    console.log(`✗ ${check.id} (${check.script})`)
    console.log(`  ${rule?.summary ?? ""}`)
    if (rule?.fix?.length) {
      console.log(`  fix: npm run ${rule.fix[0]}`)
    }
    if (result.output) {
      console.log(result.output.split("\n").slice(0, 12).map((l) => `  ${l}`).join("\n"))
    }
  }
}

const latest = CONTENT_RULES_CHANGELOG[0]
if (latest?.version === CONTENT_RULES_VERSION) {
  console.log(`\nRegistry: scripts/insight-content-rules-registry.mjs`)
  console.log(`Latest changelog (${latest.version}): ${latest.changes[0]}`)
}

if (failed > 0) {
  console.log(`\n${failed} check(s) failed.`)
  process.exit(1)
}

console.log("\nAll content rule checks passed.")
