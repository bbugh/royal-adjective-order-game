<script setup lang="ts">
import data from '@/data.json'
import { pickRandomElementsInOrder, pickRandomElement, shuffleArray } from '@/utils'

import WordBox from '@/components/WordBox.vue'
import { computed, ref } from 'vue'

// const difficulty = ref(3)

import { useGameStore } from '@/stores/game'

const store = useGameStore()
store.newGame()

// const allCategories = Object.keys(data.adjectives) as unknown as (keyof typeof data.adjectives)[]

// // randomInteger(1, categories.length)
// const adjectiveCategories = pickRandomElementsInOrder(allCategories, store.difficulty)
// const correctAdjectives = adjectiveCategories.map((category) =>
//   pickRandomElement(data.adjectives[category as keyof typeof data.adjectives])
// )

// const adjectives = ref(shuffleArray(correctAdjectives))

// function getNoun() {
//   return data.nouns[Math.floor(Math.random() * data.nouns.length)]
// }

// const noun = getNoun()

// const guessSlots = ref<string[]>(Array(adjectives.value.length).fill(''))

// const guessIsCorrect = computed(() => guessSlots.value.join('') === correctAdjectives.join(''))

function startDrag(evt: DragEvent, item: string) {
  if (!evt.dataTransfer) return

  console.log('dragging')

  event?.target?.classList.add('dragging')

  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('itemID', item)
}

function onDragEnd(evt: DragEvent) {
  console.log('drag end', evt?.dataTransfer?.dropEffect)
  event?.target?.classList.remove('dragging')

  if (evt?.dataTransfer?.dropEffect === 'move') {
    const itemID = evt.dataTransfer.getData('itemID')
    console.log('dragged move', itemID)

    // adjectives.value = adjectives.value.filter((adjective) => adjective !== itemID)

    // this.adjectives = this./adjectives.filter((adjective) => adjective !== itemID)

    // const item = this.items.find((item) => item.id == itemID)
    // item.list = list
  }
}

function onDrop(evt: DragEvent, index: number) {
  if (!evt.dataTransfer) return

  const itemID = evt.dataTransfer.getData('itemID')
  console.log('dropped', itemID, index)
  store.setGuessSlot(index, itemID)
  // guessSlots.value[index] = itemID
  // const item = this.items.find((item) => item.id == itemID)
  // item.list = list
}
// function onDrop(evt: DragEvent, list) {
//   const itemID = evt.dataTransfer.getData('itemID')
//   const item = this.items.find((item) => item.id == itemID)
//   item.list = list
// }

// function dragoverHandler(ev: DragEvent) {
//   ev.preventDefault()
//   console.log('dragging over')
//   if (!ev.dataTransfer) return
//   ev.dataTransfer.dropEffect = 'move'
// }
// function dropHandler(ev: DragEvent) {
//   ev.preventDefault()
//   console.log('dropped')
//   // Get the id of the target and add the moved element to the target's DOM
//   // const data = ev.dataTransfer?.getData("text/plain");
//   // if (!data) return;
//   // (ev.target).appendChild(document.getElementById(data));
// }

function selectDifficulty(evt: Event) {
  const target = evt.target as HTMLSelectElement
  store.difficulty = parseInt(target.value)
  store.newGame()
  // store.setDifficulty(parseInt(target.value))
  // difficulty.value = parseInt(target.value)
  // console.log('difficulty', difficulty.value)
}
</script>

<template>
  <main>
    <button @click="store.newGame" class="p-2 mb-5 text-white bg-blue-500 rounded">New Game</button>

    <div class="flex flex-col gap-3 mb-5">
      Difficulty: {{ store.difficulty }}
      <!-- <select v-model="store.difficulty"> -->
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
