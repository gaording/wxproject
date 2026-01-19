import { default as localStorage } from "./utils/localStorage";
import { LICENSE_KEY, APP_ID, authFunc } from "./utils/auth.js";
import i18n from "./utils/i18n.js";
var { authorize } = requirePlugin("webarPlugin");

App({
  async onLaunch() {
    const { theme, language } = wx.getSystemInfoSync();
    this.globalData.theme = theme || "light";
    // 根据用户设置语言类型判断
    if (language.includes("zh")) {
      i18n.lang = "zh"; // todo: debug
    } else {
      i18n.lang = "en";
    }
    this.globalData.language = i18n.lang;
    console.log("app theme", theme, i18n.lang);
    const { getEffectList, getFilterList } = await authorize(
      LICENSE_KEY,
      APP_ID,
      () => authFunc(),
      i18n.lang
    );
    const getPreEffectList = () =>
      new Promise(async (resolve, reject) => {
        try {
          const effectList = await getEffectList({
            Type: "Preset",
            Label: "美妆",
          });
          // console.log('内置特效美妆', effectList)
          const cache = effectList
            .reverse()
            // .filter(e => e.Label.indexOf('美妆') >= 0)
            .map((f) => ({
              name: f.Name,
              previewImage: f.CoverUrl,
              key: `effect-${f.EffectId}`,
              label: f.Label,
              weight: f.Weight || 0,
            }));
          localStorage.setItem("effect", cache);
          resolve(true);
        } catch (e) {
          console.error(1, e);
          reject(false);
        }
      });
    const getStickerList = () =>
      new Promise(async (resolve, reject) => {
        try {
          const effectList = await getEffectList();
          const cache = effectList
            .filter(
              (e) =>
                e.Label.indexOf("Wechat特效v2") >= 0 ||
                e.Label.indexOf("Wechat特效v3") >= 0
            )
            .map((f) => ({
              name: f.Name,
              previewImage: f.CoverUrl,
              key: `sticker-${f.EffectId}`,
              label: f.Label,
              weight: f.Weight || 0,
            }));
          localStorage.setItem("sticker", cache);
          resolve(true);
        } catch (e) {
          console.error(2, e);
          reject(false);
        }
      });
    const getPreFilterList = () =>
      new Promise(async (resolve, reject) => {
        try {
          const filterList = await getFilterList();
          const cache = filterList.reverse().map((f) => ({
            name: f.Name,
            previewImage: f.CoverUrl,
            key: `filter-${f.EffectId}`,
            weight: f.Weight || 0,
            tag:
              f.Label.indexOf("少女") >= 0 || f.Label.indexOf("少年") >= 0
                ? i18n.t("tag_human")
                : i18n.t("tag_common"),
          }));
          localStorage.setItem("filter", cache);
          // console.log('Wechat特效v2',cache)
          resolve(true);
          // 模拟弱网
          // setTimeout(_=>{
          // },5000)
        } catch (e) {
          reject(false);
        }
      });
    console.log("app onLaunch pre request", +new Date());
    this.globalData.preRequestStatus = "requesting";
    Promise.all([
      getStickerList(),
      getPreEffectList(),
      getPreFilterList(),
    ]).then(
      (_) => {
        this.globalData.preRequestStatus = "success";
      },
      (_) => {
        this.globalData.preRequestStatus = "fail";
      }
    );
  },
  globalData: {
    theme: null,
    language: "zh",
  },
});
