'use client';

import dynamic from 'next/dynamic';

export { OPEN_COPILOT_EVENT, openAiCopilot } from './ai-copilot-events';

// Browser motion stays in a client chunk; the document shell remains a Server Component.
const AiPetAssistant = dynamic(() => import('./AiPetAssistant'), { ssr: false });

export default function AiCopilotFloating() {
  return <AiPetAssistant />;
}
