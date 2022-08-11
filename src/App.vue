<template>
  <v-app>
    <v-navigation-drawer app clipped dense v-model="drawer">
      <v-list>
        <v-list-item v-for="mn in menu" :key="mn.id">
          <v-list-item-icon>
            <v-icon v-text="mn.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="mn.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark dense clipped-left>
      <v-app-bar-nav-icon v-if="!drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>WEBVentas</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
    drawer: null,
    menu: [
      { id: 1, title: "Empleados", icon: "mdi-account" },
      { id: 1, title: "Ventas", icon: "mdi-cart" },
      { id: 1, title: "Opciones", icon: "mdi-cog" },
    ],
  }),
};
</script>
