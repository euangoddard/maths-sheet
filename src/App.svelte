<script lang="ts">
  import type { Problems } from "./models";
  import { createProblem, readProblem } from "./api";
  import Define from "./Define.svelte";
  import { parseProblemDef } from "./parse";
  import Solve from "./Solve.svelte";

  enum State {
    Loading,
    Defining,
    Solving,
  }
  let state = State.Loading;

  let problems: Problems;

  async function saveProblem(event) {
    const { problemDef } = event.detail;
    problems = event.detail["problems"];
    const response = await createProblem({ problem: problemDef });
    window.history.pushState(problemDef, undefined, `/p/${response.id}`);
    updateRouteState();
  }

  async function updateRouteState() {
    const match = window.location.pathname.match(/^\/p\/(\w+)$/);
    if (!problems && match) {
      state = State.Loading;
      const apiProblem = await readProblem(match[1]);
      const problemDef = apiProblem.problem;
      problems = parseProblemDef(problemDef);
      state = State.Solving;
    } else {
      state = match ? State.Solving : State.Defining;
    }
  }

  updateRouteState();
</script>

<svelte:window on:popstate="{updateRouteState}" />
<main>
  {#if state === State.Solving}
    <Solve problems="{problems}" />
  {:else if state === State.Defining}
    <Define on:save="{saveProblem}" />
  {:else if state === State.Loading}
    Loading&hellip;
  {/if}
</main>
