<template>
  <div
    class="h-16 w-full bg-gray-100 fixed right-0 top-0 z-10 flex flex-row items-center duration-200 transition-all ease-in"
    :class="is_collapsed ? 'pl-20' : 'pl-56'"
  >
    <div class="ml-4 mr-auto text-2xl text-indigo-800 font-medium">
      {{ routeSectionTitle }}
    </div>
    <div class="flex flex-row ml-auto">
      <div
        class="ml-auto border-r-2 border-gray-400 py-1 pr-3 mr-3 cursor-pointer flex flex-row items-center flex-initial"
      >
        <i class="hi-notification text-gray-600 text-2xl"></i>
      </div>
      <div
        class="mr-4 flex flex-row items-center flex-initial"
        ref="popperTrigger"
      >
        <avatar :user="user" class="w-12 h-12 mr-5"></avatar>
        <popper
          :toggler="showUserMenu"
          transition="slide-down-fade"
          trigger="toggler"
          :options="{
            position: 'bottom',
          }"
          v-on:hide="showUserMenu = false"
        >
          <span
            slot="reference"
            @click="toggleUserMenu()"
            class="text-base text-gray-700 hover:text-gray-800 cursor-pointer flex flex-row items-center select-none"
          >
            <span class>{{ fullName }}</span>
            <i
              class="ml-1 hi-cheveron-down text-2xl text-gray-500 cursor-pointer"
            ></i>
          </span>
          <div
            class="popper shadow-lg bg-white rounded top-9 p-0"
            style="min-width: 8rem"
          >
            <div
              class="w-32 cursor-pointer py-2 hover:bg-indigo-100 flex flex-row justify-center items-baseline hover:text-indigo-700 border-b border-grey-200"
              @click="doUserAction(action)"
              :key="action.name"
              v-for="action in userActions"
            >
              <i :class="action.icon"></i>
              <span class="ml-2">{{ action.label }}</span>
            </div>
          </div>
        </popper>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile } from '@/utils/auth';
import Popper from '@/components/Popper';
import SideNavMixin from "@/mixin/SideNav.mixin.js";

export default {
  name: 'top-bar',
  mixins: [SideNavMixin],
  components: {
    popper: Popper,
  },
  data: () => ({
    showUserMenu: false,
    userActions: [
      {
        label: 'Logout',
        icon: 'hi-lock-open',
        callback: 'logout',
      },
    ],
  }),
  beforeMount() {
    this.reloadUser();
    this.EventBus.$on('reload-user', this.reloadUser);
    this.listenForSideNavCollapseEvent();
  },
  methods: {
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    doUserAction(action) {
      this.showUserMenu = false;

      if (this[action.callback] != null) {
        this[action.callback]();
      }
    },
    logout() {
      this.$router.push({ name: 'logout' });
    },
    reloadUser() {
      this.user = getProfile();
    },
  },
  computed: {
    routeSectionTitle() {
      let labels = this.$route.matched
        .map((route) => (route.meta ? route.meta.label : null))
        .reverse();

      // Return the first not null && not undefined label
      return labels.find((label) => !!label);
    },
    fullName() {
      return this.user.name + ' ' + this.user.surname;
    },
  },
};
</script>

<style></style>
