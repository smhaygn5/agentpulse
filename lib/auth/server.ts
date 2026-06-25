import "server-only";
import { cookies } from "next/headers";
import {
  verifySessionToken,
  SESSION_COOKIE,
  type Session,
} from "@/lib/security/session";

/** Read & verify the current SIWE session from cookies (route handlers / RSC). */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
