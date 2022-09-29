import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import Empleados from "../views/Empleados.vue";
import Ventas from "../views/Ventas.vue";
import Arqueos from "../views/Arqueos.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Empleados,
  },
  {
    path: "/empleados",
    name: "empleados",
    component: Empleados,
  },
  {
    path: "/ventas",
    name: "ventas",
    component: Ventas,
  },
  {
    path: "/arqueos",
    name: "arqueos",
    component: Arqueos,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
