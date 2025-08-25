// MOCK VERSION FOR FRONTEND-ONLY DEPLOYMENT
// This version returns mock responses instead of making actual API calls

/**
 * Makes a request to the backend AI endpoint.
 * @param prompt The user's prompt for the AI.
 * @param model Optional: The specific OpenAI model to use (e.g., 'gpt-4').
 * @returns The AI's response string or null if an error occurred.
 */
export const fetchAIResponse = async (prompt: string, model?: string): Promise<string | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`Mock AI request - Prompt: ${prompt}, Model: ${model}`);
  
  // Return different mock responses based on keywords in the prompt
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
    return "Hello! I'm a mock AI assistant. This is a demo response for the frontend-only deployment.";
  } else if (lowerPrompt.includes('case') || lowerPrompt.includes('legal')) {
    return "I can help you analyze legal cases and foreclosure data. This is a mock response demonstrating the AI chat interface.";
  } else if (lowerPrompt.includes('company') || lowerPrompt.includes('database')) {
    return "The system contains various company databases including law firms, cable manufacturers, and other business entities. This is a demo response.";
  } else if (lowerPrompt.includes('help') || lowerPrompt.includes('what can you do')) {
    return "I'm a legal AI assistant that can help with:\n• Case analysis\n• Company research\n• Foreclosure data\n• Legal document review\n\n(This is a mock response for demonstration purposes)";
  } else {
    return `I understand you're asking about "${prompt}". In a full deployment, I would provide detailed analysis and insights. This is a demonstration of the chat interface.`;
  }
}; 