import axios from 'axios';
import * as stream from 'stream';
import { Bucket } from '@google-cloud/storage';

import { promisify } from 'util';

const finished = promisify(stream.finished);

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
    const response = await axios({
      method: 'get',
      url: src,
      responseType: 'stream',
    });

    const writer = file.createWriteStream({
      public: true,
      resumable: false,
      validation: false,
      contentType: 'auto',
      metadata: {
        'Cache-Control': 'public, max-age=31536000',
      },
    });

    response.data.pipe(writer);

    await finished(writer);

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
