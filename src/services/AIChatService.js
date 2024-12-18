export const getAIResponse = async (message) => {
    // Use an API call to your chosen AI model
    const response = await fetch('https://api.openai.com/generate-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message }),
    });
    
    const data = await response.json();
    return data.text;
  };
  