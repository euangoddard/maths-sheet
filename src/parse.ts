import type { Problem, Problems, ProblemToken } from "./models";
import { ProblemTokenType } from "./models";

let _nextId = 0;
const nextId = () => ++_nextId;

export function parseProblem(problem: string): Problems {
  return problem.split("\n").map(parseProblemLine);
}

function parseProblemLine(problemLine: string, index: number): Problem {
  const [questionNumber, ...rest] = problemLine.trim().split(":");
  if (!rest.length) {
    throw new ParseError(`Problem on line ${index + 1} does not contain :`);
  }

  const tokens: ProblemToken[] = [];
  const problemRaw = rest.join(":").trim();
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

  return {
    number: questionNumber.trim(),
    tokens,
  };
}

export class ParseError extends Error {}
