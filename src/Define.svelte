<script lang="ts">
  import { ParseError, parseProblemDef } from "./parse";
  import type { Problems } from "./models";
  import { ProblemTokenType } from "./models";
  import { createEventDispatcher } from "svelte";

  let problemDef: string =
    "1: 10 x ~ = 100\n\n2: 7 lots of ~ = 56\n~ multiplied by 8 = 56";
  let isValid = true;
  let errorMessage: string | null = null;
  let problems: Problems;

  $: {
    try {
      problems = parseProblemDef(problemDef);
      isValid = true;
      errorMessage = null;
    } catch (exc) {
      if (exc instanceof ParseError) {
        isValid = false;
        errorMessage = exc.message;
      } else {
        throw exc;
      }
    }
  }

  const dispatch = createEventDispatcher();
  const saveProblem = () => {
    dispatch("save", { problems, problemDef });
  };
</script>

<main>
  <h1>Enter problem</h1>
  <textarea bind:value="{problemDef}" class:invalid="{!isValid}"></textarea>
  <button type="button" disabled="{!isValid}" on:click="{saveProblem}"
    >Save</button
  >
  {#if !isValid}
    <span>{errorMessage}</span>
  {/if}

  <h2>Problem Preview</h2>
  {#if isValid}
    <form>
      {#each problems as problem, index}
        <fieldset>
          <legend>{problem.number}.</legend>
          <div>
            {#each problem.tokens as token}
              {#if token.type === ProblemTokenType.Field}
                <input type="text" readonly />
              {:else if token.type === ProblemTokenType.LineBreak}
                <br />
              {:else}
                <span>{token.value}</span>
              {/if}
            {/each}
          </div>
        </fieldset>
      {/each}
    </form>
  {:else}
    <p>Preview will appear when problem is valid</p>
  {/if}
</main>
