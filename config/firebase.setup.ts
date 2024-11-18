import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
let app: admin.app.App = null;
@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if (!app) {
      const serviceAccountJson = JSON.stringify({
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      });
      const serviceAccount: admin.ServiceAccount =
        await JSON.parse(serviceAccountJson);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
  setup() {
    return app;
  }
}
