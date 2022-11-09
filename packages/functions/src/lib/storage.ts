import axios from 'axios';
import stream from 'stream';
import { Bucket } from '@google-cloud/storage';
import { Post } from '../types';
import { camelCase } from '../utils';

import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

export interface PostResourceConfig {
  type?: string;
  field?: keyof Post;
}

export async function uploadPostResource(
  post: FirebaseFirestore.DocumentData,
  bucket: Bucket,
  { type = 'jpg', field = 'src' }: PostResourceConfig = {},
) {
  const id = post.get('id') as string;
  const src = post.get(field) as string;
  if (!src) {
    return;
  }
  console.log(`Processing post ${id} (${type}: ${src})...`);
  const fileName = `posts/${id}.${type}`;

  function errorFallback(src: string, response: any) {
    console.error(`Error fetching the resource: ${src} - ${response.status}`);
    return post.ref.update({
      local: true,
      skip: `${post.get('skip') || ''} (${src} - ${
        response.statusText
      })`.trim(),
    });
  }

  try {
    const response = await axios.get(src, {
      responseType: 'stream',
    });

    if (response.status !== 200) {
      return await errorFallback(src, response);
    }

    const file = bucket.file(fileName);
    const writer = file.createWriteStream({
      public: true,
      resumable: false,
      validation: false,
      contentType: 'auto',
      metadata: {
        'Cache-Control': 'public, max-age=31536000',
      },
    });

    await pipeline(response.data, writer);

    await post.ref.update({
      local: true,
      [camelCase(`original_${field}`)]: src,
      [field]: file.publicUrl(),
    });

    console.log(`Uploaded ${fileName}!`);
  } catch (error: any) {
    await errorFallback(src, error.response);
  }
}
