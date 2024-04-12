import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as url from 'node:url';
import admin from 'firebase-admin';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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
