
import { generateAIResponse } from '../services/aiService.js';
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate user input
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message.'
      });
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message.trim());

    // Send response to frontend
    return res.status(200).json({
      success: true,
      data: {
        userMessage: message.trim(),
        aiResponse
      }
    });

  } catch (error) {
    console.error('AI Controller Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to generate AI response. Please try again.'
    });
  }
};
