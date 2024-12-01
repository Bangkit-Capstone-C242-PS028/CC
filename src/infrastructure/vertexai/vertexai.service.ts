import { Injectable } from '@nestjs/common';
import { VertexAI } from '@google-cloud/vertexai';

@Injectable()
export class VertexaiService {
  private readonly vertexAI: VertexAI;
  private readonly chatbotModel;
  private readonly rephraseModel;

  constructor() {
    this.vertexAI = new VertexAI({
      project: process.env.VERTEX_AI_PROJECT,
      location: process.env.VERTEX_AI_LOCATION,
    });

    this.chatbotModel = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    this.rephraseModel = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });
  }

  async chat(message: string) {
    const result = await this.chatbotModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
    });
    return { reply: result.response.candidates[0].content.parts[0].text };
  }

  async rephrase(text: string) {
    const result = await this.rephraseModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Please rephrase this medical question professionally: "${text}"`,
            },
          ],
        },
      ],
    });
    return { reply: result.response.candidates[0].content.parts[0].text };
  }
}
