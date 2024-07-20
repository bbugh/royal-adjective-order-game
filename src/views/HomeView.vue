<script setup lang="ts">
import WordBox from "@/components/WordBox.vue";
import { difficultyLevels, useGameStore } from "@/stores/game";

const store = useGameStore();
store.newGame();

function startDrag(event: DragEvent, item: string) {
  if (!event.dataTransfer) return;

  if (!(event?.target instanceof HTMLElement)) {
    throw new Error("target is not HTMLElement");
  }

  event?.target?.classList.add("dragging");

  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemID", item);
}

function onDragEnd(event: DragEvent) {
  if (!(event?.target instanceof HTMLElement)) {
    throw new Error("target is not HTMLElement");
  }

  event?.target?.classList.remove("dragging");
}

function onDrop(event: DragEvent, index: number) {
  if (!event.dataTransfer) return;

  const itemID = event.dataTransfer.getData("itemID");
  store.setGuessSlot(index, itemID);
}

function onWordCountChange(evt: Event) {
  const target = evt.target as HTMLSelectElement;
  store.wordCount = parseInt(target.value);
  store.newGame();
}

function setNextGuessSlot(adjective: string) {
  const index = store.guessSlots.findIndex((slot) => slot === "");
  if (index !== -1) {
    store.setGuessSlot(index, adjective);
  }
}
</script>

<template>
  <main class="container mx-auto">
    <div class="p-4 mb-4 text-sm bg-gray-800">
      Put the adjectives in the
      <a
        href="https://www.grammarly.com/blog/adjective-order/"
        target="_blank"
        class="underline"
        >correct English order</a
      >. Click a word add it to the next empty slot, or drag a word to a
      specific slot. Click a word in the guess area to remove it and try again.
    </div>

    <div class="inline-flex flex-row items-center gap-4 mb-5 rounded">
      <button
        class="p-2 text-white bg-purple-700 rounded"
        @click="store.newGame"
      >
        👑 New Phrase
      </button>

      <div>
        <select
          v-model="store.difficultyLevel"
          class="px-2 py-1 text-black rounded"
        >
          <option v-for="(level, i) in difficultyLevels" :key="i" :value="i">
            Level {{ i }}
          </option>
          <option :value="-1">Custom</option>
        </select>
      </div>

      <div v-if="store.isCustomDifficulty">
        Word count:
        <select
          class="px-2 py-1 text-black rounded"
          @change="onWordCountChange($event)"
        >
          <option v-for="n in 8" :key="n" :selected="store.wordCount == n + 1">
            {{ n + 1 }}
          </option>
        </select>
      </div>
      <div v-else>Word count: {{ store.wordCount }}</div>

      <div v-if="store.isCustomDifficulty">
        <input
          id="showHints"
          v-model="store.showHints"
          class="mr-1"
          type="checkbox"
          name="showHints"
        />
        <label
          for="showHints"
          title="Show the correct adjective category under each guess slot."
        >
          Show hints ℹ️
        </label>
      </div>
      <div v-else>{{ store.showHints ? "Showing Hints" : "No Hints" }}</div>

      <div v-if="store.isCustomDifficulty">
        <input
          id="showSuccess"
          v-model="store.showSuccess"
          class="mr-1"
          type="checkbox"
          name="showSuccess"
        />
        <label
          for="showSuccess"
          title="Highlight correct guesses in green, incorrect in red"
        >
          Highlight Matches ℹ️
        </label>
      </div>
      <div v-else>
        {{ store.showSuccess ? "Showing Matches" : "No Matches" }}
      </div>
    </div>

    <div class="mb-4 text-2xl">
      <WordBox
        v-for="adjective in store.adjectives"
        :key="adjective"
        :class="[
          'me-2',
          store.guessSlots.includes(adjective) ? 'invisible' : '',
        ]"
        draggable="true"
        @dragstart="startDrag($event, adjective)"
        @dragend="onDragEnd"
        @click="setNextGuessSlot(adjective)"
      >
        {{ adjective }}
      </WordBox>
    </div>
    <div class="flex flex-wrap items-center gap-4 text-2xl">
      <div
        v-for="(guess, i) in store.guessSlots"
        :key="i"
        @drop="onDrop($event, i)"
        @dragover.prevent
        @dragenter.prevent
        @click="store.clearGuessSlot(i)"
      >
        <div
          :class="[
            'text-center border-b-2 border-gray-300 draggable-destination min-w-36',
            store.showSuccess && store.hasGuessSlot(i)
              ? store.isGuessSlotCorrect(i)
                ? 'bg-green-800'
                : 'bg-red-800'
              : 'bg-gray-800',
          ]"
        >
          <template v-if="guess">
            {{ guess }}
          </template>
          <template v-else>&nbsp;</template>
        </div>
        <div v-if="store.showHints" class="text-sm text-center text-gray-500">
          {{ store.adjectiveCategories[i] }}
        </div>
      </div>

      <div>
        {{ store.noun }}
        <div v-if="store.showHints" class="text-sm">&nbsp;</div>
      </div>
    </div>

    <div v-if="store.allGuessesSelected" class="mt-5">
      <div v-if="!store.guessIsCorrect" class="text-red-500">
        Incorrect!
        <span
          v-if="store.wordCount < 7 && !store.showHints && !store.showSuccess"
        >
          The correct order is:
          <span v-for="(adj, i) in store.adjectiveCategories" :key="i">
            {{ adj }}{{ i < store.correctAdjectives.length - 1 ? ", " : "" }}
          </span>
        </span>
      </div>

      <div v-else class="text-green-500">
        {{ store.guessIsCorrect ? "Very good, your highness!" : "Incorrect" }}

        <span v-if="store.isHighestDifficulty">
          You won on the maximum difficulty level! 🎉 You're a real royal
          wordsmith!
        </span>

        <div class="mt-4">
          <span>
            <button
              v-if="store.guessIsCorrect"
              class="p-2 text-white bg-purple-700 rounded"
              @click="store.newGame"
            >
              👑 Play
              <span v-if="!store.isCustomDifficulty"
                >level {{ store.difficultyLevel }}</span
              >
              again
            </button>
          </span>

          <span v-if="!store.isHighestDifficulty">
            or
            <button
              v-if="store.guessIsCorrect"
              class="p-2 text-white bg-red-700 rounded"
              @click="store.increaseDifficultyLevel()"
            >
              💀 Try level {{ store.difficultyLevel + 1 }}
            </button>
          </span>
        </div>
      </div>
    </div>
  </main>
</template>
