export type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
};

export type GithubUser = {
  login: string;
  avatar_url: string;
  followers: number;
  public_repos: number;
  html_url: string;
};
