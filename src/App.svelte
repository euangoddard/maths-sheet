
<script lang="ts">
  import type { Problems } from "./models";
  import { createProblem, readProblem } from "./api";
  import Define from "./Define.svelte";
  import { parseProblem } from "./parse";
  import Solve from "./Solve.svelte";

  let isSolving = false;

  let problems: Problems;

  async function saveProblem(event) {
    const { problemDef } = event.detail;
    problems = event.detail["problems"];
    const response = await createProblem({ problem: problemDef });
    window.history.pushState(problemDef, "Solve problem", `/p/${response.id}`);
    updateRouteState();
  }

  async function updateRouteState() {
    const match = window.location.pathname.match(/^\/p\/(\w+)$/);
    if (!problems && match) {
      const apiProblem = await readProblem(match[1]);
      const problemDef = apiProblem.problem;
      problems = parseProblem(problemDef);
      isSolving = true;
    } else {
      isSolving = !!match;
    }
  }

  updateRouteState();
</script>

<svelte:window on:popstate="{updateRouteState}" />
<main>
  {#if isSolving}
    <Solve problems="{problems}" />
  {:else}
    <Define on:save="{saveProblem}" />
  {/if}
</main>
