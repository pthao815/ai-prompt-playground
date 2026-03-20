import { query } from '../db/pool'

export interface HistoryItem {
  id: string
  prompt: string
  role: string
  model: string
  output: string
  timestamp: number
}

type Role = 'user' | 'assistant' | 'system'

// Fake response generator — replace bodies with real AI SDK calls per provider
function buildResponse(prompt: string, role: Role, modelLabel: string): string {
  const p = prompt.trim()
  const tokens = Math.ceil(p.length / 4)
  const prefix = `[${modelLabel}]`

  const isCode =
    /\b(code|function|debug|bug|class|implement|algorithm|typescript|javascript|python)\b/i.test(p)
  const isWrite =
    /\b(write|blog|email|essay|article|summary|outline|letter)\b/i.test(p)

  let body: string
  if (p.length < 20) {
    body = 'Could you provide more detail? Your prompt seems quite brief.'
  } else if (isCode) {
    body = `Here's a solution based on your request:\n\n\`\`\`typescript\n// Generated for: "${p.slice(0, 40)}"\nfunction solution() {\n  // implementation\n  return result\n}\n\`\`\`\n\nThis follows best practices and is optimized for readability.`
  } else if (isWrite) {
    body = `Here's the content you requested:\n\n**Introduction:** This piece addresses the core theme of your prompt with clarity.\n\n**Main Body:** Key insights explored in depth with actionable examples.\n\n**Conclusion:** A compelling call-to-action that drives meaningful results.`
  } else {
    body = `Based on your ${p.length}-character prompt (~${tokens} tokens), here is a detailed response:\n\nThis addresses the key aspects of what you've asked. The model has analyzed your input and generated relevant content for your use case.\n\nFeel free to refine your prompt for more specific results.`
  }

  switch (role) {
    case 'system':
      return `${prefix} System context acknowledged. Operating under:\n\n${body}\n\nAll subsequent responses will adhere to these guidelines.`
    case 'assistant':
      return `${prefix} Responding as assistant:\n\n${body}`
    default:
      return `${prefix} ${body}`
  }
}

const MODEL_LABELS: Record<string, string> = {
  'gpt-4o': 'GPT-4o',
  'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
  'gemini-1.5-pro': 'Gemini 1.5 Pro',
  'mistral-large': 'Mistral Large',
}

export async function generateResponse(
  userId: string,
  prompt: string,
  role: string,
  model: string,
): Promise<{ output: string; historyItem: HistoryItem }> {
  const modelLabel = MODEL_LABELS[model] ?? model
  const output = buildResponse(prompt, role as Role, modelLabel)

  const [row] = await query<{ id: string; created_at: Date }>(
    `INSERT INTO prompt_history (user_id, prompt, role, model, output, token_count)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, created_at`,
    [userId, prompt, role, model, output, Math.ceil(prompt.length / 4)],
  )

  return {
    output,
    historyItem: {
      id: row.id,
      prompt,
      role,
      model,
      output,
      timestamp: new Date(row.created_at).getTime(),
    },
  }
}

export async function getHistory(userId: string, limit: number): Promise<HistoryItem[]> {
  const rows = await query<{
    id: string
    prompt: string
    role: string
    model: string
    output: string
    created_at: Date
  }>(
    `SELECT id, prompt, role, model, output, created_at
     FROM prompt_history
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  )
  return rows.map((r) => ({
    id: r.id,
    prompt: r.prompt,
    role: r.role,
    model: r.model,
    output: r.output,
    timestamp: new Date(r.created_at).getTime(),
  }))
}

export async function clearHistory(userId: string): Promise<void> {
  await query('DELETE FROM prompt_history WHERE user_id = $1', [userId])
}
