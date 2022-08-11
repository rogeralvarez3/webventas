/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "http://localhost:3000/api",
    socketUrl: "http://localhost:3000",
    tablas: {
      empleados: [],
      ventas: [],
    },
    socket: null,
  },
  getters: {},
  mutations: {
    setData(state, payload) {
      Vue.set(state.tablas, payload.tabla, payload.data);
    },
    setSocket(state, payload) {
      Vue.set(state, "socket", payload);
    }
  },
  actions: {
    loadData({ state, commit }, payload) {
      if (payload) {
        fetch(`${state.api}?tabla=${payload}`, {
          headers: { "content-type": "application/json" }, method: "get"
        }).then(res => { return res.json() })
          .then((json) => { commit("setData", { tabla: payload, data: json }) });
      } else {
        Object.keys(state.tablas).forEach((tabla) => {
          fetch(`${state.api}?tabla=${tabla}`, {
            headers: { "content-type": "application/json" }, method: "get"
          }).then(res => { return res.json() })
            .then((json) => { commit("setData", { tabla: tabla, data: json }) });
        });
      }
    },
    loadSocket({ state, dispatch, commit }) {
      const mySocket = io(state.socketUrl)
      mySocket.on("update", (data) => {
        dispatch("loadData",data)
      })
      commit("setSocket", mySocket);
    }
  },
  modules: {},
});
