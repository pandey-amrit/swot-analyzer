import OpenAI from "openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set")
}

export const MODEL = "gpt-3.5-turbo"

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  maxRetries: 2,
  timeout: 20000,
})

export interface GenerateTextOptions {
  model: string
  prompt: string
  temperature?: number
  maxOutputTokens?: number
}

export interface GenerateTextResult {
  text: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function generateText({
  model = MODEL,
  prompt,
  temperature = 0.5,
  maxOutputTokens = 700,
}: GenerateTextOptions): Promise<GenerateTextResult> {
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: maxOutputTokens,
  })

  const content = response.choices[0]?.message?.content || ""
  const usage = response.usage

  return {
    text: content,
    usage: usage ? {
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
    } : undefined,
  }
}