// Mock API client. Swap `MOCK` for real fetch() calls to the FastAPI backend later.
// All services return Promises so components already work with async data.

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export function mockRequest<T>(data: T, delay = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// Example of the future real implementation:
// export async function apiGet<T>(path: string): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, { credentials: "include" });
//   if (!res.ok) throw new Error(res.statusText);
//   return res.json() as Promise<T>;
// }
