import got from 'got';
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
    await pipeline(
      got.stream(src) as any,
      file.createWriteStream({
        public: true,
        resumable: false,
        validation: false,
        contentType: 'auto',
        metadata: {
          'Cache-Control': 'public, max-age=31536000',
        },
      }),
    );
    console.log(`Uploaded ${fileName}!`);

    await post.ref.update({
      local: true,
      originalSrc: src,
      src: file.publicUrl(),
    });
  } catch (e) {
    console.error(e);
  }
}
