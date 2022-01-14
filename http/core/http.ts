import 'isomorphic-fetch';

export type HttpContentType = 'application/json' | 'multipart/form-data';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** https://developer.mozilla.org/en-US/docs/Web/API/Body */
export type HttpResponseBodyMethod =
  | 'arrayBuffer'
  | 'blob'
  | 'formData'
  | 'json'
  | 'text';

/** The response from the rest API */
export interface Resp<T> {
  /** Http status code */
  status: number;
  /** Http ok status */
  ok: boolean;
  /** the response json body */
  data?: T;
  /** the error response, if any */
  error?: string;
}

export interface RequestOptions {
  /** the Http Method (GET,POST,PUT,DELETE) */
  method: HttpMethod;
  /** the rest api endpoint without the prefix forward slash (/) */
  endpoint: string;
  contentType?: HttpContentType;
  responseType?: HttpResponseBodyMethod;
  body?: any | null;
}

export type UploadMethod = Omit<HttpMethod, 'GET' | 'DELETE'>;

export interface UploadOptions {
  method?: UploadMethod;
  endpoint: string;
  body: FormData;
  progress?: (v: number) => void;
}

/**
 * The return params of http
 */
export interface HttpReturn {
  /** a function that can be used to fetch from the server */
  request: <T>(opts?: RequestOptions) => Promise<Resp<T>>;
  upload: <T>(opts?: UploadOptions) => Promise<Resp<T>>;
}

export interface HttpInitOptions {
  baseUrl: string;
  headers?: HeadersInit;
}

export const http = (initOptions: HttpInitOptions): HttpReturn => {
  const { baseUrl, headers } = initOptions;

  const request = async <T>(
    reqOptions: RequestOptions = {} as RequestOptions
  ): Promise<Resp<T>> => {
    const {
      body,
      contentType = 'application/json',
      method,
      endpoint,
      responseType = 'json'
    } = reqOptions;

    let theBody = body;

    // TODO: might need to test it for different use cases later
    // check if the content type is json
    if (contentType === 'application/json') {
      // if the body is not string e.g. a plain object, convert it to string
      const shouldStringify = !!theBody && typeof theBody !== 'string';
      if (shouldStringify) {
        theBody = JSON.stringify(body);
      }
    }

    // http request
    const req: RequestInit = {
      method,
      body: theBody,
      headers: { ...headers, ...{ 'Content-Type': contentType } }
    };

    const response: Response = await fetch(`${baseUrl}${endpoint}`, req);

    // TODO: partially done, e.g. need to handle different http status code from the backend...
    // e.g. callbacks when unauthorized, etc...
    const status = response.status;
    const ok = response.ok;

    let data: any;
    let dataTypeError: any;

    try {
      data = await response[responseType]();
    } catch (err) {
      dataTypeError = err;
    }

    return { status, ok, data, error: data?.error ?? dataTypeError };
  };

  const upload = async <T>(options: UploadOptions): Promise<Resp<T>> => {
    const { method, endpoint, body } = options;
    const url = `${baseUrl}${endpoint}`;

    const xhr = new XMLHttpRequest();

    xhr.open(method?.toString() ?? 'POST', url, true);

    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }

    return new Promise((resolve) => {
      xhr.upload.addEventListener('progress', (e) => {
        const percentage = (e.loaded * 100.0) / e.total || 100;
        options.progress?.(Math.round(percentage));
      });

      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          const status = xhr.status;
          const ok = status === 200;

          let json: any = undefined;

          try {
            json = JSON.parse(xhr.responseText);
          } catch (err) {
            json = err;
          }

          resolve({ status: status, ok, data: json, error: json?.error });
        }
      });

      xhr.send(body);
    });
  };

  return { request, upload };
};
