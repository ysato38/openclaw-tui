import { IssueCard, IssueCardColumn, IssueFeedOptions } from '../../types/feeds.js';

export const mapIssueColumn = (labels: string[]): IssueCardColumn => {
  const lower = labels.map((l) => l.toLowerCase());
  if (lower.includes('status:review')) return 'REVIEW';
  if (lower.includes('status:in-progress')) return 'PROGRESS';
  return 'OPEN';
};

type GitHubIssue = {
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  updated_at: string;
  labels: Array<{ name?: string } | string>;
  assignees?: Array<{ login?: string }>;
  pull_request?: unknown;
};

const toLabelName = (label: GitHubIssue['labels'][number]): string => {
  if (typeof label === 'string') return label;
  return label.name ?? '';
};

export const normalizeIssue = (issue: GitHubIssue): IssueCard => {
  const labels = issue.labels.map(toLabelName).filter(Boolean);
  return {
    id: issue.number,
    title: issue.title,
    column: mapIssueColumn(labels),
    state: issue.state,
    labels,
    assignees: (issue.assignees ?? []).map((a) => a.login ?? '').filter(Boolean),
    updatedAt: issue.updated_at,
    url: issue.html_url
  };
};

export const fetchIssues = async (opts: Omit<IssueFeedOptions, 'onUpdate' | 'onError' | 'pollIntervalMs'>): Promise<IssueCard[]> => {
  const state = opts.includeClosed ? 'all' : 'open';
  const perPage = opts.perPage ?? 50;
  const token = opts.token ?? process.env.GITHUB_TOKEN;

  const params = new URLSearchParams({
    state,
    sort: 'updated',
    direction: 'desc',
    per_page: String(perPage)
  });

  const url = `https://api.github.com/repos/${opts.owner}/${opts.repo}/issues?${params.toString()}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'openclaw-tui/0.1'
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub Issues API failed (${res.status} ${res.statusText}) ${body.slice(0, 240)}`);
  }

  const json = (await res.json()) as GitHubIssue[];
  return json
    .filter((i) => !i.pull_request)
    .map(normalizeIssue);
};

export const createIssueFeed = (opts: IssueFeedOptions) => {
  let timer: NodeJS.Timeout | null = null;
  let inFlight = false;

  const refresh = async (): Promise<IssueCard[]> => {
    if (inFlight) return [];
    inFlight = true;
    try {
      const items = await fetchIssues(opts);
      opts.onUpdate?.(items);
      return items;
    } catch (error) {
      opts.onError?.(error instanceof Error ? error : new Error(String(error)));
      return [];
    } finally {
      inFlight = false;
    }
  };

  const start = () => {
    if (timer) return;
    void refresh();
    timer = setInterval(() => {
      void refresh();
    }, opts.pollIntervalMs ?? 10_000);
  };

  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  return { start, stop, refresh };
};
