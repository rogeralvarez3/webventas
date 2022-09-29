<template>
  <v-container>
    <v-tabs>
      <v-tab key="lista">Lista</v-tab>
      <v-tab key="crear">Crear</v-tab>
      <v-tab-item key="lista">
        <v-card max-width="800" min-width="400" class="ma-1">
          <v-card-title class="grey lighten-4 pa-2">
            <v-spacer></v-spacer>
            <v-btn fab small dark class="mr-1" @click="dlgFiltro = true"
              ><v-icon>mdi-filter</v-icon></v-btn
            >
            <div width="350">
              <v-text-field
                rounded
                append-icon="mdi-magnify"
                placeholder="buscar..."
                dense
                hide-details
                outlined
                v-model="buscar"
              ></v-text-field>
            </div>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div height="300">
              <v-simple-table fixed-header dense>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Empleado</th>
                    <th>Fecha</th>
                    <th class="right-align">Monto</th>
                    <th class="right-align">Pago</th>
                    <th class="right-align">Cambio</th>
                    <th class="right-align">Comisión</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(fila, i) in view_ventas" :key="i">
                    <td>{{ fila.id }}</td>
                    <td>{{ fila.nombre }}</td>
                    <td>{{ fila.fecha | fechaCorta }}</td>
                    <td class="right-align">{{ fila.total | redondear }}</td>
                    <td class="right-align">{{ fila.pago | redondear }}</td>
                    <td class="right-align">{{ fila.cambio | redondear }}</td>
                    <td class="right-align">
                      {{
                        obtenerComisión(fila.id_empleado, fila.total)
                          | redondear
                      }}
                    </td>
                    <td>
                      <v-icon small color="red">mdi-close-circle</v-icon>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item key="crear">
        <v-card min-width="300" max-width="600" class="ma-1">
          <v-card-title class="grey lighten-4 pa-2">
            Venta
            <v-spacer></v-spacer>
            <v-btn
              fab
              color="primary"
              dark
              small
              class="mr-1"
              v-if="venta.empleado && venta.detalle.length > 0"
              @click="dlgPagar = true"
              ><v-icon>mdi-content-save</v-icon></v-btn
            >
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
              label="Cliente (opcional)"
              v-model="venta.cliente"
              dense
              class="mr-10"
            ></v-text-field>
            <v-select
              :items="$store.state.tablas.empleados"
              item-value="id"
              item-text="nombre"
              label="Empleado"
              v-model="venta.empleado"
              dense
              class="mr-10"
            ></v-select>
            <v-card width="550">
              <v-card-title class="grey lighten-4 pa-2"
                >Detalle de venta <v-spacer></v-spacer
                ><v-btn small color="primary" dark @click="dlgNuevoItem = true"
                  >agregar item</v-btn
                ></v-card-title
              >
              <v-divider></v-divider>
              <v-card-text>
                <div style="overflow-y;: scroll">
                  <v-simple-table fixed-header height="300" dense>
                    <thead>
                      <tr>
                        <th class="right-align">Cantidad</th>
                        <th class="text-right">Precio</th>
                        <th class="text-right">Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, i) in venta.detalle" :key="i">
                        <td v-text="item.cantidad"></td>
                        <td class="right-align">
                          {{ item.precio | redondear }}
                        </td>
                        <td class="right-align">
                          {{ (item.cantidad * item.precio) | redondear }}
                        </td>
                        <td>
                          <v-icon
                            small
                            cark
                            color="error"
                            @click="venta.detalle.splice(i, 1)"
                            >mdi-close</v-icon
                          >
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer> </v-spacer>
                <h2>TOTAL:</h2>
                <h2 class="mr-8 ml-2">{{ total | redondear }}</h2>
              </v-card-actions>
            </v-card>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog width="300" v-model="dlgNuevoItem">
      <v-card>
        <v-card-title class="grey lighten-4 pa-2">Nuevo item</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            label="Cantidad"
            type="number"
            v-model="nuevoItem.cantidad"
            v-if="dlgNuevoItem"
            autofocus
          ></v-text-field>
          <v-text-field
            label="Precio"
            type="number"
            v-model="nuevoItem.precio"
          ></v-text-field>
          <v-text-field disabled v-model="subtotal"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="agregarItem()">Aceptar</v-btn>
          <v-btn
            @click="
              nuevoItem.cantidad = null;
              nuevoItem.precio = null;
              dlgNuevoItem = false;
            "
            >Cancelar</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="350" v-model="dlgPagar">
      <v-card>
        <v-card-title class="grey lighten-4 ma-2">Pagar</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <h2 class="mb-2 mt-2">{{ `TOTAL: ${total}` }}</h2>
          <v-text-field
            label="Paga"
            v-model="venta.pago"
            class="display-1"
            v-if="dlgPagar"
            autofocus
          ></v-text-field>
          <v-row :class="`pt-4 ${cambio < 0 ? 'red--text' : 'blue--text'}`">
            <h2 class="mr-2 ml-4">CAMBIO:</h2>
            <h2>{{ cambio | redondear }}</h2>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="primary"
            @click="guardarVenta()"
            v-if="venta.pago && cambio >= 0"
            >pagar</v-btn
          >
          <v-btn
            @click="
              dlgPagar = false;
              venta.pago = null;
            "
            >cancelar</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="350" v-model="dlgFiltro">
      <v-card>
        <v-card-title class="grey lighten-4 pa-2"
          >Filtro de fechas</v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            class="mt-4"
            type="date"
            label="Fecha inicial"
            v-model="filtroFechaTemp.fechaInicial"
            dense
          ></v-text-field>
          <v-text-field
            type="date"
            label="Fecha inicial"
            v-model="filtroFechaTemp.fechaFinal"
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="default"
            @click="
              filtroFecha = Object.assign({}, filtroFechaTemp);
              dlgFiltro = false;
            "
            dark
            >Aplicar</v-btn
          >
          <v-btn
            @click="
              filtroFechaTemp = Object.assign({}, filtroFecha);
              dlgFiltro = false;
            "
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "view-ventas",
  data: () => ({
    venta: { id: null, cliente: null, empleado: null, detalle: [] },
    nuevoItem: { venta: null, cantidad: null, precio: null },
    dlgNuevoItem: false,
    dlgPagar: false,
    dlgFiltro: false,
    filtroFecha: { fechaInicial: null, fechaFinal: null },
    filtroFechaTemp: { fechaInicial: null, fechaFinal: null },
    buscar: "",
  }),
  computed: {
    view_ventas: function () {
      const mv = this;
      let firstDate = new Date(mv.filtroFecha.fechaInicial);
      let lastDate = new Date(mv.filtroFecha.fechaFinal);
      let result = mv.$store.state.tablas.view_ventas.filter((item) => {
        let myDate = new Date(item.fecha);
        console.log(myDate.toLocaleDateString());
        return (
          item.nombre.indexOf(mv.buscar) >= 0 &&
          myDate >= firstDate &&
          myDate <= lastDate
        );
      });
      console.log(
        firstDate.toLocaleDateString(),
        lastDate.toLocaleDateString()
      );
      return result;
    },
    subtotal: function () {
      const mv = this;
      let mi_cantidad = mv.nuevoItem.cantidad ? mv.nuevoItem.cantidad : 0;
      let mi_precio = mv.nuevoItem.precio ? mv.nuevoItem.precio : 0;
      let result = mi_cantidad * mi_precio;
      return result.toFixed(2);
    },
    total: function () {
      const mv = this;
      let result = 0.0;
      mv.venta.detalle.forEach((item) => {
        result += parseFloat(item.cantidad * item.precio);
      });
      return result.toFixed(2);
    },
    cambio: function () {
      const mv = this;
      let result = 0;
      result = mv.venta.pago
        ? parseFloat(mv.venta.pago) - parseFloat(mv.total)
        : 0;
      return result.toFixed(2);
    },
  },
  methods: {
    agregarItem: function () {
      const mv = this;
      if (mv.venta.id) {
        mv.nuevoItem.venta = mv.venta.id;
      }
      mv.venta.detalle.push(Object.assign({}, mv.nuevoItem));
      mv.nuevoItem.cantidad = null;
      mv.nuevoItem.precio = null;
      mv.nuevoItem.venta = null;
      mv.dlgNuevoItem = false;
    },
    guardarVenta: function () {
      const mv = this;
      mv.venta.total = mv.total;
      mv.venta.cambio = mv.venta.pago - mv.total;
      const data = JSON.stringify(Object.assign({}, mv.venta));
      fetch(mv.$store.state.api + "/guardarVenta", {
        body: data,
        method: "post",
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json.errno) {
            console.log(json);
            mv.$swal.fire({
              icon: "error",
              title: "Ups!, ocurrió un error",
              text: "no se ha podido guardar el registro",
            });
          } else {
            mv.$swal.fire({
              icon: "success",
              title: "GUARDADO!!!",
              text: "el registro se ha guardado correctamente",
            });
            mv.dlgPagar = false;
            mv.inicializarVenta();
          }
        });
    },
    inicializarVenta: function () {
      const mv = this;
      Object.keys(mv.venta).forEach((key) => {
        mv.venta[key] = null;
      });
      mv.venta.detalle = [];
    },
    inicializarFiltros: function () {
      const mv = this;
      let myDate = new Date();
      let myMonth = myDate.getMonth();
      let myDay = myDate.getDate();
      let myYear = myDate.getFullYear();
      mv.filtroFecha.fechaInicial = `${myYear}-${(myMonth + 1)
        .toString()
        .padStart(2, "0")}-01`;
      mv.filtroFecha.fechaFinal = `${myYear}-${(myMonth + 1)
        .toString()
        .padStart(2, "0")}-${myDay.toString().padStart(2, "0")}`;
      mv.filtroFechaTemp = Object.assign({}, mv.filtroFecha);
    },
    obtenerComisión: function (empleado, monto) {
      const mv = this;
      const idx = mv.$store.state.tablas.empleados.findIndex((item) => {
        return item.id == empleado;
      });
      const comisión = mv.$store.state.tablas.empleados[idx].comisión;
      let result = (comisión / 100) * monto;
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
    this.inicializarFiltros();
  },
};
</script>
<style>
.right-align {
  text-align: right !important;
}
.large-text {
  font-size: medium;
}
</style>
