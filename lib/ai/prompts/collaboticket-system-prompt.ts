/**
 * Typed re-exports — source of truth is collaboticket-system-prompt.mjs
 * (Node scripts import .mjs directly; Next/TS can use this path).
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
} from "./collaboticket-system-prompt.mjs"
