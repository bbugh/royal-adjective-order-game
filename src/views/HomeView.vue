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
  <main>
    <button @click="store.newGame" class="p-2 mb-5 text-white bg-blue-500 rounded">New Game</button>

    <div class="flex flex-col gap-3 mb-5">
      Difficulty: {{ store.difficulty }}
      <select @change="selectDifficulty($event)">
        <option v-for="n in 8" :key="n" :selected="store.difficulty == n + 1">{{ n + 1 }}</option>
      </select>
    </div>

    <div class="flex flex-col gap-3 mb-5">
      <div>adjectiveCategories: {{ store.adjectiveCategories }}</div>
      <div>guessSlots: {{ store.guessSlots }}</div>

      <div>correctAdjectives: {{ store.correctAdjectives }}</div>
      <div>adjectives: {{ store.adjectives }}</div>
    </div>

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
    <div class="flex items-center gap-2 text-2xl">
      <div
        v-for="(guess, i) in store.guessSlots"
        :key="i"
        class="text-center bg-gray-300 rounded draggable-destination min-w-16"
        @drop="onDrop($event, i)"
        @dragover.prevent
        @dragenter.prevent
      >
        <WordBox v-if="guess">
          <!-- @dragover="dragoverHandler" -->
          {{ guess || '&nbsp;' }}
        </WordBox>
        <div v-else>&nbsp;</div>
      </div>

      {{ store.noun }}
    </div>

    <div :class="['mt-5', store.guessIsCorrect ? 'text-green-500' : 'text-red-500']">
      {{ store.guessIsCorrect ? 'Correct!' : 'Incorrect' }}
    </div>
  </main>
</template>
