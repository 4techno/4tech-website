export const OPEN_COPILOT_EVENT = '4tech:open-ai-copilot';

/** Small compatibility API shared by navigation and the Idea Studio. */
export function openAiCopilot(prompt?: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_COPILOT_EVENT, { detail: { prompt } }));
}
