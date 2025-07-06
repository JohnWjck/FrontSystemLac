<template>
  <div
    class="navbar-container d-flex content align-items-center"
    style="background: linear-gradient(to right, #1F2050, #1F2050, #ff741d ); border-radius: 5px;"
  >

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex" />

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav text-white">
            <p class="user-name font-weight-bolder mb-0">
              {{ user.name }}
            </p>
            <span class="user-status">Admin</span>
          </div>
          <b-avatar
            size="40"
            variant="dark-primary"
            badge
            :src="require('@/assets/images/avatars/avatar-15.png')"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          @click="logout()"
        >
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>Salir</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BAvatar,
} from 'bootstrap-vue'
import { mapState } from 'vuex'

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BAvatar,

    // Navbar Components
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
    }),
  },
  mounted() {
    this.getItems()
  },
  methods: {
    getItems() {
      this.$store.dispatch('user/get')
    },
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
  },
}
</script>
