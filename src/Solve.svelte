<script lang="ts">
  import type { Problems, ProblemToken } from "./models";
  import { ProblemTokenType } from "./models";
  import { completeAnswers } from "./answer";

  export let problems: Problems;
  let answers = new Map<number, string>();

  const storeAnswer = (token: ProblemToken) => ({ target }) => {
    answers.set(token.id, target.value);
  };

  async function copyAnswers(): Promise<void> {
    await navigator.clipboard.writeText(completeAnswers(problems, answers));
    alert("Answers copied to the clipboard!");
  }
</script>

<main>
  <h1>Solve the problems</h1>
  <form>
    {#each problems as problem, index}
      <fieldset>
        <legend>{problem.number}</legend>
        <div>
          {#each problem.tokens as token}
            {#if token.type === ProblemTokenType.Field}
              <input type="text" on:input="{storeAnswer(token)}" />
            {:else}
              <span>{token.value}</span>
            {/if}
          {/each}
        </div>
      </fieldset>
    {/each}
  </form>
  <button type="button" on:click="{copyAnswers}">Copy answers</button>
</main>
