export type IssueCardColumn = 'OPEN' | 'PROGRESS' | 'REVIEW';

export type IssueCard = {
  id: number;
  title: string;
  state: 'open' | 'closed';
  column: IssueCardColumn;
  labels: string[];
  assignees: string[];
  updatedAt: string;
  url: string;
};

export type IssueFeedOptions = {
  owner: string;
  repo: string;
  pollIntervalMs?: number;
  token?: string;
  perPage?: number;
  includeClosed?: boolean;
  onUpdate?: (issues: IssueCard[]) => void;
  onError?: (error: Error) => void;
};
