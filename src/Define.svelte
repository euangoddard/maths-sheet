<style>
  .relative {
    position: relative;
  }
  .help-button {
    appearance: none;
    background-color: #333;
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
    color: #f4f4f4;
    border-radius: 50%;
    padding: 0;
    position: absolute;
    top: 0;
    right: 0;
  }

  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
      monospace;
    display: inline-block;
    border: 1px solid var(--heading-color);
    color: var(--heading-color);
    background-color: var(--invalid-color);
    padding: 0 0.25rem;
  }
</style>

<script lang="ts">
  import { ParseError, parseProblemDef } from "./parse";
  import type { Problems } from "./models";
  import { ProblemTokenType } from "./models";
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";

  let problemDef: string =
    "1: 10 x ~ = 100\n\n2: 7 lots of ~ = 56\n~ multiplied by 8 = 56";
  let isValid = true;
  let errorMessage: string | null = null;
  let problems: Problems;

  let isHelpOpen = false;

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

  const toggleHelp = () => {
    isHelpOpen = !isHelpOpen;
  };
</script>

<main>
  <h1 class="relative">
    Enter problem <button
      class="help-button"
      type="button"
      on:click="{toggleHelp}">?</button
    >
  </h1>
  {#if isHelpOpen}
    <p transition:slide>
      <small class="help"
        >To denote an answer box use a <code>~</code>. Leave a blank line
        between each question.</small
      >
    </p>
  {/if}
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
