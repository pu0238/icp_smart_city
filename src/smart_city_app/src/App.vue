<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import BlockchainSync from "./components/BlockchainSync.vue";
</script>

<template>
    <Suspense>
      <BlockchainSync />
    </Suspense>
</template>
