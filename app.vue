<template>
  <div>
    <div v-if="token" style="display: flex">
      <div
        v-for="(color, index) in ['red', 'blue', 'blueviolet']"
        :style="{ color }"
      >
        <span v-if="index > 0">.</span>{{ xxx[index] }}
      </div>
    </div>
    <div v-else>未登录</div>
  </div>
  <br>
  <div>
    <pre>{{ parse(xxx[0]) }}</pre>
    <pre>{{ parse(xxx[1]) }}</pre>
  </div>
</template>

<script setup lang="ts">
const token = useCookie("Authorization");
const xxx = computed(() => {
  if (token.value) {
    return token.value.split(".");
  }
  return [];
});

const parse = (str: string) => {
  return JSON.parse(atob(str));
};
</script>
