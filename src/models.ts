export enum ProblemTokenType {
  Field,
  Text,
}

export interface ProblemToken {
  id: number;
  type: ProblemTokenType;
  value?: string;
}

export interface Problem {
  number: string;
  tokens: readonly ProblemToken[];
}

export type Problems = readonly Problem[];
