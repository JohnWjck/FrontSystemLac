<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
        <b-sidebar
          v-model="open"
          width="30%"
          bg-variant="light"
          left
          backdrop
          shadow
        >
          <NewUser
            @saved="() => openSidebar(false)"
          />
        </b-sidebar>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title
            title-tag="h2"
            class="font-weight-bold mb-1"
          >
            Bienvenido al Sistema DistriLact MV 👋
          </b-card-title>
          <b-card-text class="mb-2">
            DISTRIBUIDORA E INVERSIONES LACTEOS MV 2016, C.A.
          </b-card-text>

          <!-- form -->
          <validation-observer ref="loginValidation">
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent
            >
              <!-- email -->
              <b-form-group
                label="Nombre de usuario"
                label-for="username"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Nombre de usuario"
                  rules="required"
                >
                  <b-form-input
                    id="username"
                    v-model="username"
                    :state="errors.length > 0 ? false:null"
                    name="username"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Contraseña</label>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Recuerdame
                </b-form-checkbox>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                @click="validationForm"
              >
                Acceder
              </b-button>
            </b-form>
          </validation-observer>

          <!-- divider
          <div class="divider my-2">
            <div class="divider-text">
              O
            </div>
          </div> -->

          <!-- social buttons -->
        </b-col>
      </b-col>
    <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow, BSidebar, BCol, BLink, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BFormCheckbox, BCardText, BCardTitle, BImg, BForm, BButton,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
// import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { mapState } from 'vuex'
import { handleErrors, successToast } from '@/helpers/utils'
import NewUser from '../Users/components/NewUser.vue'

export default {
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
    BSidebar,
    NewUser,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      open: false,
      status: '',
      password: '',
      username: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),
      // validation rulesimport store from '@/store/index'
      required,
      email,
    }
  },
  computed: {
    ...mapState({
      loginLoading: state => state.auth.loginLoading,
    }),
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    async validationForm() {
      try {
        await this.$refs.loginValidation.validate()
        const resp = await this.$store.dispatch('auth/login', { username: this.username, password: this.password })

        console.log(resp) // Verificar estructura del objeto de respuesta

        if (resp && resp.success) {
          // Verificar si hay datos en la respuesta
          if (resp.data && resp.data.token && resp.data.user) {
            this.$router.push({ name: 'home' })
            successToast('Sesión iniciada correctamente')
          } else {
            handleErrors(resp, true, 'Respuesta de la API inválida. Por favor, inténtalo nuevamente.')
          }
        } else {
          handleErrors(resp, true, 'Credenciales inválidas. Por favor verifica y intenta nuevamente.')
        }
      } catch (e) {
        console.log(e) // Verificar error capturado
        handleErrors(e, true, 'Ocurrió un error durante el inicio de sesión.')
      }
    },
    crear() {
      this.item = null
      this.openSidebar()
    },
    openSidebar(open = true) {
      this.open = open
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
