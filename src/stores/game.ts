import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import data from '@/data.json'
import { pickRandomElementsInOrder, pickRandomElement, shuffleArray } from '@/utils'

const allCategories = Object.keys(data.adjectives) as unknown as (keyof typeof data.adjectives)[]

export const useGameStore = defineStore('game', () => {
  const difficulty = ref(3)

  const noun = ref('')
  const guessSlots = ref<string[]>([])
  const correctAdjectives = ref<string[]>([])

  const adjectiveCategories = ref<string[]>([])
  const adjectives = ref<string[]>([])

  const newGame = () => {
    // const categories = ref([])
    // categories.value = pickRandomElementsInOrder(allCategories, difficulty.value)

    adjectiveCategories.value = pickRandomElementsInOrder(allCategories, difficulty.value)
    correctAdjectives.value = adjectiveCategories.value.map((category) =>
      pickRandomElement(data.adjectives[category as keyof typeof data.adjectives])
    )

    adjectives.value = shuffleArray(correctAdjectives.value)

    noun.value = data.nouns[Math.floor(Math.random() * data.nouns.length)]

    guessSlots.value = Array(adjectives.value.length).fill('')
  }

  const guessIsCorrect = computed(() => guessSlots.value.join('') === correctAdjectives.value.join(''))

  const setGuessSlot = (index: number, value: string) => {
    guessSlots.value[index] = value
  }

  // const randomNoun

  // const count = ref(0)
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }

  return { difficulty, guessIsCorrect, noun,setGuessSlot, adjectives,adjectiveCategories,
    guessSlots, newGame,
    correctAdjectives }
})
