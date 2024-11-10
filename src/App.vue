<template>
  <div class="flex justify-center font-nunito text-slate-800">
    
    <div class="h-screen w-full p-5 md:w-2/3"><RouterView /></div>
    
    <Transition name="slide-right">
      <div v-if="shouldAnimate" class="fixed -right-64 -top-12 -z-10 size-96 rounded-full bg-primary/20" />
    </Transition>
    
    <Transition name="slide-left">
      <div v-if="shouldAnimate" class="fixed -bottom-24 -left-36 -z-10 size-96 rounded-full bg-secondary/20" />
    </Transition>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
const shouldAnimate = ref(false);

onMounted(() => {
  shouldAnimate.value = true;
});
</script>

<style>
/* slide in from right */
.slide-right-enter-active {
  transition: all 0.8s ease-in;
}
.slide-right-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

/* slide-in from left */
.slide-left-enter-active {
  transition: all 0.8s ease-in;
}
.slide-left-enter-from {
  transform: translateX(-100px);
  opacity: 0;
}
</style>
