<template>
  <v-container>
    <v-card max-width="800" min-width="300">
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
        ><v-btn fab small dark color="red" to="/"
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
              <th width="10"></th>
              <th width="10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in $store.state.tablas.empleados" :key="item.id">
              <td v-text="item.id"></td>
              <td v-text="item.fecha"></td>
              <td v-text="item.empleado"></td>
              <td v-text="item.producto"></td>
              <td v-text="item.precio"></td>
              <td v-text="item.cantidad"></td>
              <td v-text="item.total"></td>
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
          >{{ editMode == 0 ? "Agregar empleado" : "Editar empleado" }}
          <v-spacer></v-spacer
          ><v-btn fab small dark color="red" @click="dlgNuevo = false"
            ><v-icon>mdi-close</v-icon></v-btn
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="empleado.nombre" label="Nombre"></v-text-field>
          <v-text-field
            v-model="empleado.dirección"
            label="Dirección"
          ></v-text-field>
          <v-text-field
            v-model="empleado.teléfono"
            label="Teléfono"
            type="number"
          ></v-text-field>
          <v-select
            v-model="empleado.sexo"
            label="Sexo"
            :items="[
              {
                value: 0,
                text: 'hombre',
              },
              { value: 1, text: 'mujer' },
            ]"
          ></v-select>
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
  }),
};
</script>
