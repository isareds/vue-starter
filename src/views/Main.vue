<template>
  <div class="h-screen">
    <side-nav></side-nav>
    <top-bar></top-bar>
    <div
      class="bg-gray-100 relative pt-16 min-h-screen transition-all duration-200 ease-in"
      :class="is_collapsed ? 'pl-20 pr-2' : 'pl-56'"
    >
      <router-view class="max-w-screen-xl mx-auto"></router-view>
    </div>
    <color-swatch></color-swatch>
  </div>
</template>
<script>
import SideNav from "@/components/SideNav.vue";
import TopBar from "@/components/TopBar.vue";
import SideNavMixin from "@/mixin/SideNav.mixin.js";

export default {
  name: "Main",
  mixins: [SideNavMixin],
  data: () => ({
    path: []
  }),
  beforeMount() {
    this.format_path_for_breadcrumbs(this.$route.fullPath);
    this.listenForSideNavCollapseEvent();
  },
  methods: {
    format_path_for_breadcrumbs(path) {
      const splitted_full_path = path
        .trim()
        .split("/")
        .map(item => {
          return {
            disabled: false,
            exact: false,
            href: "/" + item,
            text: item,
            to: item
          };
        });

      this.path = splitted_full_path;
    }
  },
  components: { "side-nav": SideNav, "top-bar": TopBar },
  watch: {
    $route: {
      handler() {
        this.format_path_for_breadcrumbs(this.$route.fullPath);
      }
    }
  }
};
</script>
<style></style>
