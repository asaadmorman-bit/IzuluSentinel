import { base44 } from "@/api/base44Client";

/**
 * Call the ACHE compliance endpoint via the secure proxy backend function.
 *
 * @param {string} path    - API path relative to ACHE_ENDPOINT_URL (e.g. "/audit/status")
 * @param {string} method  - HTTP method (default: "GET")
 * @param {object} payload - Request body for POST/PUT requests
 * @returns {Promise<any>} - Parsed response data from ACHE
 */
export async function callAche(path = "", method = "GET", payload = null) {
  const res = await base44.functions.invoke("proxyAche", { path, method, payload });
  return res.data?.data ?? res.data;
}