/**
 * @deprecated Import from ../lib/ai/prompts/ instead.
 * Kept as a thin re-export so existing imports keep working.
 */

export {
  COLLABOTICKET_BRAND_PHILOSOPHY,
  GOLD_STANDARD_STYLE_NOTES,
  INSIGHT_ENGINE_BODY_MODEL,
  INSIGHT_ENGINE_VERSION,
  INSIGHT_ENGINE_V2_SYSTEM_PROMPT,
  INSIGHT_OUTPUT_STRUCTURE,
  buildAmazonAeoArticlePrompt,
  buildInsightArticlePrompt,
  buildInsightResponsesPayload,
  resolveInsightBodyModel,
} from "../lib/ai/prompts/prompt-builder.mjs"

export { AMAZON_AEO_SYSTEM_PROMPT } from "./collaboticket-insight-engine.mjs"
