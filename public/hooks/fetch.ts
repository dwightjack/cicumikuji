import ky, { Options } from 'ky';
import { set, get } from 'idb-keyval';
import { useState } from 'preact/hooks';

export interface FetchOptions extends Options {
  params?: Record<string, any>;
  transform?: (data: any) => any;
}

async function cachedFetch<Response = unknown>(url: URL, options: Options) {
  const data = await ky(url, options).json<Response>();
  await set(url.href, { data, timestamp: Date.now() });
  return data;
}

async function fromCache<Response = unknown>(
  url: URL,
  expireLimit: number = 24,
) {
  const value = await get<null | { data: Response; timestamp: number }>(
    url.href,
  );
  if (
    !value ||
    Date.now() >
      new Date(value.timestamp + expireLimit * 60 * 60 * 1000).getTime()
  ) {
    return undefined;
  }
  return value.data;
}

export function useFetch<Response = unknown>(
  uri: string,
  { params, transform = (x) => x, ...options }: FetchOptions = {},
  initial?: Response,
) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Response>(initial);
  const [error, setError] = useState(null);

  const url = new URL(uri);
  url.search = new URLSearchParams(params).toString();

  function fetcher() {
    setLoading(true);
    fromCache<Response>(url)
      .then((data) => data ?? cachedFetch<Response>(url, options))
      .then(transform)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }
  return { isLoading, error, data, fetcher };
}
