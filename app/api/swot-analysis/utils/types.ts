// Types for request/response handling
export interface AnalysisRequest {
  product: string
  objective: string
  segment: string
  analysisTypes: AnalysisType[]
}

export type AnalysisType =
  | "marketing-okrs"
  | "strengths"
  | "weaknesses"
  | "opportunities"
  | "threats"
  | "positioning"
  | "persona"
  | "investment"
  | "channels"

export interface GenerateBody {
  requests: AnalysisRequest[]
}

// OpenAI response types
export type GenerateTextReturn = {
  text: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export type CallLLMResult = GenerateTextReturn & {
  modelUsed: string
  fallbackUsed: boolean
  error?: string | null
}