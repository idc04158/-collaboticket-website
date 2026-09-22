/**
 * CollaboTicket AI Prompt Builder — public entry.
 *
 * Brand philosophy & voice: edit ONLY in collaboticket-system-prompt.mjs
 * Task layers (amazon / rewrite / admin-edit): lib/ai/prompts/layers/
 */

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
} from "./collaboticket-system-prompt"

export {
  buildAdminEditPrompt,
  buildAmazonAeoArticlePrompt,
  buildInsightArticlePrompt,
  buildPrompt,
  buildRewriteArticlePrompt,
  getSharedSystemPrompt,
} from "./prompt-builder"
