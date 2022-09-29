<template>
  <v-container>
    <v-tabs>
      <v-tab key="0">Lista</v-tab>
      <v-tab key="1">Nuevo</v-tab>
      <v-tab-item key="0">
        <v-card width="800" class="pl-4 pt-4">
          <v-card-title
            ><div width="400">
              <v-text-field
                outlined
                dense
                rounded
                label="Buscar"
                append-icon="mdi-magnify"
                v-model="buscar"
              ></v-text-field>
            </div>
            <v-spacer></v-spacer
          ></v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Total C$</th>
                  <th>Total U$</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in arqueos" :key="idx">
                  <td>{{ item.id }}</td>
                  <td>{{ item.fecha | fechaCorta }}</td>
                  <td>{{ item.tipo == 0 ? "Apertura" : "Cierre" }}</td>
                  <td>{{ item.total_c$ | redondear }}</td>
                  <td>{{ item.total_u$ | redondear }}</td>
                  <th width="20px">
                    <v-icon
                      color="blue"
                      small
                      @click="
                        selected = idx;
                        dlgDetalle = true;
                      "
                      >mdi-eye-circle</v-icon
                    >
                  </th>
                  <th width="20px">
                    <v-icon color="red" small @click="intentarBorrar(item.id)"
                      >mdi-close-circle</v-icon
                    >
                  </th>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item key="1">
        <v-card max-width="500" class="ml-4">
          <v-card-title class="grey lighten-4 pa-2"
            >Registrar arqueo</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-text-field
                type="date"
                v-model="arqueo.fecha"
                label="Fecha:"
              ></v-text-field>
              <v-select
                label="Tipo:"
                v-model="arqueo.tipo"
                :items="[
                  { value: 0, text: 'Apertura' },
                  { value: 1, text: 'Cierre' },
                ]"
              ></v-select>
            </v-row>

            <v-tabs background-color="#BBDEFB" slider-color="blue">
              <v-tab key="a0">Córdobas</v-tab>
              <v-tab key="a2">Dólares</v-tab>
              <v-tab-item key="a0">
                <div class="pa-5">
                  <v-row>
                    <v-text-field
                      label="0.50:"
                      v-model="arqueo.córdobas['0.50']"
                      type="number"
                    ></v-text-field>
                    <v-text-field
                      label="1:"
                      v-model="arqueo.córdobas['1']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      label="5:"
                      v-model="arqueo.córdobas['5']"
                      type="number"
                    ></v-text-field>
                    <v-text-field
                      label="10:"
                      v-model="arqueo.córdobas['10']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      label="20:"
                      v-model="arqueo.córdobas['20']"
                      type="number"
                    ></v-text-field>
                    <v-text-field
                      label="50:"
                      v-model="arqueo.córdobas['50']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      label="100:"
                      v-model="arqueo.córdobas['100']"
                      type="number"
                    ></v-text-field>
                    <v-text-field
                      label="200:"
                      v-model="arqueo.córdobas['200']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      label="500:"
                      v-model="arqueo.córdobas['500']"
                      type="number"
                    ></v-text-field>
                    <v-text-field
                      label="1000:"
                      v-model="arqueo.córdobas['1000']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                </div>
              </v-tab-item>
              <v-tab-item key="a1">
                <div class="pa-5">
                  <v-row>
                    <v-text-field
                      label="1:"
                      v-model="arqueo.dólares['1']"
                      type="number"
                    ></v-text-field
                    ><v-text-field
                      label="5:"
                      v-model="arqueo.dólares['5']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      label="10:"
                      v-model="arqueo.dólares['10']"
                      type="number"
                    ></v-text-field
                    ><v-text-field
                      label="20:"
                      v-model="arqueo.dólares['20']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      label="50:"
                      v-model="arqueo.dólares['50']"
                      type="number"
                    ></v-text-field
                    ><v-text-field
                      label="100:"
                      v-model="arqueo.dólares['100']"
                      type="number"
                    ></v-text-field>
                  </v-row>
                </div>
              </v-tab-item>
            </v-tabs>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="grey lighten-4">
            <v-chip class="mr-2 blue pa-2 white--text" large
              >C$: {{ total_c$ }}</v-chip
            >
            <v-chip class="mr-2 red pa-2 white--text" large
              >U$: {{ total_u$ }}</v-chip
            >
            <v-spacer></v-spacer>
            <v-btn @click="limpiar()">limpiar</v-btn>
            <v-btn color="primary" dark @click="guardar()">guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog v-model="dlgDetalle" width="500">
      <v-card>
        <v-card-title class="grey lighten-4 pa-2"
          >Detalle del arqueo</v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>Denominación</th>
                <th>Córdoba</th>
                <th>Dólar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>0.50:</th>
                <td>{{ `${detalle["0.50"]}` }}</td>
              </tr>
              <tr>
                <th>1:</th>
                <td>{{ detalle["1"] }}</td>
                <td>{{ detalle["_1"] }}</td>
              </tr>
              <tr>
                <th>5:</th>
                <td>{{ detalle["5"] }}</td>
                <td>{{ detalle["_5"] }}</td>
              </tr>
              <tr>
                <th>10:</th>
                <td>{{ detalle["10"] }}</td>
                <td>{{ detalle["_10"] }}</td>
              </tr>
              <tr>
                <th>20:</th>
                <td>{{ detalle["20"] }}</td>
                <td>{{ detalle["_20"] }}</td>
              </tr>
              <tr>
                <th>50:</th>
                <td>{{ detalle["50"] }}</td>
                <td>{{ detalle["_50"] }}</td>
              </tr>
              <tr>
                <th>100:</th>
                <td>{{ detalle["100"] }}</td>
                <td>{{ detalle["_100"] }}</td>
              </tr>
              <tr>
                <th>200:</th>
                <td>{{ detalle["200"] }}</td>
              </tr>
              <tr>
                <th>500:</th>
                <td>{{ detalle["500"] }}</td>
              </tr>
              <tr>
                <th>1000:</th>
                <td>{{ detalle["1000"] }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "view-arqueos",
  data() {
    return {
      buscar: "",
      dlgDetalle: false,
      selected: null,
      arqueo: {
        fecha: "",
        tipo: 0,
        córdobas: {
          "0.50": null,
          1: null,
          5: null,
          10: null,
          20: null,
          50: null,
          100: null,
          200: null,
          500: null,
          1000: null,
        },
        dólares: { 1: null, 5: null, 10: null, 20: null, 50: null, 100: null },
      },
    };
  },
  methods: {
    guardar: function () {
      const mv = this;
      let data = Object.assign({}, mv.arqueo.córdobas);
      Object.keys(mv.arqueo.dólares).forEach((k) => {
        data[`_${k}`] = mv.arqueo.dólares[k];
      });
      data.fecha = mv.arqueo.fecha;
      data.tipo = mv.arqueo.tipo;
      data.total_c$ = mv.total_c$;
      data.total_u$ = mv.total_u$;
      data = JSON.stringify({ tabla: "arqueos", data });
      fetch(mv.$store.state.api, {
        method: "post",
        body: data,
        headers: { "content-type": "application/json" },
      })
        .then((result) => {
          return result.json();
        })
        .then((json) => {
          console.log(json);
        });
    },
    limpiar: function () {
      const mv = this;
      mv.arqueo.fecha = mv.$store.state.now;
      mv.arqueo.tipo = 0;
      mv.arqueo.total_c$ = 0;
      mv.arqueo.total_u$ = 0;
      Object.keys(mv.arqueo.córdobas).forEach((k) => {
        mv.arqueo.córdobas[k] = null;
      });
      Object.keys(mv.arqueo.dólares).forEach((k) => {
        mv.arqueo.dólares[k] = null;
      });
    },
    intentarBorrar: function (id) {
      const mv = this;
      mv.$swal
        .fire({
          icon: "question",
          title: "Borrar registro",
          text: `¿Desea borrar el registro con id: ?${id}`,
          showCancelButton: true,
        })
        .then((res) => {
          if (res.value) {
            mv.borrar(id);
          }
        });
    },
    borrar: function (id) {
      const mv = this;
      let data = JSON.stringify({
        tabla: "arqueos",
        id,
      });
      fetch(mv.$store.state.api, {
        method: "delete",
        body: data,
        headers: { "content-type": "application/json" },
      });
    },
  },
  computed: {
    total_u$: function () {
      const mv = this;
      let result = 0.0;
      Object.keys(mv.arqueo.dólares).forEach((k) => {
        result += parseFloat(
          mv.arqueo.dólares[k] ? mv.arqueo.dólares[k] * parseFloat(k) : 0.0
        );
      });
      return result;
    },
    total_c$: function () {
      const mv = this;
      let result = 0.0;
      Object.keys(mv.arqueo.córdobas).forEach((k) => {
        result += parseFloat(
          mv.arqueo.córdobas[k] ? mv.arqueo.córdobas[k] * parseFloat(k) : 0.0
        );
      });
      return result;
    },
    detalle: function () {
      const mv = this;
      if (mv.selected != null) {
        return mv.arqueos[mv.selected];
      } else {
        return {};
      }
    },
    arqueos: function () {
      const mv = this;
      let result = [];
      result = mv.$store.state.tablas.arqueos.filter((item) => {
        return item.fecha.indexOf(mv.buscar) >= 0;
      });
      return result;
    },
  },
  filters: {
    redondear: function (value) {
      let nF = Intl.NumberFormat("en-us", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
      let result = nF.format(value);
      return result;
    },
    fechaCorta: function (value) {
      let miFecha = new Date(value);
      let result = miFecha.toLocaleDateString();
      return result;
    },
  },
  mounted: function () {
    this.$store.dispatch("setNow");
    this.arqueo.fecha = this.$store.state.now;
  },
};
</script>
<style scoped>
.v-text-field {
  margin-right: 8px;
}
</style>></style>
