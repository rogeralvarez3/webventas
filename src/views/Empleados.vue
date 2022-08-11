<template>
  <v-container>
    <v-card max-width="800" min-width="300">
      <v-card-title class="grey lighten-4 pa-2"
        >Empleados <v-spacer></v-spacer>
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
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Sexo</th>
              <th>Comisión</th>
              <th width="10"></th>
              <th width="10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in $store.state.tablas.empleados" :key="item.id">
              <td v-text="item.id"></td>
              <td v-text="item.nombre"></td>
              <td v-text="item.dirección"></td>
              <td v-text="item.teléfono"></td>
              <td v-text="item.sexo == 0 ? 'Hombre' : 'Mujer'"></td>
              <td v-text="`${item.comisión}%`"></td>
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
          <v-text-field
            v-model="empleado.comisión"
            label="Comisión"
            append-icon="mdi-percent"
          ></v-text-field>
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
  name: "empleados-view",
  data: () => ({
    dlgNuevo: false,
    empleado: {
      nombre: null,
      dirección: null,
      teléfono: null,
      sexo: null,
      comisión: null,
    },
    editMode: 0,
  }),
  methods: {
    guardar: function () {
      const mv = this;
      const data = JSON.stringify({
        tabla: "empleados",
        data: mv.empleado,
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
            Object.keys(mv.empleado).forEach((k) => {
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
        tabla: "empleados",
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
