import type { PropsWithChildren } from 'solid-js';
import { createContext, onCleanup, useContext } from 'solid-js';

import type { RequestOptions, Resp, UploadOptions } from '../core/http';
import { http } from '../core/http';

export type ErrorResponse = {
  statusCode: number;
  errMsg: string;
  request: RequestOptions;
};

interface ReqOptions {
  method: string;
  endpoint: string;
}

interface ApiProps extends PropsWithChildren {
  baseUrl: string;
  headers?: () => HeadersInit;
  onResponse?: (req: ReqOptions, response: Resp<any>) => void;
}

interface ApiContextReturn {
  fetch: <TResponse extends Record<string, any>>(
    options: RequestOptions
  ) => Promise<Resp<TResponse>>;
  upload: <TResponse extends Record<string, any>>(
    options: UploadOptions
  ) => Promise<Resp<TResponse>>;
}

const ApiContext = createContext<ApiContextReturn>();

const ApiProvider = (props: ApiProps) => {
  const fetch = async <TResponse extends Record<string, any>>(
    options: RequestOptions
  ): Promise<Resp<TResponse>> => {
    const { request } = http({
      baseUrl: props.baseUrl,
      headers: props?.headers()
    });

    const result = await request<TResponse>(options);

    props?.onResponse(options, result);

    return result;
  };

  const upload = async <TResponse extends Record<string, any>>(
    options: UploadOptions
  ): Promise<Resp<TResponse>> => {
    const { upload } = http({
      baseUrl: props.baseUrl,
      headers: props?.headers()
    });

    const result = await upload<TResponse>(options);

    props?.onResponse(
      { method: options.method?.toString(), endpoint: options.endpoint },
      result
    );

    return result;
  };

  onCleanup(() => {});

  const ctx: ApiContextReturn = {
    fetch,
    upload
  };

  return (
    <ApiContext.Provider value={ctx}>{props.children}</ApiContext.Provider>
  );
};

export default ApiProvider;

export const useApi = (): ApiContextReturn => useContext(ApiContext);
