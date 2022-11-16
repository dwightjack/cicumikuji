import { existsSync } from 'fs';
import { resolve } from 'path';
import admin from 'firebase-admin';

export const serviceAccountFile = resolve(
  __dirname,
  '../../cicumikuji-firebase-adminsdk.json',
);

export async function initialize() {
  if (!existsSync(serviceAccountFile)) {
    throw new Error(
      `Service account file ${serviceAccountFile} not found. run "make" to setup your local environment`,
    );
  }
  const serviceAccount: admin.ServiceAccount = await import(serviceAccountFile);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
