import { useSignal } from '@preact/signals';
import { get, set } from 'idb-keyval';
import ky, { type Options } from 'ky';
import { useAppState } from '../providers/appState';

export interface FetchOptions<T> extends Options {
  transform?: <T>(data: any) => T;
  initial?: T;
}

async function cachedFetch<Response = unknown>(
  key: string,
  url: string,
  options?: FetchOptions<Response>,
) {
  let data = await ky.get(url, options).json<Response>();
  if (typeof options?.transform === 'function') {
    data = options.transform(data);
  }
  await set(key, { data, timestamp: Date.now() });
  return data;
}

async function fromCache<Response = unknown>(
  key: string,
  { expireLimit = 120, force = false } = {},
) {
  if (force) {
    return undefined;
  }
  const value = await get<null | { data: Response; timestamp: number }>(key);
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
  key: string,
  url: string,
  options: FetchOptions<Response> = {},
) {
  const { loadComplete, loadStart, setError } = useAppState();
  const data = useSignal<Response | undefined>(options.initial);

  function fetcher(force = false) {
    loadStart();
    fromCache<Response>(key, { force })
      .then((result) => result ?? cachedFetch<Response>(key, url, options))
      .then((result) => {
        data.value = result;
      })
      .catch(setError)
      .finally(loadComplete);
  }
  return [data, fetcher] as const;
}
