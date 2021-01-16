export interface ApiProblem {
  problem: string;
}

export interface CreatedApiProblem extends ApiProblem {
  id: string;
}

export const createProblem = async (
  data: ApiProblem,
): Promise<CreatedApiProblem> => {
  const response = await fetch("/.netlify/functions/problem-create", {
    body: JSON.stringify(data),
    method: "POST",
  });
  const responseData = await response.json();
  return { id: responseData["ref"]["@ref"]["id"], ...responseData["data"] };
};

export const readProblem = async (problemId: string): Promise<ApiProblem> => {
  const response = await fetch(`/.netlify/functions/problem-read/${problemId}`);
  const data: { data: ApiProblem } = await response.json();
  return data.data;
};
