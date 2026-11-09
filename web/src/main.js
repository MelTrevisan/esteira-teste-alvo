import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import './estilo.css';
import App from './App.vue';
import ListaEventos from './views/ListaEventos.vue';
import NovoEvento from './views/NovoEvento.vue';
import DetalheEvento from './views/DetalheEvento.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ListaEventos },
    { path: '/eventos', redirect: '/' },
    { path: '/eventos/novo', component: NovoEvento },
    { path: '/eventos/:id(\\d+)', component: DetalheEvento, props: true },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'gx2',
    themes: {
      gx2: {
        dark: false,
        colors: {
          primary: '#04254C',
          secondary: '#35B6AD',
          background: '#F5F7FA',
          surface: '#FFFFFF',
        },
      },
    },
  },
});

createApp(App).use(router).use(vuetify).mount('#app');
