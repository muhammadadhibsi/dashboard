import type { Paginated } from "@/types";

export const API_BASE_URL = "https://vocagame-mock-api.up.railway.app/api";

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(status: number, path: string) {
    super(
      status === 0
        ? `Network error while loading ${path}`
        : `Request to ${path} failed (${status})`,
    );
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}

type Params = Record<string, string | number | undefined>;

async function request(
  path: string,
  params: Params = {},
  signal?: AbortSignal,
) {
  const url = new URL(`${API_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new ApiError(0, path);
  }

  if (!response.ok) throw new ApiError(response.status, path);
  return response;
}

export async function getJson<T>(
  path: string,
  params?: Params,
  signal?: AbortSignal,
): Promise<T> {
  const response = await request(path, params, signal);
  return (await response.json()) as T;
}

/** List endpoints report the full row count in X-Total-Count. */
export async function getPage<T>(
  path: string,
  params: Params,
  signal?: AbortSignal,
): Promise<Paginated<T>> {
  const response = await request(path, params, signal);
  const data = (await response.json()) as T[];
  const header = response.headers.get("X-Total-Count");
  return { data, total: header === null ? data.length : Number(header) };
}
