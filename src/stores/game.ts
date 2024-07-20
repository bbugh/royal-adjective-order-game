import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

import data from "@/data.json";
import { pickRandomElementsInOrder, pickRandomElement, shuffleArray } from "@/utils";

const allCategories = Object.keys(data.adjectives) as unknown as (keyof typeof data.adjectives)[];

export const difficultyLevels = [
  { words: 2, hints: true, matches: true },
  { words: 3, hints: true, matches: true },

  { words: 4, hints: true, matches: true },
  { words: 4, hints: false, matches: true },
  { words: 4, hints: false, matches: false },

  { words: 5, hints: true, matches: true },
  { words: 5, hints: false, matches: true },
  { words: 5, hints: false, matches: false },

  { words: 6, hints: true, matches: true },
  { words: 6, hints: false, matches: true },
  { words: 6, hints: false, matches: false },

  { words: 7, hints: false, matches: false },
  { words: 8, hints: false, matches: false },
  { words: 9, hints: false, matches: false },
];

export const useGameStore = defineStore("game", () => {
  const showHints = ref(true);
  const showSuccess = ref(true);
  const wordCount = ref(3);
  const difficultyLevel = ref<number>(1);

  const noun = ref("");
  const guessSlots = ref<string[]>([]);
  const correctAdjectives = ref<string[]>([]);

  const adjectiveCategories = ref<string[]>([]);
  const adjectives = ref<string[]>([]);

  const isCustomDifficulty = computed(() => difficultyLevel.value === -1);
  const isHighestDifficulty = computed(() => wordCount.value === 9 && !showHints.value && !showSuccess.value);

  const newGame = () => {
    // const categories = ref([])
    // categories.value = pickRandomElementsInOrder(allCategories, difficulty.value)

    adjectiveCategories.value = pickRandomElementsInOrder(allCategories, wordCount.value);
    correctAdjectives.value = adjectiveCategories.value.map((category) =>
      pickRandomElement(data.adjectives[category as keyof typeof data.adjectives]),
    );

    adjectives.value = shuffleArray(correctAdjectives.value);

    noun.value = data.nouns[Math.floor(Math.random() * data.nouns.length)];

    guessSlots.value = Array(adjectives.value.length).fill("");
  };

  watch(difficultyLevel, (value, oldValue) => {
    if (value === oldValue) return;

    if (value !== -1) {
      wordCount.value = difficultyLevels[difficultyLevel.value].words;
      showHints.value = difficultyLevels[difficultyLevel.value].hints;
      showSuccess.value = difficultyLevels[difficultyLevel.value].matches;
      newGame();
    }
  });

  const increaseDifficultyLevel = () => {
    difficultyLevel.value = Math.min(difficultyLevel.value + 1, difficultyLevels.length - 1);
  }

  const guessIsCorrect = computed(() => guessSlots.value.join("") === correctAdjectives.value.join(""));

  const hasGuessSlot = (index: number) => guessSlots.value[index] !== "";
  const setGuessSlot = (index: number, value: string) => {
    guessSlots.value[index] = value;
  };

  const clearGuessSlot = (index: number) => {
    guessSlots.value[index] = "";
  };
  const isGuessSlotCorrect = (index: number) => guessSlots.value[index] === correctAdjectives.value[index];

  const allGuessesSelected = computed(() => guessSlots.value.every((guess) => guess !== ""));

  const pluralNoun = computed(() => noun.value + "s");

  return {
    wordCount,
    isGuessSlotCorrect,
    guessIsCorrect,
    noun,
    setGuessSlot,
    adjectives,
    adjectiveCategories,
    showHints,
    allGuessesSelected,
    guessSlots,
    newGame,
    pluralNoun,
    correctAdjectives,
    clearGuessSlot,
    showSuccess,
    hasGuessSlot,
    isHighestDifficulty,
    isCustomDifficulty,
    increaseDifficultyLevel,
    difficultyLevel
  };
});
