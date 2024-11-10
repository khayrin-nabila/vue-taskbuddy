<template>
  <div class="flex items-center justify-between">
    
    <h1
      class="flex items-center justify-center bg-gradient-to-br from-primary from-45% to-secondary bg-clip-text text-center text-3xl font-semibold text-transparent"
    >
      TaskBuddy
    </h1>
    
    <div class="flex gap-3">
    
      <RouterLink to="/info">
        <InformationCircleIcon class="size-6 text-primary hover:text-secondary xl:size-8" />
      </RouterLink>
    
      <RouterLink to="/">
        <ArrowLeftStartOnRectangleIcon class="size-6 text-primary hover:text-secondary xl:size-8" />
      </RouterLink>

    </div>

  </div>
</template>

<script setup>

import { ArrowLeftStartOnRectangleIcon, InformationCircleIcon } from "@heroicons/vue/24/solid";
import { RouterLink } from "vue-router";

</script>
