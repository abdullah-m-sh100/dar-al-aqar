import "server-only";

import { projects } from "@/data/projects";

import type { Project } from "../types";

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return projects.find((project) => project.slug === slug);
}
