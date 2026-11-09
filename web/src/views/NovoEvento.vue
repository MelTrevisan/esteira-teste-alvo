<script setup>
import Campo from '../components/Campo.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api.js';

const router = useRouter();
const form = reactive({ titulo: '', data: '', local: '', vagas: '', descricao: '' });
const erros = ref({});
const mensagemErro = ref('');
const avisoValidacao = ref(false);
const salvando = ref(false);

async function salvar() {
  erros.value = {};
  avisoValidacao.value = false;
  mensagemErro.value = '';
  salvando.value = true;
  const r = await api.criar({ ...form }).catch(() => ({ ok: false, status: 0, corpo: {} }));
  salvando.value = false;
  if (r.ok) {
    router.push({ path: `/eventos/${r.corpo.id}`, query: { criado: '1' } });
  } else if (r.status === 422) {
    erros.value = r.corpo.errors;
    avisoValidacao.value = true;
  } else {
    mensagemErro.value = 'Não foi possível salvar o evento. Tente novamente.';
  }
}
</script>

<template>
  <h1 class="text-h5 font-weight-bold mb-4" data-testid="titulo-novo-evento">Novo evento</h1>
  <v-alert v-if="mensagemErro" type="error" variant="tonal" class="mb-4" data-testid="mensagem-erro">
    {{ mensagemErro }}
  </v-alert>
  <v-alert v-if="avisoValidacao" type="warning" variant="tonal" class="mb-4" data-testid="aviso-validacao">
    Revise os campos destacados antes de salvar.
  </v-alert>
  <v-form novalidate @submit.prevent="salvar">
    <Campo
      v-model="form.titulo"
      label="Título"
      :error-messages="erros.titulo"
      testid="campo-titulo"
    />
    <Campo
      v-model="form.data"
      label="Data"
      type="date"
      :error-messages="erros.data"
      testid="campo-data"
    />
    <Campo v-model="form.local" label="Local" testid="campo-local" />
    <Campo
      v-model="form.vagas"
      label="Vagas"
      type="number"
      :error-messages="erros.vagas"
      testid="campo-vagas"
    />
    <Campo area v-model="form.descricao" label="Descrição" rows="2" testid="campo-descricao" />
    <v-btn type="submit" color="primary" :loading="salvando" data-testid="salvar-evento">
      Salvar evento
    </v-btn>
  </v-form>
</template>
