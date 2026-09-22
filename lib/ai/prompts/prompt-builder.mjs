/**
 * CollaboTicket Prompt Builder
 * Common system prompt + task-specific layers.
 */

import {
  GOLD_STANDARD_STYLE_NOTES,
  buildCollaboTicketSystemPrompt,
  buildInsightResponsesPayload,
  resolveInsightBodyModel,
  COLLABOTICKET_BRAND_PHILOSOPHY,
  COLLABOTICKET_VOICE,
  INSIGHT_ENGINE_BODY_MODEL,
  INSIGHT_ENGINE_VERSION,
  INSIGHT_ENGINE_V2_SYSTEM_PROMPT,
  INSIGHT_OUTPUT_STRUCTURE,
} from "./collaboticket-system-prompt.mjs"
import { buildAmazonLayerRules, buildAmazonTaskBlock } from "./layers/amazon.mjs"
import { buildRewriteLayerRules, buildRewriteTaskBlock } from "./layers/rewrite.mjs"
import { buildAdminEditLayerRules, buildAdminEditTaskBlock } from "./layers/admin-edit.mjs"
import { buildVisualComponentsLayerRules } from "./layers/visual-components.mjs"
import { buildTerminologyLayerRules } from "./layers/terminology.mjs"

export {
  COLLABOTICKET_BRAND_PHILOSOPHY,
  COLLABOTICKET_VOICE,
  GOLD_STANDARD_STYLE_NOTES,
  INSIGHT_ENGINE_BODY_MODEL,
  INSIGHT_ENGINE_VERSION,
  INSIGHT_ENGINE_V2_SYSTEM_PROMPT,
  INSIGHT_OUTPUT_STRUCTURE,
  buildCollaboTicketSystemPrompt,
  buildInsightResponsesPayload,
  resolveInsightBodyModel,
}

/**
 * @param {"amazon" | "rewrite" | "admin-edit" | "base"} layer
 * @param {object} context
 */
export function buildPrompt(layer, context = {}) {
  const extras = context.extraBlocks || []

  switch (layer) {
    case "amazon":
      return [
        buildCollaboTicketSystemPrompt([
          buildAmazonLayerRules(),
          buildTerminologyLayerRules(),
          buildVisualComponentsLayerRules(),
          ...extras,
        ]),
        "---",
        buildAmazonTaskBlock({
          item: context.item,
          relatedSlugs: context.relatedSlugs,
          newsSeeds: context.newsSeeds,
          goldNotes: GOLD_STANDARD_STYLE_NOTES,
        }),
      ].join("\n\n")

    case "rewrite":
      return [
        buildCollaboTicketSystemPrompt([
          buildRewriteLayerRules(),
          buildTerminologyLayerRules(),
          buildVisualComponentsLayerRules(),
          ...extras,
        ]),
        "---",
        buildRewriteTaskBlock(context),
      ].join("\n\n")

    case "admin-edit":
      return [
        buildCollaboTicketSystemPrompt([
          buildAdminEditLayerRules(context.learnedRules || ""),
          buildTerminologyLayerRules(),
          ...extras,
        ]),
        "---",
        buildAdminEditTaskBlock(context),
      ].join("\n\n")

    case "base":
    default:
      return buildCollaboTicketSystemPrompt(extras)
  }
}

/** Convenience builders used by scripts */
export function buildInsightArticlePrompt({ item, relatedSlugs = [], newsSeeds = [] }) {
  return buildPrompt("amazon", { item, relatedSlugs, newsSeeds })
}

export function buildAmazonAeoArticlePrompt(args) {
  return buildInsightArticlePrompt(args)
}

export function buildRewriteArticlePrompt(context) {
  return buildPrompt("rewrite", context)
}

export function buildAdminEditPrompt(context) {
  return buildPrompt("admin-edit", context)
}

/** System-only string (no task block) — for chat completions system role */
export function getSharedSystemPrompt(layer = "base", layerOptions = {}) {
  const extras = layerOptions.extraBlocks || []
  if (layer === "amazon") {
    return buildCollaboTicketSystemPrompt([
      buildAmazonLayerRules(),
      buildTerminologyLayerRules(),
      buildVisualComponentsLayerRules(),
      ...extras,
    ])
  }
  if (layer === "rewrite") {
    return buildCollaboTicketSystemPrompt([
      buildRewriteLayerRules(),
      buildTerminologyLayerRules(),
      buildVisualComponentsLayerRules(),
      ...extras,
    ])
  }
  if (layer === "admin-edit") {
    return buildCollaboTicketSystemPrompt([
      buildAdminEditLayerRules(layerOptions.learnedRules || ""),
      buildTerminologyLayerRules(),
      ...extras,
    ])
  }
  return buildCollaboTicketSystemPrompt(extras)
}
