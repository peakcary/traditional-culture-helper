"use strict";
const common_vendor = require("../common/vendor.js");
const useBaziStore = common_vendor.defineStore("bazi", () => {
  const currentBaziData = common_vendor.ref(null);
  const baziHistory = common_vendor.ref([]);
  const isCalculating = common_vendor.ref(false);
  const hasCurrentData = common_vendor.computed(() => currentBaziData.value !== null);
  const historyCount = common_vendor.computed(() => baziHistory.value.length);
  const latestHistory = common_vendor.computed(() => {
    return baziHistory.value.slice(0, 5);
  });
  const setBaziData = (data) => {
    currentBaziData.value = data;
    if (data) {
      addToHistory(data);
    }
  };
  const addToHistory = (data) => {
    const historyItem = {
      id: Date.now(),
      data: { ...data },
      timestamp: /* @__PURE__ */ new Date(),
      title: generateHistoryTitle(data)
    };
    const exists = baziHistory.value.some(
      (item) => {
        var _a, _b;
        return ((_a = item.data.baziString) == null ? void 0 : _a.join("")) === ((_b = data.baziString) == null ? void 0 : _b.join(""));
      }
    );
    if (!exists) {
      baziHistory.value.unshift(historyItem);
      if (baziHistory.value.length > 50) {
        baziHistory.value = baziHistory.value.slice(0, 50);
      }
      saveHistoryToStorage();
    }
  };
  const removeFromHistory = (id) => {
    const index = baziHistory.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      baziHistory.value.splice(index, 1);
      saveHistoryToStorage();
    }
  };
  const clearHistory = () => {
    baziHistory.value = [];
    common_vendor.index.removeStorageSync("bazi_history");
  };
  const loadHistoryFromStorage = () => {
    try {
      const stored = common_vendor.index.getStorageSync("bazi_history");
      if (stored) {
        baziHistory.value = JSON.parse(stored).map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/baziStore.js:83", "加载历史记录失败:", error);
    }
  };
  const saveHistoryToStorage = () => {
    try {
      common_vendor.index.setStorageSync("bazi_history", JSON.stringify(baziHistory.value));
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/baziStore.js:91", "保存历史记录失败:", error);
    }
  };
  const generateHistoryTitle = (data) => {
    if (!data || !data.pillars)
      return "未知记录";
    const { year, month, day, hour } = data.pillars;
    const baziStr = `${year.gan}${year.zhi} ${month.gan}${month.zhi} ${day.gan}${day.zhi} ${hour.gan}${hour.zhi}`;
    const gender = data.gender || "未知";
    return `${gender}命 ${baziStr}`;
  };
  const setCalculating = (status) => {
    isCalculating.value = status;
  };
  const init = () => {
    loadHistoryFromStorage();
  };
  return {
    // 状态
    currentBaziData,
    baziHistory,
    isCalculating,
    // 计算属性
    hasCurrentData,
    historyCount,
    latestHistory,
    // 方法
    setBaziData,
    addToHistory,
    removeFromHistory,
    clearHistory,
    setCalculating,
    init
  };
});
exports.useBaziStore = useBaziStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/baziStore.js.map
