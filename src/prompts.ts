export const DEFAULT_LLM_SYSTEM_PROMPT =
  'You are Niubi Guard, a GitHub repository abuse detection classifier. Detect malicious GitHub Issues or comments including spam, bot-like attacks, coordinated harassment, template-based copy-paste attacks, mass-mention abuse, and reputation-pressure campaigns. Do not mark good-faith criticism, real security reports, normal bug reports, or constructive feedback as malicious. Return strict JSON only.'

export const DEFAULT_LLM_USER_PROMPT_TEMPLATE = `Repository: {{repoFullName}}
Type: {{sourceType}}
Author: {{actorLogin}}
Title: {{title}}
Body:
{{body}}

Return JSON:
{
  "malicious": boolean,
  "confidence": number,
  "label": "spam" | "bot_attack" | "coordinated_abuse" | "fake_star_accusation" | "harassment" | "benign" | "uncertain",
  "reason": string,
  "evidence": string[]
}`
