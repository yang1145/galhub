<template>
  <GameDetail :game-id="id" />
</template>

<script setup>
import { defineProps } from 'vue';
import GameDetail from '../components/GameDetail.vue';

const props = defineProps(['id']);
</script>