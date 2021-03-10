import ky, { Options } from 'ky';
import { set, get } from 'idb-keyval';
import { useState } from 'preact/hooks';

async function cachedFetch<Response = unknown>(url: string, options?: Options) {
  try {
    const data = await ky.get(url, options).json<Response>();
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
  options: Options = {},
  initial?: Response,
) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Response>(initial);
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
