"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      historyList: []
    };
  },
  onShow() {
    this.loadHistory();
  },
  methods: {
    loadHistory() {
      try {
        const history = common_vendor.index.getStorageSync("bazi_history") || [];
        this.historyList = history;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/history/history.vue:86", "加载历史记录失败:", error);
        this.historyList = [];
      }
    },
    viewResult(item) {
      common_vendor.index.navigateTo({
        url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(item.data))}`
      });
    },
    deleteItem(index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条记录吗？",
        success: (res) => {
          if (res.confirm) {
            this.historyList.splice(index, 1);
            this.saveHistory();
            common_vendor.index.showToast({
              title: "已删除",
              icon: "success"
            });
          }
        }
      });
    },
    clearAllHistory() {
      common_vendor.index.showModal({
        title: "确认清空",
        content: "确定要清空所有历史记录吗？此操作不可恢复。",
        success: (res) => {
          if (res.confirm) {
            this.historyList = [];
            this.saveHistory();
            common_vendor.index.showToast({
              title: "已清空",
              icon: "success"
            });
          }
        }
      });
    },
    saveHistory() {
      try {
        common_vendor.index.setStorageSync("bazi_history", this.historyList);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/history/history.vue:137", "保存历史记录失败:", error);
      }
    },
    goToInput() {
      common_vendor.index.navigateTo({
        url: "/pages/input/input"
      });
    },
    formatBirthDate(solarDate) {
      return `${solarDate.year}年${solarDate.month}月${solarDate.day}日`;
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
      if (diffDays === 0) {
        return "今天";
      } else if (diffDays === 1) {
        return "昨天";
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.historyList.length === 0
  }, $data.historyList.length === 0 ? {
    b: common_vendor.o((...args) => $options.goToInput && $options.goToInput(...args))
  } : {
    c: common_vendor.f($data.historyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.data.gender === "男" ? "👨" : "👩"),
        b: common_vendor.t(item.data.gender),
        c: common_vendor.o(($event) => $options.deleteItem(index), item.id),
        d: common_vendor.f(item.data.baziString, (pillar, pos, i1) => {
          return {
            a: common_vendor.t(pillar),
            b: pos
          };
        }),
        e: common_vendor.t($options.formatBirthDate(item.data.birthDate.solar)),
        f: common_vendor.t(item.data.analysis.qiangRuo.level),
        g: common_vendor.t(item.data.analysis.geJu.name),
        h: common_vendor.t($options.formatTimestamp(item.timestamp)),
        i: item.id,
        j: common_vendor.o(($event) => $options.viewResult(item), item.id)
      };
    })
  }, {
    d: $data.historyList.length > 0
  }, $data.historyList.length > 0 ? {
    e: common_vendor.o((...args) => $options.clearAllHistory && $options.clearAllHistory(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b2d018fa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/history.js.map
