"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const userInfo = common_vendor.ref(null);
  const settings = common_vendor.ref({
    theme: "auto",
    // auto, light, dark
    defaultCalendar: "solar",
    // solar, lunar
    enableNotifications: true,
    language: "zh-CN"
  });
  const preferences = common_vendor.ref({
    showAnimations: true,
    autoSave: true,
    shareWithWatermark: true
  });
  const isLoggedIn = common_vendor.computed(() => userInfo.value !== null);
  const displayName = common_vendor.computed(() => {
    var _a, _b;
    return ((_a = userInfo.value) == null ? void 0 : _a.nickname) || ((_b = userInfo.value) == null ? void 0 : _b.name) || "游客";
  });
  const avatar = common_vendor.computed(() => {
    var _a;
    return ((_a = userInfo.value) == null ? void 0 : _a.avatar) || "/static/images/default-avatar.png";
  });
  const setUserInfo = (info) => {
    userInfo.value = info;
    saveUserInfoToStorage();
  };
  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings };
    saveSettingsToStorage();
  };
  const updatePreferences = (newPreferences) => {
    preferences.value = { ...preferences.value, ...newPreferences };
    savePreferencesToStorage();
  };
  const logout = () => {
    userInfo.value = null;
    common_vendor.index.removeStorageSync("user_info");
  };
  const saveUserInfoToStorage = () => {
    try {
      if (userInfo.value) {
        common_vendor.index.setStorageSync("user_info", JSON.stringify(userInfo.value));
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/userStore.js:67", "保存用户信息失败:", error);
    }
  };
  const loadUserInfoFromStorage = () => {
    try {
      const stored = common_vendor.index.getStorageSync("user_info");
      if (stored) {
        userInfo.value = JSON.parse(stored);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/userStore.js:78", "加载用户信息失败:", error);
    }
  };
  const saveSettingsToStorage = () => {
    try {
      common_vendor.index.setStorageSync("user_settings", JSON.stringify(settings.value));
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/userStore.js:86", "保存设置失败:", error);
    }
  };
  const loadSettingsFromStorage = () => {
    try {
      const stored = common_vendor.index.getStorageSync("user_settings");
      if (stored) {
        settings.value = { ...settings.value, ...JSON.parse(stored) };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/userStore.js:97", "加载设置失败:", error);
    }
  };
  const savePreferencesToStorage = () => {
    try {
      common_vendor.index.setStorageSync("user_preferences", JSON.stringify(preferences.value));
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/userStore.js:105", "保存偏好设置失败:", error);
    }
  };
  const loadPreferencesFromStorage = () => {
    try {
      const stored = common_vendor.index.getStorageSync("user_preferences");
      if (stored) {
        preferences.value = { ...preferences.value, ...JSON.parse(stored) };
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/userStore.js:116", "加载偏好设置失败:", error);
    }
  };
  const init = () => {
    loadUserInfoFromStorage();
    loadSettingsFromStorage();
    loadPreferencesFromStorage();
  };
  return {
    // 状态
    userInfo,
    settings,
    preferences,
    // 计算属性
    isLoggedIn,
    displayName,
    avatar,
    // 方法
    setUserInfo,
    updateSettings,
    updatePreferences,
    logout,
    init
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/userStore.js.map
