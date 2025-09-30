import { NextResponse } from "next/server"
import { generateText, MODEL } from './utils/openaiService'

export const runtime = "nodejs"
export const maxDuration = 30

type PromptType =
  | "marketing-okrs"
  | "strengths"
  | "weaknesses"
  | "opportunities"
  | "threats"
  | "positioning"
  | "persona"
  | "investment"
  | "channels"

interface GenerateBody {
  product: string
  objective: string
  segment: string
  promptType: PromptType
  prompt?: string
}

const ALLOWED_TYPES = new Set([
  "marketing-okrs",
  "strengths",
  "weaknesses",
  "opportunities",
  "threats",
  "positioning",
  "persona",
  "investment",
  "channels",
])

function buildPrompt({ product, objective, segment, promptType }: GenerateBody): string {
  const ctx = `Product: ${product}\nObjective: ${objective}\nSegment: ${segment}`
  
  switch (promptType) {
    case "marketing-okrs":
      return `${ctx}\n\nYou are a CMO. Return **Markdown** in this exact structure:\n\n### Objective\n<one line objective rewritten for ${segment}>\n\n### Key Results\n- KR1: <metric with baseline → target, and timebox>\n- KR2: <metric with baseline → target, and timebox>\n- KR3: <metric with baseline → target, and timebox>\n\n### Notes\n- <one short risk or assumption>\n- <one short dependency>`
    
    case "strengths":
      return `${ctx}\n\nReturn **Markdown** with a heading and exactly 5 bullets (≤12 words each).\n\n### Strengths\n- ...\n- ...\n- ...\n- ...\n- ...`
    
    case "weaknesses":
      return `${ctx}\n\nReturn **Markdown** with exactly 5 short bullets (≤12 words each).\n\n### Weaknesses / Objections\n- ...\n- ...\n- ...\n- ...\n- ...`
    
    case "opportunities":
      return `${ctx}\n\nReturn **Markdown** with 4 bullets. Each bullet: a 2–6 word theme, then a short why.\n\n### Opportunities\n- **<theme>** — <why it matters for ${segment}>\n- **<theme>** — <why it matters for ${segment}>\n- **<theme>** — <why it matters for ${segment}>\n- **<theme>** — <why it matters for ${segment}>`
    
    case "threats":
      return `${ctx}\n\nReturn **Markdown** with 4 bullets. Each bullet includes a mitigation.\n\n### Threats\n- **<risk>** — Mitigation: <one line>\n- **<risk>** — Mitigation: <one line>\n- **<risk>** — Mitigation: <one line>\n- **<risk>** — Mitigation: <one line>`
    
    case "positioning":
      return `${ctx}\n\nReturn **Markdown**:\n\n### Market Positioning\n**Tagline:** <≤7 words>  \n**Value Prop:** <≤22 words>  \n\n**Proof Points**\n- <≤10 words>\n- <≤10 words>\n- <≤10 words>`
    
    case "persona":
      return `${ctx}\n\nReturn **Markdown** compact persona:\n\n### Buyer Persona\n**Name:** <first name> (<age>)  \n**Role:** <role>  \n\n**Goals**\n- <3 bullets>\n\n**Frictions**\n- <3 bullets>\n\n**Favorite Channels**\n- <3 bullets>`
    
    case "investment":
      return `${ctx}\n\nReturn **Markdown** with exactly 3 bullets (≤14 words each).\n\n### Investment Opportunities\n- ...\n- ...\n- ...`
    
    case "channels":
      return `${ctx}\n\nReturn a **Markdown table** with exactly 6 rows:\n\n### Channels & Distribution\nChannel | How to use it for ${segment}\n--- | ---\n<channel> | <≤14 words, actionable>\n<channel> | <≤14 words, actionable>\n<channel> | <≤14 words, actionable>\n<channel> | <≤14 words, actionable>\n<channel> | <≤14 words, actionable>\n<channel> | <≤14 words, actionable>`
    
    default:
      return `${ctx}\n\nReturn **Markdown** summary (≤120 words) with 3 bullets at the end.`
  }
}

function isValidBody(b: any): b is GenerateBody {
  return (
    b &&
    typeof b.product === "string" &&
    b.product.length > 0 &&
    typeof b.objective === "string" &&
    b.objective.length > 0 &&
    typeof b.segment === "string" &&
    b.segment.length > 0 &&
    typeof b.promptType === "string" &&
    ALLOWED_TYPES.has(b.promptType)
  )
}

export async function POST(req: Request) {
  let body: unknown
  
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing/invalid fields. Required: { product, objective, segment, promptType }",
      },
      { status: 400 }
    )
  }

  const { product, objective, segment, promptType } = body
  const prompt = body.prompt || buildPrompt(body)
  const started = Date.now()

  try {
    const { text, usage } = await generateText({
      model: MODEL,
      prompt,
      temperature: 0.5,
      maxOutputTokens: 700,
    })

    const elapsedMs = Date.now() - started
    
    return NextResponse.json(
      {
        success: true,
        product,
        objective,
        segment,
        promptType,
        analysis: text.trim(),
        meta: {
          modelRequested: MODEL,
          modelUsed: MODEL,
          fallbackUsed: false,
          fallbackReason: null,
          elapsedMs,
          usage: usage || null,
          demo: false,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    )
  } catch (err: any) {
    const elapsedMs = Date.now() - started
    const message = err?.message || "Generation failed"
    const status = message.includes("timeout") || message.includes("AbortError") ? 504 : 500

    return NextResponse.json(
      {
        success: false,
        error: message,
        meta: { elapsedMs, modelRequested: MODEL },
      },
      { status }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      info: "POST { product, objective, segment, promptType } to generate analysis",
      modelRequested: MODEL,
    },
    { status: 200 }
  )
}
