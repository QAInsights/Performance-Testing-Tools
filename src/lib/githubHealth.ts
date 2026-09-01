import githubHealthData from '../data/githubHealth.json';

export interface GithubHealthEntry {
  stars: number;
  lastPushedAt: string;
  archived: boolean;
  fetchedAt: string;
}

export interface GithubHealthDataset {
  generatedAt: string;
  entries: Record<string, GithubHealthEntry>;
}

const dataset = githubHealthData as GithubHealthDataset;

export const githubHealthGeneratedAt = dataset.generatedAt;

export const getGithubHealth = (slug: string): GithubHealthEntry | undefined =>
  dataset.entries[slug];
