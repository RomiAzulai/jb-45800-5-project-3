import { Response } from 'express';
import OpenAI from 'openai';
import { AuthRequest } from '../middleware/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const getRecommendation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { destination } = req.body;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      res.json({
        recommendation: generateFallbackRecommendation(destination),
        source: 'fallback',
      });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a travel expert. Provide helpful, engaging travel recommendations for destinations. Include top attractions, best time to visit, local cuisine, and travel tips. Keep responses concise but informative (2-3 paragraphs).',
        },
        {
          role: 'user',
          content: `Give me a travel recommendation for visiting ${destination}. What should I see, eat, and do?`,
        },
      ],
      max_tokens: 500,
    });

    const recommendation = completion.choices[0]?.message?.content || 'No recommendation available.';

    res.json({ recommendation, source: 'ai' });
  } catch (error) {
    console.error('AI recommendation error:', error);
    const { destination } = req.body;
    res.json({
      recommendation: generateFallbackRecommendation(destination),
      source: 'fallback',
    });
  }
};

function generateFallbackRecommendation(destination: string): string {
  return `Travel Recommendation for ${destination}:

${destination} is a wonderful destination worth exploring! Here are some highlights:

**Top Attractions:** Discover the iconic landmarks and hidden gems that make ${destination} unique. Take a guided walking tour to learn about the local history and culture.

**Local Cuisine:** Don't miss the opportunity to taste authentic local dishes. Visit popular restaurants and street food markets for an unforgettable culinary experience.

**Travel Tips:** The best way to explore ${destination} is by mixing popular tourist spots with off-the-beaten-path locations. Consider visiting during shoulder season for fewer crowds and better prices. Book accommodations in advance and learn a few basic phrases in the local language.

Enjoy your trip to ${destination}!`;
}
