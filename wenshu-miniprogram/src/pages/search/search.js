import { uuid, random } from "../../utils/wenshu_raw"
import { setDataSync } from "../../utils/utils"
import { currentUser } from "../../utils/bussiness"
import { dic } from "../../utils/wenshu_dict"

Page({
  data: {
    dic,
    pageId: "",
    requestToken: "",
    query: {
      quanwenjiansuo: "",
      quanwenjiansuoIndex: 0,
      anyouId: "",
      anjianmingcheng: "",
      anhao: "",
      fayuanmingcheng: "",
      fayuancengjiIndex: -1,
      anjianleixingIndex: -1,
      shenpanchengxuId: "",
      wenshuleixingIndex: -1,
      cprqStart: '',
      cprqEnd: '',
      anlidengjiIndex: -1,
      gongkaileixingIndex: -1,
      shenpanrenyuan: "",
      dangshiren: "",
      lvsuo: "",
      lvshi: "",
      falvyiju: "",
    },
    dataSample: {
      quanwenjiansuo: "",
      quanwenjiansuoIndex: 0,
      anyouId: "",
      anjianmingcheng: "",
      anhao: "",
      fayuanmingcheng: "",
      fayuancengjiIndex: -1,
      anjianleixingIndex: -1,
      shenpanchengxuId: "",
      wenshuleixingIndex: -1,
      cprqStart: '',
      cprqEnd: '',
      anlidengjiIndex: -1,
      gongkaileixingIndex: -1,
      shenpanrenyuan: "",
      dangshiren: "",
      lvsuo: "",
      lvshi: "",
      falvyiju: "",
    },
    scrollStart: 0,
    footer: 0,
    multipleSelect: async (e) => {
      // console.log(e);
      const { node: { id, children, checked }, allChoice } = e;
      if (checked && (allChoice?.length || children?.length)) {
        await wx.showToast({ title: '不支持选择多个', icon: 'error', mask: true, duration: 2000 });
        return true
      }
      return false;
    },
  },
  async onLoad(e) {
    const that = this;
    let query = wx.createSelectorQuery();
    query.select('.searchbar').boundingClientRect(rect => {
      if (rect) {
        that.setData({ ['scrollStart']: rect.bottom })
      } else {
        console.error('未找到元素scrollStart');
      }
    }).exec();
    query.select('.footer').boundingClientRect(rect => {
      if (rect) {
        that.setData({ ['footer']: rect.height })
      } else {
        console.error('未找到元素footer');
      }
    }).exec();
  },
  async search() {
    const pageId = uuid() // 生成pageId，需要传给后面的列表页面用
    const requestToken = random() // 生成requestToken，需要传给后面的列表页面用
    await currentUser({
      pageId, requestToken,
      // extra: { s21: this.data.query.input }
    })
    setDataSync(this, {
      ['pageId']: pageId,
      ['requestToken']: requestToken
    })

    wx.navigateTo({ url: `/pages/list/list?data=${JSON.stringify({ query: this.data.query, pageId, requestToken })}` })
  },
  async reset() { this.setData({ ['query']: this.data.dataSample }) },
  bindQuanwenjiansuoChange(e) { this.setData({ ['query.quanwenjiansuoIndex']: e.currentTarget.dataset.index }) },
  async bindAnyouChange(e) {
    // console.log(e.detail);
    if (e?.detail?.idList?.length) {
      setDataSync(this, { ['query.anyouId']: e.detail.idList[0] })
      return
    }
    setDataSync(this, { ['query.anyouId']: "" })
  },
  async bindShenpanchengxuChange(e) {
    // console.log(e.detail);
    if (e?.detail?.idList?.length) {
      setDataSync(this, { ['query.shenpanchengxuId']: e.detail.idList[0] });
      return;
    }
    setDataSync(this, { ['query.shenpanchengxuId']: "" })
  },
  bindFayuancengjiChange(e) { this.setData({ ['query.fayuancengjiIndex']: e.currentTarget.dataset.index }) },
  bindAnjianleixingChange(e) {
    this.setData({
      ['query.anjianleixingIndex']: e.currentTarget.dataset.index,
      ['query.shenpanchengxuId']: "",
    })
  },
  bindAnlidengjiChange(e) { this.setData({ ['query.anlidengjiIndex']: e.currentTarget.dataset.index }) },
  bindGongkaileixingChange(e) { this.setData({ ['query.gongkaileixingIndex']: e.currentTarget.dataset.index }) },
  bindWenshuleixingChange(e) { this.setData({ ['query.wenshuleixingIndex']: e.currentTarget.dataset.index }) },
  bindCprqStartChange(e) { this.setData({ ['query.cprqStart']: e.detail.value }) },
  bindCprqEndChange(e) { this.setData({ ['query.cprqEnd']: e.detail.value }) },

  quanwenjiansuoChange(e) { this.setData({ ['query.quanwenjiansuo']: e.detail.value }) },
  anjianmingchengChange(e) { this.setData({ ['query.anjianmingcheng']: e.detail.value }) },
  anhaoChange(e) { this.setData({ ['query.anhao']: e.detail.value }) },
  fayuanmingchengChange(e) { this.setData({ ['query.fayuanmingcheng']: e.detail.value }) },
  shenpanrenyuanChange(e) { this.setData({ ['query.shenpanrenyuan']: e.detail.value }) },
  dangshirenChange(e) { this.setData({ ['query.dangshiren']: e.detail.value }) },
  lvsuoChange(e) { this.setData({ ['query.lvsuo']: e.detail.value }) },
  lvshiChange(e) { this.setData({ ['query.lvshi']: e.detail.value }) },
  falvyijuChange(e) { this.setData({ ['query.falvyiju']: e.detail.value }) },
})