import { wait } from "@/lib/utils";

/**
 * Mock submission endpoints. Each simulates latency and resolves without
 * sending data anywhere. Replace with real API calls (Route Handlers or
 * Server Actions) when a backend exists — callers only depend on the
 * `SubmissionResult` contract.
 */
export type SubmissionResult = { ok: true; demo: true } | { ok: false; reason: "not-connected" };

const LATENCY_MS = 900;

async function demoAccept(): Promise<SubmissionResult> {
  await wait(LATENCY_MS);
  return { ok: true, demo: true };
}

export const submitViewingRequest = (_payload: unknown) => demoAccept();
export const submitContactMessage = (_payload: unknown) => demoAccept();
export const submitListing = (_payload: unknown) => demoAccept();
export const saveAccountSettings = (_payload: unknown) => demoAccept();

/** Authentication is intentionally not simulated as successful. */
export async function authenticate(_payload: unknown): Promise<SubmissionResult> {
  await wait(LATENCY_MS);
  return { ok: false, reason: "not-connected" };
}
