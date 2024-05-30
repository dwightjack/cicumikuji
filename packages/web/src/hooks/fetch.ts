import { get, set } from 'idb-keyval';
import ky, { type Options } from 'ky';
import { useState } from 'preact/hooks';
import { useAppState } from '../providers/appState';

export interface FetchOptions<T> extends Options {
  transform?: <T>(data: any) => T;
  initial?: T;
}

async function cachedFetch<Response = unknown>(
  url: string,
  options?: FetchOptions<Response>,
) {
  try {
    let data = await ky.get(url, options).json<Response>();
    if (typeof options?.transform === 'function') {
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
  { expireLimit = 120, force = false } = {},
) {
  if (force) {
    return undefined;
  }
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
  const { loadStart, loadComplete, setError } = useAppState();
  const [data, setData] = useState<Response | undefined>(options.initial);

  function fetcher(force = false) {
    loadStart();
    fromCache<Response>(url, { force })
      .then((result) => result ?? cachedFetch<Response>(url, options))
      .then(setData)
      .catch(setError)
      .finally(loadComplete);
  }
  return [data, fetcher] as const;
}
