/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api: "http://localhost:3000/api",
    socketUrl: "http://localhost:3000",
    now: "",
    tablas: {
      empleados: [],
      ventas: [],
      view_ventas: [],
      arqueos: []
    },
    socket: null,
  },
  getters: {},
  mutations: {
    setData(state, payload) {
      Vue.set(state.tablas, payload.tabla, payload.data);
    },
    setDate(state, payload) {
      Vue.set(state, payload.variable, payload.data)
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
        dispatch("loadData", data)
      })
      commit("setSocket", mySocket);
    },
    setNow({ commit }) {
      let miFecha = new Date();
      let result = miFecha.toLocaleDateString();
      let m = result.split('/');
      m = m.reverse();
      m[1]=m[1].padStart(2,'0')
      m[2]=m[2].padStart(2,'0')
      result = m.join('-');
      return commit("setDate", { variable: "now", data: result })
    }
  },
  modules: {},
});
