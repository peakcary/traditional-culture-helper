"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "WuxingRadar",
  props: {
    wuxingData: {
      type: Object,
      default: () => ({
        "木": 0,
        "火": 0,
        "土": 0,
        "金": 0,
        "水": 0
      })
    },
    size: {
      type: Number,
      default: 300
    }
  },
  emits: ["touch"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const ctx = common_vendor.ref(null);
    const centerX = common_vendor.ref(0);
    const centerY = common_vendor.ref(0);
    const radius = common_vendor.ref(0);
    const initCanvas = () => {
      const context = common_vendor.index.createCanvasContext("wuxingRadar");
      ctx.value = context;
      centerX.value = props.size / 2;
      centerY.value = props.size / 2;
      radius.value = props.size * 0.8 / 2;
    };
    const drawRadar = () => {
      if (!ctx.value)
        return;
      ctx.value.clearRect(0, 0, props.size, props.size);
      drawGrid();
      drawWuxingData();
      drawLabels();
      ctx.value.draw();
    };
    const drawGrid = () => {
      const context = ctx.value;
      const steps = 5;
      context.setLineCap("round");
      context.setLineJoin("round");
      for (let i = 1; i <= steps; i++) {
        const r = radius.value / steps * i;
        context.beginPath();
        context.setStrokeStyle("#e0e6ed");
        context.setLineWidth(1);
        for (let j = 0; j < 5; j++) {
          const angle = j * 2 * Math.PI / 5 - Math.PI / 2;
          const x = centerX.value + r * Math.cos(angle);
          const y = centerY.value + r * Math.sin(angle);
          if (j === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
        context.closePath();
        context.stroke();
      }
      for (let i = 0; i < 5; i++) {
        const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
        const x = centerX.value + radius.value * Math.cos(angle);
        const y = centerY.value + radius.value * Math.sin(angle);
        context.beginPath();
        context.moveTo(centerX.value, centerY.value);
        context.lineTo(x, y);
        context.setStrokeStyle("#e0e6ed");
        context.setLineWidth(1);
        context.stroke();
      }
    };
    const drawWuxingData = () => {
      const context = ctx.value;
      const wuxingOrder = ["木", "火", "土", "金", "水"];
      const maxValue = Math.max(...Object.values(props.wuxingData), 1);
      context.beginPath();
      context.setFillStyle("rgba(52, 152, 219, 0.3)");
      context.setStrokeStyle("#3498db");
      context.setLineWidth(2);
      wuxingOrder.forEach((wx2, index) => {
        const value = props.wuxingData[wx2] || 0;
        const normalizedValue = value / maxValue;
        const r = radius.value * normalizedValue;
        const angle = index * 2 * Math.PI / 5 - Math.PI / 2;
        const x = centerX.value + r * Math.cos(angle);
        const y = centerY.value + r * Math.sin(angle);
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.closePath();
      context.fill();
      context.stroke();
      wuxingOrder.forEach((wx2, index) => {
        const value = props.wuxingData[wx2] || 0;
        const normalizedValue = value / maxValue;
        const r = radius.value * normalizedValue;
        const angle = index * 2 * Math.PI / 5 - Math.PI / 2;
        const x = centerX.value + r * Math.cos(angle);
        const y = centerY.value + r * Math.sin(angle);
        context.beginPath();
        context.arc(x, y, 4, 0, 2 * Math.PI);
        context.setFillStyle(getWuxingColor(wx2));
        context.fill();
        context.beginPath();
        context.arc(x, y, 4, 0, 2 * Math.PI);
        context.setStrokeStyle("#fff");
        context.setLineWidth(2);
        context.stroke();
      });
    };
    const drawLabels = () => {
      const context = ctx.value;
      const wuxingOrder = ["木", "火", "土", "金", "水"];
      context.setFontSize(14);
      context.setFillStyle("#2c3e50");
      context.setTextAlign("center");
      wuxingOrder.forEach((wx2, index) => {
        const angle = index * 2 * Math.PI / 5 - Math.PI / 2;
        const labelRadius = radius.value + 20;
        const x = centerX.value + labelRadius * Math.cos(angle);
        const y = centerY.value + labelRadius * Math.sin(angle);
        context.fillText(wx2, x, y + 5);
      });
    };
    const getWuxingColor = (wuxing) => {
      const colors = {
        "木": "#2ecc71",
        // 绿色
        "火": "#e74c3c",
        // 红色
        "土": "#f39c12",
        // 橙色
        "金": "#95a5a6",
        // 灰色
        "水": "#3498db"
        // 蓝色
      };
      return colors[wuxing] || "#95a5a6";
    };
    const handleTouch = (e) => {
      emit("touch", e);
      common_vendor.index.__f__("log", "at components/WuxingRadar.vue:212", "Radar touched:", e);
    };
    common_vendor.onMounted(() => {
      common_vendor.nextTick$1(() => {
        initCanvas();
        drawRadar();
      });
    });
    common_vendor.watch(() => props.wuxingData, () => {
      common_vendor.nextTick$1(() => {
        drawRadar();
      });
    }, { deep: true });
    return (_ctx, _cache) => {
      return {
        a: __props.size + "px",
        b: __props.size + "px",
        c: common_vendor.o(handleTouch),
        d: common_vendor.f(__props.wuxingData, (item, key, i0) => {
          return {
            a: getWuxingColor(key),
            b: common_vendor.t(key),
            c: common_vendor.t(item.toFixed(1)),
            d: key,
            e: common_vendor.n("legend-" + key)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ffe5cc1b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/WuxingRadar.js.map
