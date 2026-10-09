import "server-only";

import { agents } from "@/data/agents";

import type { Agent } from "../types";

export async function getAgents(): Promise<Agent[]> {
  return agents;
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  return agents.find((agent) => agent.id === id);
}
