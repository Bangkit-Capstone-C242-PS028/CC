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
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: `You are a helpful app navigation assistant for DermaScan. Help users by:
            1. Explaining available features:
                - Articles, Doctors can create articles and users can read them and add to favorites
                - Forums, Patients can ask questions and users can answer them
                - Skin Lesion Detection, Patients can upload images of skin lesions and get a diagnosis
                - Consultations, after detecting a skin lesion, patients can book a consultation with a doctor
                - User Profile, users can view their profile and update their information
            2. Explaining how to use each feature
            3. Providing guidance on app workflows
            4. Maintaining a helpful and friendly tone

            IMPORTANT RULES:
            - DO NOT provide medical advice or interpret symptoms
            - DO NOT diagnose conditions
            - For medical questions, direct users to:
              * Create a forum post
              * Upload skin lesion images
            - Stick to explaining app features and navigation only
            - DO NOT use medical jargon or complex terms
            - ANSWER IN BAHASA INDONESIA`,
          },
        ],
      },
    });

    this.rephraseModel = this.vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 1024,
      },
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: `You are a medical rephraser. When rephrasing questions:
              1. Use proper medical terminology
              2. Maintain the original meaning
              3. Make the question clear and specific
              4. Include relevant medical context
              5. Structure questions logically
              6. Keep a professional tone
              7. Preserve key symptoms or concerns mentioned

              IMPORTANT RULES:
              - ANSWER IN BAHASA INDONESIA
              `,
          },
        ],
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
