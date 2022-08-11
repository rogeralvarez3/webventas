<template>
  <v-container>
    <v-card max-width="1200" min-width="300">
      <v-card-title class="grey lighten-4 pa-2"
        >Ventas <v-spacer></v-spacer>
        <v-btn
          fab
          small
          dark
          color="success"
          class="mr-2"
          @click="
            dlgNuevo = true;
            editMode = 0;
          "
          ><v-icon>mdi-plus</v-icon></v-btn
        ><v-btn
          fab
          small
          dark
          color="purple"
          class="mr-2"
          @click="
            dlgNuevo = true;
            editMode = 0;
          "
          ><v-icon>mdi-filter</v-icon></v-btn
        >
        <v-btn fab small dark color="red" to="/"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        <v-simple-table dense fixed-header>
          <thead>
            <tr>
              <th>Id</th>
              <th>Fecha</th>
              <th>Empleado</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Comisión</th>
              <th width="5"></th>
              <th width="5"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in $store.state.tablas.ventas" :key="item.id">
              <td v-text="item.id"></td>
              <td v-text="item.fecha"></td>
              <td
                v-text="
                  $store.state.tablas.empleados[
                    $store.state.tablas.empleados.findIndex((empleado) => {
                      return empleado.id == item.empleado;
                    })
                  ].nombre
                "
              ></td>
              <td v-text="item.producto"></td>
              <td v-text="item.precio"></td>
              <td v-text="item.cantidad"></td>
              <td v-text="item.precio * item.cantidad"></td>
              <td v-text="item.comisión"></td>
              <td>
                <v-icon small dark color="red" @click="intentarBorrar(item.id)"
                  >mdi-close-circle</v-icon
                >
              </td>
              <td>
                <v-icon
                  small
                  dark
                  color="warning"
                  @click="
                    dlgNuevo = true;
                    editMode = 1;
                    empleado = Object.assign({}, item);
                  "
                  >mdi-pencil</v-icon
                >
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dlgNuevo" width="500">
      <v-card>
        <v-card-title class="grey lighten-3 pa-2"
          >{{ editMode == 0 ? "Agregar venta" : "Editar venta" }}
          <v-spacer></v-spacer
          ><v-btn fab small dark color="red" @click="dlgNuevo = false"
            ><v-icon>mdi-close</v-icon></v-btn
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            v-model="venta.fecha"
            label="Fecha"
            type="date"
            dense
          ></v-text-field>
          <v-select
            v-model="venta.empleado"
            label="Empleado"
            :items="$store.state.tablas.empleados"
            item-value="id"
            item-text="nombre"
            dense
          ></v-select>
          <v-text-field
            v-model="venta.producto"
            label="Producto"
            dense
          ></v-text-field>
          <v-text-field
            v-model="venta.precio"
            label="Precio"
            dense
          ></v-text-field>
          <v-text-field
            v-model="venta.cantidad"
            label="Cantidad"
            dense
          ></v-text-field>
          <v-text-field
            v-model="venta.comisión"
            label="Comisión"
            dense
          ></v-text-field>
          <v-text-field v-model="totalVenta" disabled dense></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="guardar()">guardar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "ventas-view",
  data: () => ({
    venta: {
      id: null,
      fecha: null,
      empleado: null,
      producto: null,
      precio: null,
      cantidad: null,
    },
    editMode: 0,
    dlgNuevo: false,
  }),
  watch: {
    venta: {
      handler(val) {
        this.venta.comisión =
          (this.$store.state.tablas.empleados[
            this.$store.state.tablas.empleados.findIndex((empleado) => {
              return empleado.id == val.empleado;
            })
          ].comisión /
            100) *
          this.venta.cantidad *
          this.venta.precio;
      },
      deep: true,
    },
  },
  computed: {
    totalVenta: function () {
      const mv = this;
      return mv.venta.cantidad * mv.venta.precio;
    },
  },
  methods: {
    guardar: function () {
      const mv = this;
      const data = JSON.stringify({
        tabla: "ventas",
        data: mv.venta,
      });
      fetch(`${mv.$store.state.api}`, {
        body: data,
        headers: { "content-type": "application/json" },
        method: "post",
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          console.log(json);
          if (!json.mysqlError) {
            mv.$store.dispatch("loadData");
            mv.dlgNuevo = false;
            Object.keys(mv.venta).forEach((k) => {
              mv.empleado[k] = null;
            });
          } else {
            mv.$swal.fire({
              icon: "error",
              title: "Error al guardar",
              text: json.sqlError,
            });
          }
        });
    },
    intentarBorrar: function (id) {
      const mv = this;
      mv.$swal
        .fire({
          icon: "question",
          title: "Se borrará el registro!!!",
          text: "Esta acción no se podrá deshacer",
          confirmButtonText: "Continuar",
          showCancelButton: true,
        })
        .then((result) => {
          if (result.value) {
            mv.borrar(id);
          }
        });
    },
    borrar: function (id) {
      const mv = this;
      const data = JSON.stringify({
        tabla: "ventas",
        id,
      });
      fetch(`${mv.$store.state.api}`, {
        body: data,
        headers: { "content-type": "application/json" },
        method: "delete",
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          json.text ? mv.$store.dispatch("loadData") : console.log(json);
        });
    },
  },
};
</script>
