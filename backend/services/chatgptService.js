const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Get password strength feedback from ChatGPT
 */
exports.getPasswordStrengthFeedback = async (password) => {
  try {
    const prompt = `Analyze the following password and provide feedback on its strength. Provide suggestions for improvement if needed. Be concise and helpful.

Password: ${password}

Provide feedback in JSON format with the following structure:
{
  "strength": "weak|moderate|strong",
  "score": 0-100,
  "feedback": "brief feedback message",
  "suggestions": ["suggestion1", "suggestion2", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a cybersecurity expert specializing in password security. Provide helpful and constructive feedback." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      // If parsing fails, return structured default response
    }

    // Fallback response
    return {
      strength: "moderate",
      score: 50,
      feedback: responseText || "Password analysis completed",
      suggestions: ["Use a mix of uppercase and lowercase letters", "Include numbers and special characters", "Make it at least 12 characters long"]
    };
  } catch (error) {
    console.error('ChatGPT API Error:', error.message);
    // Return default feedback if API fails
    return {
      strength: "moderate",
      score: 50,
      feedback: "Unable to analyze password strength at this time",
      suggestions: ["Use a mix of uppercase and lowercase letters", "Include numbers and special characters", "Make it at least 12 characters long"]
    };
  }
};

/**
 * Get explanation for authentication errors
 */
exports.getAuthErrorExplanation = async (errorType, errorMessage) => {
  try {
    const prompt = `A user is experiencing an authentication error. Explain what went wrong and how they can fix it in a friendly, helpful manner.

Error Type: ${errorType}
Error Message: ${errorMessage}

Provide a clear explanation in JSON format:
{
  "explanation": "user-friendly explanation of the error",
  "cause": "what caused this error",
  "solution": "how to fix it",
  "prevention": "how to prevent this in the future"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful technical support assistant. Explain authentication errors clearly and provide actionable solutions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      // If parsing fails, return default response
    }

    // Fallback response
    return {
      explanation: errorMessage || "An authentication error occurred",
      cause: "Authentication failed",
      solution: "Please check your credentials and try again",
      prevention: "Ensure you're using the correct email and password"
    };
  } catch (error) {
    console.error('ChatGPT API Error:', error.message);
    return {
      explanation: errorMessage || "An authentication error occurred",
      cause: "Authentication failed",
      solution: "Please check your credentials and try again",
      prevention: "Ensure you're using the correct email and password"
    };
  }
};

