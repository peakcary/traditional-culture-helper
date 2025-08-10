"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_baziCalculator = require("../../utils/bazi-calculator.js");
const _sfc_main = {
  data() {
    return {
      form: {
        gender: "男",
        isLunar: false,
        date: "",
        time: "",
        year: (/* @__PURE__ */ new Date()).getFullYear(),
        month: (/* @__PURE__ */ new Date()).getMonth() + 1,
        day: (/* @__PURE__ */ new Date()).getDate(),
        hour: 12,
        minute: 0
      },
      showDateModal: false,
      showTimeModal: false,
      loading: false
    };
  },
  computed: {
    dateDisplayText() {
      if (!this.form.date) {
        return "请选择出生日期";
      }
      const date = new Date(this.form.date);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    },
    timeDisplayText() {
      if (!this.form.time) {
        return "请选择出生时间";
      }
      const [hour, minute] = this.form.time.split(":");
      return `${hour}时${minute}分 (${this.getShiChenName(parseInt(hour))})`;
    },
    isFormValid() {
      return this.form.gender && this.form.date && this.form.time;
    }
  },
  onLoad() {
    const now = /* @__PURE__ */ new Date();
    this.form.date = now.toISOString().split("T")[0];
    this.form.time = "12:00";
  },
  methods: {
    selectGender(gender) {
      this.form.gender = gender;
    },
    selectCalendar(isLunar) {
      this.form.isLunar = isLunar;
    },
    showDatePicker() {
      this.showDateModal = true;
    },
    showTimePicker() {
      this.showTimeModal = true;
    },
    onDateChange(e) {
      this.form.date = e.detail.value;
      this.showDateModal = false;
    },
    onTimeChange(e) {
      this.form.time = e.detail.value;
      this.showTimeModal = false;
    },
    getShiChenName(hour) {
      const shiChen = [
        "子时",
        "丑时",
        "寅时",
        "卯时",
        "辰时",
        "巳时",
        "午时",
        "未时",
        "申时",
        "酉时",
        "戌时",
        "亥时"
      ];
      const index = Math.floor((hour + 1) / 2) % 12;
      return shiChen[index];
    },
    async calculateBazi() {
      if (!this.isFormValid) {
        common_vendor.index.showToast({
          title: "请完善信息",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const [hour, minute] = this.form.time.split(":");
        const birthDateTime = /* @__PURE__ */ new Date(`${this.form.date}T${this.form.time}:00`);
        const baziResult = utils_baziCalculator.BaziCalculator.calculateBazi(
          birthDateTime,
          this.form.gender,
          this.form.isLunar
        );
        this.saveBaziHistory(baziResult);
        common_vendor.index.navigateTo({
          url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(baziResult))}`
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/input/input.vue:230", "计算八字失败:", error);
        common_vendor.index.showToast({
          title: "计算失败，请重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    saveBaziHistory(baziResult) {
      try {
        let history = common_vendor.index.getStorageSync("bazi_history") || [];
        const record = {
          id: Date.now(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          data: baziResult
        };
        history.unshift(record);
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        common_vendor.index.setStorageSync("bazi_history", history);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/input/input.vue:260", "保存历史记录失败:", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.gender === "男" ? 1 : "",
    b: common_vendor.o(($event) => $options.selectGender("男")),
    c: $data.form.gender === "女" ? 1 : "",
    d: common_vendor.o(($event) => $options.selectGender("女")),
    e: !$data.form.isLunar ? 1 : "",
    f: common_vendor.o(($event) => $options.selectCalendar(false)),
    g: $data.form.isLunar ? 1 : "",
    h: common_vendor.o(($event) => $options.selectCalendar(true)),
    i: common_vendor.t($options.dateDisplayText),
    j: common_vendor.o((...args) => $options.showDatePicker && $options.showDatePicker(...args)),
    k: common_vendor.t($options.timeDisplayText),
    l: common_vendor.o((...args) => $options.showTimePicker && $options.showTimePicker(...args)),
    m: common_vendor.o((...args) => $options.calculateBazi && $options.calculateBazi(...args)),
    n: !$options.isFormValid,
    o: $data.showDateModal
  }, $data.showDateModal ? {
    p: $data.form.date,
    q: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    r: common_vendor.o(($event) => $data.showDateModal = false)
  } : {}, {
    s: $data.showTimeModal
  }, $data.showTimeModal ? {
    t: $data.form.time,
    v: common_vendor.o((...args) => $options.onTimeChange && $options.onTimeChange(...args)),
    w: common_vendor.o(($event) => $data.showTimeModal = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5f77f353"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/input/input.js.map
