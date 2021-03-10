import ky, { Options } from 'ky';
import { set, get } from 'idb-keyval';
import { useState } from 'preact/hooks';

export interface FetchOptions<T> extends Options {
  transform?: <T>(data: any) => T;
  initial?: T;
}

async function cachedFetch<Response = unknown>(
  url: string,
  options?: FetchOptions<Response>,
) {
  try {
    let data = await ky.get(url, options).json();
    if (typeof options.transform === 'function') {
      data = options.transform(data);
    }
    await set(url, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

async function fromCache<Response = unknown>(
  url: string,
  expireLimit: number = 120,
) {
  const value = await get<null | { data: Response; timestamp: number }>(url);
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
  url: string,
  options: FetchOptions<Response> = {},
) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Response>(options.initial);
  const [error, setError] = useState(null);

  function fetcher() {
    setLoading(true);
    fromCache<Response>(url)
      .then((data) => data ?? cachedFetch<Response>(url, options))
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }
  return { isLoading, error, data, fetcher };
}
