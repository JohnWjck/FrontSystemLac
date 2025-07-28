<template>
  <div>
    <b-form
      class="m-3"
      @submit.prevent="saveEmployee"
    >
      <b-row>
        <b-col cols="12">
          <h2 class="mb-2 d-flex justify-content-center">
            {{ employee.id ? 'Detalles del Empleado' : 'Nuevo Empleado' }}
          </h2>
        </b-col>
        <!-- Nombre -->
        <b-col cols="6">
          <b-form-group
            label="Nombre:"
            description="Ingrese el nombre del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="UserIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.name"
                required
                type="text"
                placeholder="Nombre"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Apellido -->
        <b-col cols="6">
          <b-form-group
            label="Apellido:"
            description="Ingrese el apellido del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="UserIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.last_name"
                required
                type="text"
                placeholder="Apellido"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Cédula -->
        <b-col cols="6">
          <b-form-group
            label="Cédula:"
            description="Ingrese la cédula del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="CreditCardIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.dni"
                required
                type="text"
                maxlength="8"
                placeholder="Cédula"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Teléfono -->
        <b-col cols="6">
          <b-form-group
            label="Teléfono:"
            description="Ingrese el teléfono en formato 1234-1234567"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SmartphoneIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.phone"
                required
                type="text"
                maxlength="12"
                placeholder="Teléfono"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Email -->
        <b-col cols="6">
          <b-form-group
            label="Email:"
            description="Ingrese el email del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="MailIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.email"
                required
                type="email"
                placeholder="Email"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Estado -->
        <b-col cols="6">
          <b-form-group
            label="Estado:"
            description="Seleccione el estado del empleado"
          >
            <b-form-select
              v-model="employee.status"
              :options="statusOptions"
              required
            />
          </b-form-group>
        </b-col>
        <!-- Cargo -->
        <b-col cols="6">
          <b-form-group
            label="Cargo:"
            description="Ingrese el cargo del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="BriefcaseIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.position"
                required
                type="text"
                placeholder="Cargo"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Departamento -->
        <b-col cols="6">
          <b-form-group
            label="Departamento:"
            description="Ingrese el departamento del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="LayersIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.department"
                required
                type="text"
                placeholder="Departamento"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Fecha de Contratación -->
        <b-col cols="6">
          <b-form-group
            label="Fecha de Contratación:"
            description="Seleccione la fecha de contratación"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="CalendarIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.hire_date"
                required
                type="date"
                placeholder="Fecha de Contratación"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Salario -->
        <b-col cols="6">
          <b-form-group
            label="Salario:"
            description="Ingrese el salario del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="DollarSignIcon" />
              </b-input-group-prepend>
              <b-form-input
                v-model="employee.salary"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Salario"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <!-- Dirección -->
        <b-col cols="12">
          <b-form-group
            label="Dirección:"
            description="Ingrese la dirección del empleado"
          >
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="MapPinIcon" />
              </b-input-group-prepend>
              <b-form-textarea
                v-model="employee.address"
                required
                placeholder="Dirección"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <div class="d-flex justify-content-center align-items-center">
            <b-button
              variant="success"
              class="mt-2"
              type="submit"
            >
              Guardar
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BButton,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BForm,
  BFormSelect,
  BInputGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue'

const employeeData = {
  id: null,
  dni: '',
  name: '',
  last_name: '',
  phone: '',
  email: '',
  position: '',
  department: '',
  hire_date: '',
  salary: '',
  address: '',
  status: 'active',
}

export default {
  components: {
    BButton,
    BForm,
    BFormInput,
    BFormTextarea,
    BRow,
    BFormGroup,
    BCol,
    BFormSelect,
    BInputGroup,
    BInputGroupPrepend,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      statusOptions: [
        { value: 'active', text: 'Activo' },
        { value: 'inactive', text: 'Inactivo' },
      ],
      employee: { ...employeeData },
    }
  },
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.employee = { ...val }
          // Formatear fecha para input type="date"
          if (
            this.employee.hire_date
            && typeof this.employee.hire_date === 'string'
            && this.employee.hire_date.substring
          ) {
            this.employee.hire_date = this.employee.hire_date.substring(0, 10)
          }
        } else {
          this.employee = { ...employeeData }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async saveEmployee() {
      try {
        const res = await this.$store.dispatch('employee/save', {
          ...this.employee,
        })
        this.employee = { ...employeeData }
        this.$emit('saved', res)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style scoped>
</style>
