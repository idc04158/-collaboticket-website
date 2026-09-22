/**
 * @deprecated Import from ../lib/ai/prompts/ instead.
 * Thin re-export for existing script imports.
 */

import { buildCollaboTicketSystemPrompt } from "../lib/ai/prompts/collaboticket-system-prompt.mjs"
import { buildAmazonLayerRules } from "../lib/ai/prompts/layers/amazon.mjs"

export {
  COLLABOTICKET_BRAND_PHILOSOPHY,
  COLLABOTICKET_VOICE,
  GOLD_STANDARD_STYLE_NOTES,
  INSIGHT_ENGINE_BODY_MODEL,
  INSIGHT_ENGINE_VERSION,
  INSIGHT_ENGINE_V2_SYSTEM_PROMPT,
  INSIGHT_OUTPUT_STRUCTURE,
  buildAmazonAeoArticlePrompt,
  buildCollaboTicketSystemPrompt,
  buildInsightArticlePrompt,
  buildInsightResponsesPayload,
  buildPrompt,
  buildRewriteArticlePrompt,
  getSharedSystemPrompt,
  resolveInsightBodyModel,
} from "../lib/ai/prompts/prompt-builder.mjs"

/** @deprecated use getSharedSystemPrompt("amazon") */
export const AMAZON_AEO_SYSTEM_PROMPT = buildCollaboTicketSystemPrompt([buildAmazonLayerRules()])
