"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_index = require("./stores/index.js");
const stores_baziStore = require("./stores/baziStore.js");
const stores_userStore = require("./stores/userStore.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/input/input.js";
  "./pages/result/result.js";
  "./pages/history/history.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const baziStore = stores_baziStore.useBaziStore();
    const userStore = stores_userStore.useUserStore();
    common_vendor.onLaunch(() => {
      common_vendor.index.__f__("log", "at App.vue:16", "App Launch");
      baziStore.init();
      userStore.init();
      common_vendor.index.__f__("log", "at App.vue:22", "Stores initialized");
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:26", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:30", "App Hide");
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(stores_index.pinia);
  app.config.globalProperties.$store = stores_index.pinia;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
