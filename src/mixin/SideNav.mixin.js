export default {
  data() {
    return {
      is_collapsed: false,
      show_text: true
    }
  },
  created() {
  },
  beforeMount() {
    this.getSideBarCollapseState();
  },
  methods: {
    getSideBarCollapseState() {
      this.is_collapsed = JSON.parse(localStorage.getItem('is_collapsed')) ? true : false;
      if(!this.is_collapsed) return 0;
      this.show_text = false;
    },
    collapseSideBar() {
      const expanding = this.is_collapsed;
      if(expanding) {
        // il tempo del timeout deve essere minore di 100ms rispetto alla durata dell'animazione
        setTimeout(() => { this.show_text = !this.show_text}, 200);
      } else {
        this.show_text = !this.show_text;
      }

      this.is_collapsed = !this.is_collapsed;
      localStorage.setItem('is_collapsed', this.is_collapsed);
      this.EventBus.$emit("side-bar:collapse", this.is_collapsed);
    },
    listenForSideNavCollapseEvent() {
      this.EventBus.$on("side-bar:collapse", value => {
        this.is_collapsed = value;
      });
    }
  }
}
