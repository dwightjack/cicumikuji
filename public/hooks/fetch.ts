import ky, { Options } from 'ky';
import { set, get } from 'idb-keyval';
import { useState } from 'preact/hooks';

export interface FetchOptions extends Options {
  params?: Record<string, any>;
  transform?: (data: any) => any;
}

async function cachedFetch<Response = unknown>(url: URL, options: Options) {
  const response = await ky(url, options).json<Response>();
  set(url.href, response);
  return response;
}

export function useFetch<Response = unknown>(
  uri: string,
  { params, transform = (x) => x, ...options }: FetchOptions = {},
) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Response>(null);
  const [error, setError] = useState(null);
  const url = new URL(uri);
  url.search = new URLSearchParams(params).toString();
  function fetcher() {
    setLoading(true);
    get<Response>(url.href)
      .then((data) => data ?? cachedFetch<Response>(url, options))
      .then(transform)
      .then(setData)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }
  return { isLoading, error, data, fetcher };
}
