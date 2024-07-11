<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col max-w-screen-md gap-3 mx-auto containxer">
    <h1 class="text-4xl font-bold">About this page</h1>
    <p>
      This is a simple game based on the
      <a class="underline" href="https://www.grammarly.com/blog/adjective-order/" target="_blank"
        >adjective order rules of English grammar
      </a>
      that come naturally to native English speakers but are a huge challenge for everyone else.
    </p>
    <p>
      Most native English speakers don't seem to be aware that these rules exist, but can sense when
      the words are in a &ldquo;weird&rdquo; order, e.g.:
      <i>big round blue ball</i> vs <i>round blue big ball</i>
    </p>
    <p>
      If you want to hold someone responsible for this, you can blame
      <!--
      determiner, quantity, opinion, size, age, shape, color, origin, qualifier
      -->
      the ample brilliant vast contemporary symmetrical opaque American biodegradable

      <a class="underline" target="_blank" href="https://brianbugh.me">Brian Bugh</a>.
    </p>
    <p>I hope you enjoy it, your highness!</p>
    <p>
      <RouterLink to="/" class="text-purple-500 underline">Back to the Game</RouterLink>
    </p>
  </div>
</template>
