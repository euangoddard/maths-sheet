import type { Problem, Problems, ProblemToken } from "./models";
import { ProblemTokenType } from "./models";

let _nextId = 0;
const nextId = () => ++_nextId;

export function parseProblemDef(problemsDef: string): Problems {
  return problemsDef.split("\n\n").map(parseProblemLine);
}

function parseProblemLine(problemDef: string, index: number): Problem {
  const [questionNumber, ...rest] = problemDef.trim().split(":");
  if (!rest.length) {
    throw new ParseError(`Problem ${index + 1} does not contain :`);
  }

  const problemRaw = rest.join(":").trim();
  const problemLines = problemRaw.split("\n");
  const tokens: ProblemToken[] = [];
  for (let index = 0; index < problemLines.length; index += 1) {
    const lineTokens = tokenizeProblem(problemLines[index]);
    tokens.push(...lineTokens);
    if (index < problemLines.length - 1) {
      tokens.push({ type: ProblemTokenType.LineBreak, id: -1, value: "\n" });
    }
  }
  return {
    number: questionNumber.trim(),
    tokens,
  };
}

function tokenizeProblem(problemRaw: string): readonly ProblemToken[] {
  const tokens: ProblemToken[] = [];
  if (problemRaw.slice(0, 1) === "~") {
    tokens.push({
      type: ProblemTokenType.Field,
      id: nextId(),
    });
  }
  const parts = problemRaw.split("~");
  const partsCount = parts.length;

  parts.forEach((part: string, index: number) => {
    let partTrimmed = part.trim();
    if (partTrimmed.length) {
      tokens.push({
        type: ProblemTokenType.Text,
        value: partTrimmed,
        id: nextId(),
      });

      if (index < partsCount - 1) {
        tokens.push({
          type: ProblemTokenType.Field,
          id: nextId(),
        });
      }
    }
  });
  return tokens;
}

export class ParseError extends Error {}
