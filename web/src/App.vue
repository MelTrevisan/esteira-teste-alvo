<template>
  <v-app>
    <v-app-bar color="primary" class="barra-marca" flat>
      <v-container class="d-flex align-center">
        <router-link to="/" class="text-white text-decoration-none" data-testid="marca">
          <span class="text-h6 font-weight-bold">Eventos GX2 Demo</span>
        </router-link>
        <v-spacer />
        <v-btn to="/" variant="text" data-testid="nav-eventos">Eventos</v-btn>
        <v-btn to="/eventos/novo" variant="text" color="secondary" data-testid="nav-novo-evento">
          Novo evento
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container class="py-6" style="max-width: 960px">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
