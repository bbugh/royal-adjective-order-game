<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="container flex items-center justify-between py-2 mx-auto">
    <h1 class="mb-5 text-4xl font-bold">👑 Royal Order of Adjectives 👑</h1>
    <nav class="flex flex-row gap-3">
      <RouterLink to="/">Game</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
