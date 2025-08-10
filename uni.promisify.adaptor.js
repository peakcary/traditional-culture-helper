// uni-app Vue 3 Promise 适配器
// 用于兼容 Vue 3 的异步操作

uni.addInterceptor({
  returnValue: function(res) {
    if (!(!!res && (typeof res === "object" || typeof res === "function") && typeof res.then === "function")) {
      return res;
    }
    return new Promise(function(resolve, reject) {
      res.then(function(res) {
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  }
});