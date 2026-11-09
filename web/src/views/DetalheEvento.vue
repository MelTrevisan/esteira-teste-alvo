<script setup>
import Campo from '../components/Campo.vue';
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api, formatarData } from '../api.js';

const props = defineProps({ id: { type: String, required: true } });
const route = useRoute();
const evento = ref(null);
const inscricoes = ref([]);
const carregando = ref(true);
const naoEncontrado = ref(false);
const criado = ref(route.query.criado === '1');

const form = reactive({ nome: '', email: '' });
const erros = ref({});
const sucesso = ref('');
const falha = ref('');
const enviando = ref(false);

async function carregar() {
  const r = await api.buscar(props.id).catch(() => ({ ok: false, status: 0, corpo: {} }));
  if (r.ok) {
    evento.value = r.corpo.evento;
    inscricoes.value = r.corpo.inscricoes;
  } else if (r.status === 404) {
    naoEncontrado.value = true;
  } else {
    falha.value = 'Não foi possível carregar o evento.';
  }
  carregando.value = false;
}
onMounted(carregar);

async function inscrever() {
  erros.value = {};
  sucesso.value = '';
  falha.value = '';
  criado.value = false;
  enviando.value = true;
  const r = await api
    .inscrever(props.id, { ...form })
    .catch(() => ({ ok: false, status: 0, corpo: {} }));
  enviando.value = false;
  if (r.ok) {
    sucesso.value = 'Inscrição confirmada.';
    form.nome = '';
    form.email = '';
    await carregar();
  } else if (r.status === 422) {
    erros.value = r.corpo.errors;
  } else {
    falha.value = r.corpo.error || 'Não foi possível concluir a inscrição.';
  }
}
</script>

<template>
  <v-progress-linear v-if="carregando" indeterminate color="secondary" />
  <v-alert v-else-if="naoEncontrado" type="warning" variant="tonal" data-testid="evento-nao-encontrado">
    Evento não encontrado.
  </v-alert>
  <template v-else-if="evento">
    <v-alert v-if="criado" type="success" variant="tonal" class="mb-4" data-testid="mensagem-sucesso">
      Evento criado com sucesso.
    </v-alert>
    <h1 class="text-h5 font-weight-bold" data-testid="evento-titulo">{{ evento.titulo }}</h1>
    <p class="text-medium-emphasis mb-1" data-testid="evento-data">{{ formatarData(evento.data) }}</p>
    <p class="mb-1" data-testid="evento-local">{{ evento.local || 'Local a definir' }}</p>
    <p class="mb-4" data-testid="evento-vagas">{{ evento.inscritos }} de {{ evento.vagas }} vagas ocupadas</p>
    <p v-if="evento.descricao" class="mb-4">{{ evento.descricao }}</p>

    <v-card class="pa-4 mb-6" variant="outlined">
      <h2 class="text-h6 mb-3">Inscrever participante</h2>
      <v-alert v-if="sucesso" type="success" variant="tonal" class="mb-3" data-testid="mensagem-sucesso-inscricao">
        {{ sucesso }}
      </v-alert>
      <v-alert v-if="falha" type="error" variant="tonal" class="mb-3" data-testid="mensagem-erro">
        {{ falha }}
      </v-alert>
      <v-form novalidate @submit.prevent="inscrever">
        <Campo v-model="form.nome" label="Nome" :error-messages="erros.nome" testid="campo-nome" />
        <Campo v-model="form.email" label="E-mail" :error-messages="erros.email" testid="campo-email" />
        <v-btn type="submit" color="primary" :loading="enviando" data-testid="inscrever">Inscrever participante</v-btn>
      </v-form>
    </v-card>

    <h2 class="text-h6 mb-2">Inscritos</h2>
    <p v-if="inscricoes.length === 0" class="text-medium-emphasis" data-testid="sem-inscritos">Ninguém inscrito ainda.</p>
    <ul v-else data-testid="lista-inscritos">
      <li v-for="i in inscricoes" :key="i.id">{{ i.nome }}</li>
    </ul>
  </template>
  <v-alert v-else type="error" variant="tonal" data-testid="mensagem-erro">{{ falha }}</v-alert>
</template>
