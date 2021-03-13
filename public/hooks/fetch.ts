import ky, { Options } from 'ky';
import { set, get } from 'idb-keyval';
import { useContext, useState } from 'preact/hooks';
import { AppStateContext } from '../providers/appState';

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
  const { loadStart, loadComplete, setError } = useContext(AppStateContext);
  const [data, setData] = useState<Response>(options.initial);

  function fetcher() {
    loadStart();
    fromCache<Response>(url)
      .then((data) => data ?? cachedFetch<Response>(url, options))
      .then(setData)
      .catch(setError)
      .finally(loadComplete);
  }
  return [data, fetcher] as const;
}
