import type { Problem, Problems } from "./models";
import { ProblemTokenType } from "./models";

export function completeAnswers(
  problems: Problems,
  answers: Map<number, string>,
): string {
  return problems
    .map((problem) => completeAnswer(problem, answers))
    .join("\n\n");
}

function completeAnswer(problem: Problem, answers: Map<number, string>) {
  const answerParts = problem.tokens.map((token) => {
    if (token.type === ProblemTokenType.Text) {
      return token.value;
    } else {
      return (answers.get(token.id) || "").trim();
    }
  });

  return `${problem.number}.\t${answerParts.join(" ")}`;
}
