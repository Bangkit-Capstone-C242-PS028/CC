import { VertexAI } from '@google-cloud/vertexai';

import { Injectable } from '@nestjs/common';

@Injectable()
export class VertexaiService {
  private readonly vertexAI: VertexAI;
  private readonly generativeModel;

  constructor() {
    this.vertexAI = new VertexAI({
      project: process.env.VERTEX_AI_PROJECT,
      location: process.env.VERTEX_AI_LOCATION,
    });

    this.generativeModel = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: {
        role: 'system',
        parts: [
          { text: `For example, you are a helpful customer service agent.` },
        ],
      },
    });
  }

  async chat(message: string) {
    try {
      const chat = this.generativeModel.startChat();
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return {
        reply: response,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
