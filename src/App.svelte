<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    margin: 0 0 0.5rem;
  }

  textarea {
    width: 100%;
    height: 10rem;
    resize: vertical;
  }

  .invalid {
    background-color: #fed8cc;
  }

  fieldset {
    border: none;
    margin-bottom: 1rem;
  }

  legend {
    font-weight: 200;
    font-size: 1.5rem;
  }

  input {
    width: 5rem;
    margin: 0 0.25rem;
  }

  input:first-child {
    margin-left: 0;
  }

  input:last-child {
    margin-right: 0;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<script lang="ts">
  import { ParseError, parseProblem } from "./parse";
  import type { Problems, ProblemToken } from "./models";
  import { ProblemTokenType } from "./models";
  import { completeAnswers } from "./answer";

  enum State {
    Composing,
    Solving,
  }
  let state: State = State.Composing;

  let problemDef: string = "1a: ~ x ~ = ~";
  let problems: Problems;
  let isValid = true;
  let errorMessage: string | null = null;
  let answers = new Map<number, string>();
  $: {
    answers = new Map<number, string>();
    try {
      problems = parseProblem(problemDef);
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

  function startSolving(): void {
    if (isValid) {
      state = State.Solving;
    }
  }

  function storeAnswer(token: ProblemToken) {
    return ({ target }) => {
      answers.set(token.id, target.value);
    };
  }

  async function copyAnswers(): Promise<void> {
    await navigator.clipboard.writeText(completeAnswers(problems, answers));
    alert("Answers copied to the clipboard!");
  }
</script>

<main>
  {#if state === State.Composing}
    <h1>Enter problem</h1>
    <textarea bind:value="{problemDef}" class:invalid="{!isValid}"></textarea>
    <button type="button" disabled="{!isValid}" on:click="{startSolving}"
      >Solve!</button
    >
    {#if !isValid}
      <span>{errorMessage}</span>
    {/if}
  {:else}
    <h1>Solve the problem</h1>
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
  {/if}
</main>
