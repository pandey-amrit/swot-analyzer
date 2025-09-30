import { AnalysisRequest, AnalysisType } from './types'

export function buildPrompt({
  product,
  objective,
  segment,
  analysisType,
}: {
  product: string
  objective: string
  segment: string
  analysisType: AnalysisType
}): string {
  const ctx = `Product: ${product}\nObjective: ${objective}\nSegment: ${segment}`
  
  switch (analysisType) {
    case "marketing-okrs":
      return `
${ctx}

You are a CMO. Return **Markdown** in this exact structure:

### Objective
<one line objective rewritten for ${segment}>

### Key Results
- KR1: <metric with baseline → target, and timebox>
- KR2: <metric with baseline → target, and timebox>
- KR3: <metric with baseline → target, and timebox>

### Notes
- <one short risk or assumption>
- <one short dependency>
`
    case "strengths":
      return `
${ctx}

Return **Markdown** with a heading and exactly 5 bullets (≤12 words each).

### Strengths
- ...
- ...
- ...
- ...
- ...
`
    case "weaknesses":
      return `
${ctx}

Return **Markdown** with exactly 5 short bullets (≤12 words each).

### Weaknesses / Objections
- ...
- ...
- ...
- ...
- ...
`
    case "opportunities":
      return `
${ctx}

Return **Markdown** with 4 bullets. Each bullet: a 2–6 word theme, then a short why.

### Opportunities
- **<theme>** — <why it matters for ${segment}>
- **<theme>** — <why it matters for ${segment}>
- **<theme>** — <why it matters for ${segment}>
- **<theme>** — <why it matters for ${segment}>
`
    case "threats":
      return `
${ctx}

Return **Markdown** with 4 bullets. Each bullet includes a mitigation.

### Threats
- **<risk>** — Mitigation: <one line>
- **<risk>** — Mitigation: <one line>
- **<risk>** — Mitigation: <one line>
- **<risk>** — Mitigation: <one line>
`
    case "positioning":
      return `
${ctx}

Return **Markdown**:

### Market Positioning
**Tagline:** <≤7 words>  
**Value Prop:** <≤22 words>  

**Proof Points**
- <≤10 words>
- <≤10 words>
- <≤10 words>
`
    case "persona":
      return `
${ctx}

Return **Markdown** compact persona:

### Buyer Persona
**Name:** <first name> (<age>)  
**Role:** <role>  

**Goals**
- <3 bullets>

**Frictions**
- <3 bullets>

**Favorite Channels**
- <3 bullets>
`
    case "investment":
      return `
${ctx}

Return **Markdown** with exactly 3 bullets (≤14 words each).

### Investment Opportunities
- ...
- ...
- ...
`
    case "channels":
      return `
${ctx}

Return a **Markdown table** with exactly 6 rows:

### Channels & Distribution
Channel | How to use it for ${segment}
--- | ---
<channel> | <≤14 words, actionable>
<channel> | <≤14 words, actionable>
<channel> | <≤14 words, actionable>
<channel> | <≤14 words, actionable>
<channel> | <≤14 words, actionable>
<channel> | <≤14 words, actionable>
`
    default:
      return `
${ctx}

Return **Markdown** summary (≤120 words) with 3 bullets at the end.
`
  }
}

export function buildCombinedPrompt(requests: AnalysisRequest[]): string {
  return requests.map(request => {
    const analyses = request.analysisTypes.map(analysisType => {
      const prompt = buildPrompt({
        product: request.product,
        objective: request.objective,
        segment: request.segment,
        analysisType
      });
      return `### ${analysisType.toUpperCase()}\n${prompt}\n`;
    }).join('\n');

    return `## Analysis for ${request.product}\n${analyses}`;
  }).join('\n\n');
}

export function parseAnalysisResponse(text: string, requests: AnalysisRequest[]) {
  return requests.map(request => {
    const analysisMap: Record<string, string> = {};
    
    request.analysisTypes.forEach(type => {
      const typePattern = new RegExp(`### ${type.toUpperCase()}[\\s\\S]*?(?=### |$)`, 'i');
      const match = text.match(typePattern);
      analysisMap[type] = match ? match[0].replace(`### ${type.toUpperCase()}`, '').trim() : '';
    });

    return {
      product: request.product,
      objective: request.objective,
      segment: request.segment,
      analyses: analysisMap
    };
  });
}