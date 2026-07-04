import { useEffect, useState } from "react";
import type { GithubRepo, GithubUser } from "@/types/github";
import { contact } from "@/data/socials";

type GithubState = {
  user: GithubUser | null;
  repos: GithubRepo[];
  loading: boolean;
  error: string | null;
};

const CACHE_KEY = "gh-cache-v1";
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export function useGithub() {
  const [state, setState] = useState<GithubState>({
    user: null,
    repos: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as {
            ts: number;
            user: GithubUser;
            repos: GithubRepo[];
          };
          if (Date.now() - cached.ts < CACHE_TTL_MS) {
            if (!cancelled) {
              setState({ user: cached.user, repos: cached.repos, loading: false, error: null });
            }
            return;
          }
        }

        const username = contact.githubUsername;
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          throw new Error("GitHub API request failed");
        }

        const user = (await userRes.json()) as GithubUser;
        const allRepos = (await reposRes.json()) as GithubRepo[];
        const repos = allRepos.filter((r) => !r.fork).slice(0, 6);

        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), user, repos }));

        if (!cancelled) {
          setState({ user, repos, loading: false, error: null });
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false, error: "Unable to load GitHub data" }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
