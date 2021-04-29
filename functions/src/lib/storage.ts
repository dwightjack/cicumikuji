import axios from 'axios';
import * as stream from 'stream';
import { Bucket } from '@google-cloud/storage';

import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

export async function uploadPostImage(
  post: FirebaseFirestore.DocumentData,
  bucket: Bucket,
) {
  const id = post.get('id') as string;
  const src = post.get('src') as string;
  console.log(`Processing post ${id} (${src})...`);
  const fileName = `posts/${id}.jpg`;
  const file = bucket.file(fileName);

  try {
    const writer = file.createWriteStream({
      public: true,
      resumable: false,
      validation: false,
      contentType: 'auto',
      metadata: {
        'Cache-Control': 'public, max-age=31536000',
      },
    });

    const response = await axios.get(src, {
      responseType: 'stream',
    });

    await pipeline(response.data, writer);

    await post.ref.update({
      local: true,
      originalSrc: src,
      src: file.publicUrl(),
    });

    console.log(`Uploaded ${fileName}!`);
  } catch (err) {
    console.error(err);
  }
}
