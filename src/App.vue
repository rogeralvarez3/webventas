<template>
  <v-app>
    <v-navigation-drawer app clipped dense v-model="drawer">
      <v-list>
        <v-list-item v-for="mn in menu" :key="mn.id" :to="mn.to">
          <v-list-item-icon>
            <v-icon v-text="mn.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="mn.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark dense clipped-left>
      <v-app-bar-nav-icon
        v-if="!drawer"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
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
      { id: 1, title: "Empleados", icon: "mdi-account", to: "empleados" },
      { id: 2, title: "Ventas", icon: "mdi-cart", to: "ventas" },
      { id: 3, title: "Opciones", icon: "mdi-cog", to: "opciones" },
    ],
  }),
  mounted: function () {
    this.$store.dispatch("loadData");
    this.$store.dispatch("loadSocket");
  },
};
</script>
