"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_fortuneEngine = require("../../utils/fortune-engine.js");
const stores_baziStore = require("../../stores/baziStore.js");
if (!Math) {
  WuxingRadar();
}
const WuxingRadar = () => "../../components/WuxingRadar.js";
const _sfc_main = {
  __name: "result",
  setup(__props) {
    const baziData = common_vendor.ref(null);
    const fortuneData = common_vendor.ref(null);
    const isLoaded = common_vendor.ref(false);
    const baziStore = stores_baziStore.useBaziStore();
    const calculateDetailedFortune = () => {
      if (!baziData.value)
        return;
      fortuneData.value = {
        overall: utils_fortuneEngine.FortuneEngine.analyzeOverallFortune(baziData.value),
        career: utils_fortuneEngine.FortuneEngine.analyzeCareerFortune(baziData.value),
        wealth: utils_fortuneEngine.FortuneEngine.analyzeWealthFortune(baziData.value),
        love: utils_fortuneEngine.FortuneEngine.analyzeLoveFortune(baziData.value),
        health: utils_fortuneEngine.FortuneEngine.analyzeHealthFortune(baziData.value)
      };
      common_vendor.index.__f__("log", "at pages/result/result.vue:290", "运势数据:", fortuneData.value);
    };
    const getScoreClass = (score) => {
      if (score >= 80)
        return "score-excellent";
      if (score >= 65)
        return "score-good";
      if (score >= 40)
        return "score-average";
      return "score-poor";
    };
    const formatBirthDate = (birthDate) => {
      const solar = birthDate.solar;
      const lunar = birthDate.lunar;
      const solarStr = `公历${solar.year}年${solar.month}月${solar.day}日${solar.hour}时`;
      const lunarStr = `农历${lunar.year}${lunar.zodiac}年`;
      return `${solarStr}
${lunarStr}`;
    };
    const getWuXingClass = (wuxing) => {
      const classMap = {
        "木": "wood",
        "火": "fire",
        "土": "earth",
        "金": "metal",
        "水": "water"
      };
      return classMap[wuxing] || "";
    };
    const shareResult = () => {
      generateShareContent();
      common_vendor.wx$1.showShareMenu({
        withShareTicket: true
      });
    };
    const generateShareContent = () => {
      if (!baziData.value)
        return "";
      const pillars = baziData.value.pillars;
      const baziStr = `${pillars.year.gan}${pillars.year.zhi} ${pillars.month.gan}${pillars.month.zhi} ${pillars.day.gan}${pillars.day.zhi} ${pillars.hour.gan}${pillars.hour.zhi}`;
      return `我的八字：${baziStr}
日主${baziData.value.analysis.qiangRuo.level}，${baziData.value.analysis.geJu.name}
来太乙数衍测测你的八字吧！`;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onMounted(() => {
      var _a, _b;
      const instance = common_vendor.getCurrentInstance();
      const options = ((_b = (_a = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a.$scope) == null ? void 0 : _b.options) || {};
      if (options.data) {
        try {
          baziData.value = JSON.parse(decodeURIComponent(options.data));
          common_vendor.index.__f__("log", "at pages/result/result.vue:374", "八字数据:", baziData.value);
          baziStore.setBaziData(baziData.value);
          calculateDetailedFortune();
          setTimeout(() => {
            isLoaded.value = true;
          }, 300);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/result/result.vue:387", "解析八字数据失败:", error);
          common_vendor.index.showToast({
            title: "数据解析失败",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } else {
        common_vendor.index.showToast({
          title: "缺少数据",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(baziData.value.gender === "男" ? "👨" : "👩"),
        b: common_vendor.t(baziData.value.gender),
        c: common_vendor.t(formatBirthDate(baziData.value.birthDate)),
        d: common_vendor.t(baziData.value.pillars.year.gan),
        e: common_vendor.t(baziData.value.pillars.year.zhi),
        f: common_vendor.t(baziData.value.pillars.year.ganWuXing),
        g: common_vendor.t(baziData.value.pillars.year.zhiWuXing),
        h: common_vendor.t(baziData.value.pillars.month.gan),
        i: common_vendor.t(baziData.value.pillars.month.zhi),
        j: common_vendor.t(baziData.value.pillars.month.ganWuXing),
        k: common_vendor.t(baziData.value.pillars.month.zhiWuXing),
        l: common_vendor.t(baziData.value.pillars.day.gan),
        m: common_vendor.t(baziData.value.pillars.day.zhi),
        n: common_vendor.t(baziData.value.pillars.day.ganWuXing),
        o: common_vendor.t(baziData.value.pillars.day.zhiWuXing),
        p: common_vendor.t(baziData.value.pillars.hour.gan),
        q: common_vendor.t(baziData.value.pillars.hour.zhi),
        r: common_vendor.t(baziData.value.pillars.hour.ganWuXing),
        s: common_vendor.t(baziData.value.pillars.hour.zhiWuXing),
        t: common_vendor.p({
          wuxingData: baziData.value.analysis.wuXing.count,
          size: 280
        }),
        v: common_vendor.f(baziData.value.analysis.wuXing.count, (wx2, key, i0) => {
          return {
            a: common_vendor.t(key),
            b: common_vendor.t(wx2.toFixed(1)),
            c: common_vendor.t(baziData.value.analysis.wuXing.level[key]),
            d: key,
            e: common_vendor.n(getWuXingClass(key))
          };
        }),
        w: common_vendor.t(baziData.value.analysis.wuXing.strongest),
        x: common_vendor.t(baziData.value.analysis.wuXing.weakest),
        y: common_vendor.t(baziData.value.analysis.qiangRuo.level),
        z: common_vendor.t(baziData.value.analysis.qiangRuo.score),
        A: common_vendor.t(baziData.value.analysis.qiangRuo.analysis),
        B: common_vendor.t(baziData.value.analysis.yongShen.yongShen.join("、")),
        C: common_vendor.t(baziData.value.analysis.yongShen.jiShen.join("、")),
        D: common_vendor.t(baziData.value.analysis.yongShen.analysis),
        E: common_vendor.t(baziData.value.analysis.geJu.name),
        F: common_vendor.t(baziData.value.analysis.geJu.level),
        G: common_vendor.t(baziData.value.analysis.geJu.description),
        H: fortuneData.value
      }, fortuneData.value ? {
        I: common_vendor.t(fortuneData.value.overall.score),
        J: common_vendor.n(getScoreClass(fortuneData.value.overall.score)),
        K: common_vendor.t(fortuneData.value.overall.level),
        L: common_vendor.t(fortuneData.value.overall.description),
        M: common_vendor.t(fortuneData.value.overall.analysis),
        N: common_vendor.t(fortuneData.value.career.score),
        O: common_vendor.n(getScoreClass(fortuneData.value.career.score)),
        P: common_vendor.t(fortuneData.value.career.level),
        Q: common_vendor.t(fortuneData.value.career.description),
        R: common_vendor.t(fortuneData.value.wealth.score),
        S: common_vendor.n(getScoreClass(fortuneData.value.wealth.score)),
        T: common_vendor.t(fortuneData.value.wealth.level),
        U: common_vendor.t(fortuneData.value.wealth.description),
        V: common_vendor.t(fortuneData.value.love.score),
        W: common_vendor.n(getScoreClass(fortuneData.value.love.score)),
        X: common_vendor.t(fortuneData.value.love.level),
        Y: common_vendor.t(fortuneData.value.love.description),
        Z: common_vendor.t(fortuneData.value.health.score),
        aa: common_vendor.n(getScoreClass(fortuneData.value.health.score)),
        ab: common_vendor.t(fortuneData.value.health.level),
        ac: common_vendor.t(fortuneData.value.health.description),
        ad: common_vendor.f(fortuneData.value.overall.suggestions, (suggestion, index, i0) => {
          return {
            a: common_vendor.t(suggestion),
            b: index
          };
        })
      } : {}, {
        ae: common_vendor.o(shareResult),
        af: common_vendor.o(goBack),
        ag: isLoaded.value ? 1 : ""
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b615976f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/result/result.js.map
