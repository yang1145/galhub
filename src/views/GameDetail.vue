<template>
  <GameDetail :game-id="id" />
</template>

<script setup>
import { defineProps } from 'vue';
import GameDetail from '../components/business/GameDetail.vue';

const props = defineProps(['id']);
</script>