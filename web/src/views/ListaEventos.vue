<script setup>
import { ref, onMounted } from 'vue';
import { api, formatarData } from '../api.js';

const eventos = ref([]);
const carregando = ref(true);
const erro = ref('');

onMounted(async () => {
  const r = await api.listar().catch(() => ({ ok: false }));
  if (r.ok) eventos.value = r.corpo.eventos;
  else erro.value = 'Não foi possível carregar os eventos.';
  carregando.value = false;
});
</script>

<template>
  <div class="d-flex align-center mb-4">
    <h1 class="text-h5 font-weight-bold" data-testid="titulo-lista">Eventos</h1>
    <v-spacer />
    <v-btn color="primary" to="/eventos/novo" data-testid="novo-evento">Novo evento</v-btn>
  </div>

  <v-alert v-if="erro" type="error" variant="tonal" data-testid="lista-erro">{{ erro }}</v-alert>
  <v-progress-linear v-else-if="carregando" indeterminate color="secondary" />
  <v-alert v-else-if="eventos.length === 0" type="info" variant="tonal" data-testid="lista-vazia">
    Nenhum evento cadastrado. Crie o primeiro em "Novo evento".
  </v-alert>
  <v-list v-else lines="two" data-testid="lista-eventos">
    <v-list-item
      v-for="e in eventos"
      :key="e.id"
      :to="`/eventos/${e.id}`"
      :data-testid="`evento-link-${e.id}`"
      :title="e.titulo"
      :subtitle="`${formatarData(e.data)} · ${e.local || 'Local a definir'} · ${e.inscritos}/${e.vagas} vagas`"
    />
  </v-list>
</template>
