import { Injectable, Logger } from '@nestjs/common';
import { PubSub, Topic } from '@google-cloud/pubsub';

@Injectable()
export class PubsubService {
  private pubsub: PubSub;
  private readonly logger = new Logger(PubsubService.name);

  constructor() {
    this.pubsub = new PubSub({
      projectId: process.env.PUBSUB_PROJECT_ID,
      credentials: {
        client_email: process.env.PUBSUB_CLIENT_EMAIL,
        private_key: process.env.PUBSUB_PRIVATE_KEY.replace(/\\n/gm, '\n'),
      },
    });
  }

  async publish(topicName: string, data: any): Promise<string> {
    try {
      const topic = await this.createTopic(topicName);
      const messageBuffer = Buffer.from(JSON.stringify(data));
      const [messageId] = await topic.publishMessage({
        data: messageBuffer,
      });
      this.logger.log(`Message ${messageId} published to topic ${topicName}`);
      return messageId;
    } catch (error) {
      this.logger.error(
        `Failed to publish message to ${topicName}: ${error.message}`,
      );
      throw error;
    }
  }

  async createTopic(topicName: string): Promise<Topic> {
    try {
      const [exists] = await this.pubsub.topic(topicName).exists();
      if (!exists) {
        await this.pubsub.createTopic(topicName);
        this.logger.log(`Topic ${topicName} created successfully`);
      }
      return this.pubsub.topic(topicName);
    } catch (error) {
      this.logger.error(
        `Failed to create topic ${topicName}: ${error.message}`,
      );
      throw error;
    }
  }
}
