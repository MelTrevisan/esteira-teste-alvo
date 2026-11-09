<script setup>
// O Vuetify põe atributos data-* no contêiner do campo, não no <input>. As jornadas precisam do
// data-testid no próprio elemento digitável, então ele é aplicado aqui depois da montagem.
import { ref, onMounted } from 'vue';

const props = defineProps({
  testid: { type: String, required: true },
  area: { type: Boolean, default: false },
});
const model = defineModel({ type: String, default: '' });
const raiz = ref(null);

onMounted(() => {
  const el = raiz.value?.$el?.querySelector('input, textarea');
  if (el) el.setAttribute('data-testid', props.testid);
});
</script>

<template>
  <component :is="area ? 'v-textarea' : 'v-text-field'" ref="raiz" v-model="model" />
</template>
