<script setup lang="ts">
import WordBox from '@/components/WordBox.vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
store.newGame()

function startDrag(event: DragEvent, item: string) {
  if (!event.dataTransfer) return

  console.log('dragging')

  if (!(event?.target instanceof HTMLElement)) {
    throw new Error('target is not HTMLElement')
  }

  event?.target?.classList.add('dragging')

  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('itemID', item)
}

function onDragEnd(event: DragEvent) {
  console.log('drag end', event?.dataTransfer?.dropEffect)
  if (!(event?.target instanceof HTMLElement)) {
    throw new Error('target is not HTMLElement')
  }

  event?.target?.classList.remove('dragging')

  if (event?.dataTransfer?.dropEffect === 'move') {
    const itemID = event.dataTransfer.getData('itemID')
    console.log('dragged move', itemID)
  }
}

function onDrop(event: DragEvent, index: number) {
  if (!event.dataTransfer) return

  const itemID = event.dataTransfer.getData('itemID')
  console.log('dropped', itemID, index)
  store.setGuessSlot(index, itemID)
}

function selectDifficulty(evt: Event) {
  const target = evt.target as HTMLSelectElement
  store.difficulty = parseInt(target.value)
  store.newGame()
}
</script>

<template>
  <main class="container p-5 mx-auto">
    <button class="p-2 mb-5 text-white bg-blue-500 rounded" @click="store.newGame">New Game</button>

    <div class="inline-flex flex-row gap-3 px-3 py-1 mb-5 rounded xxborder xxborder-gray-300">
      <div>
        Word count:
        <select class="px-2 py-1 text-black rounded" @change="selectDifficulty($event)">
          <option v-for="n in 8" :key="n" :selected="store.difficulty == n + 1">{{ n + 1 }}</option>
        </select>
      </div>

      <div>
        <input
          id="showHints"
          v-model="store.showHints"
          class="mr-1"
          type="checkbox"
          name="showHints"
        />
        <label for="showHints">Show hints</label>
      </div>
    </div>

    <!-- <div class="flex flex-col gap-3 mb-5">
      <div>adjectiveCategories: {{ store.adjectiveCategories }}</div>
      <div>guessSlots: {{ store.guessSlots }}</div>

      <div>correctAdjectives: {{ store.correctAdjectives }}</div>
      <div>adjectives: {{ store.adjectives }}</div>
    </div> -->

    <div class="mb-4 text-2xl">
      <WordBox
        v-for="adjective in store.adjectives"
        :key="adjective"
        :class="['me-2', store.guessSlots.includes(adjective) ? 'invisible' : '']"
        draggable="true"
        @dragstart="startDrag($event, adjective)"
        @dragend="onDragEnd"
      >
        {{ adjective }}
      </WordBox>
    </div>
    <div class="flex items-center gap-4 text-2xl">
      <div
        v-for="(guess, i) in store.guessSlots"
        :key="i"
        @drop="onDrop($event, i)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div
          class="text-center bg-gray-800 border-b-2 border-gray-300 draggable-destination min-w-36"
        >
          <div v-if="guess">
            {{ guess || '&nbsp;' }}
          </div>
          <div v-else>&nbsp;</div>
        </div>
        <div v-if="store.showHints" class="text-sm text-center text-gray-500">
          {{ store.adjectiveCategories[i] }}
        </div>
      </div>

      {{ store.pluralNoun }}
    </div>

    <div
      v-if="store.allGuessesSelected"
      :class="['mt-5', store.guessIsCorrect ? 'text-green-500' : 'text-red-500']"
    >
      {{ store.guessIsCorrect ? 'Correct!' : 'Incorrect' }}
      <button v-if="store.guessIsCorrect" class="underline" @click="store.newGame">
        Play again
      </button>
    </div>
  </main>
</template>
