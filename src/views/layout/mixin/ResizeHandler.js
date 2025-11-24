import store from "@/store";

const { body } = document;
const WIDTH = 820;
const RATIO = 3;

export default {
  watch: {
    $route(route) {
      if (this.device === "mobile" && this.sidebar.opened) {
        store.commit("CLOSE_SIDEBAR", { withoutAnimation: false });
      }
    },
  },
  beforeMount() {
    // window.addEventListener("resize", this.resizeHandler);
  },
  mounted() {
    setTimeout(() => {
      const isMyMobile = this.isMobile();
      if (isMyMobile) {
        store.commit("TOGGLE_DEVICE", "mobile");
        store.commit("CLOSE_SIDEBAR", { withoutAnimation: false });
      }
    }, 5000);
    window.addEventListener("resize", this.resizeHandler.bind(this));
  },
  methods: {
    isMobile() {
      const rect = body.getBoundingClientRect();
      return rect.width - RATIO < WIDTH;
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMyMobile = this.isMobile();
        store.commit("TOGGLE_DEVICE", isMyMobile ? "mobile" : "desktop");

        if (isMyMobile) {
          store.commit("CLOSE_SIDEBAR", { withoutAnimation: false });
        } else {
          store.commit("OPEN_SIDEBAR", { withoutAnimation: false });
        }
      }
    },
  },
};
