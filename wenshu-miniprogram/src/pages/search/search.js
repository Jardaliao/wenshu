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
      wenshuleixingIndex: 0,
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
      showTopTips: false,
      radioItems: [{ name: 'cell standard', value: '0', checked: true }, { name: 'cell standard', value: '1' }],
      checkboxItems: [{
        name: 'standard is dealt for u.',
        value: '0',
        checked: true
      }, { name: 'standard is dealicient for u.', value: '1' }],
      items: [{ name: 'USA', value: '美国' }, { name: 'CHN', value: '中国', checked: 'true' }, {
        name: 'BRA',
        value: '巴西'
      }, { name: 'JPN', value: '日本' }, { name: 'ENG', value: '英国' }, { name: 'TUR', value: '法国' },],

      date: "2016-09-01",
      time: "12:01",

      countryCodes: ["全文", "首部", "当事人段", "诉讼记录", "事实", "理由", "判决结果", "尾部", "其他"],
      countryCodeIndex: 0,

      countries: ["中国", "美国", "英国"],
      countryIndex: 0,

      accounts: ["微信号", "QQ", "Email"],
      accountIndex: 0,

      isAgree: false,
      formData: {},
      rules: [{
        name: 'radio', rules: { required: false, message: '单选列表是必选项' },
      }, {
        name: 'checkbox', rules: { required: true, message: '多选列表是必选项' },
      }, {
        name: 'name', rules: { required: true, message: '请输入姓名' },
      }, {
        name: 'qq', rules: { required: true, message: 'qq必填' },
      }, {
        name: 'mobile',
        rules: [{ required: true, message: 'mobile必填' }, { mobile: true, message: 'mobile格式不对' }],
      }, {
        name: 'vcode', rules: { required: true, message: '验证码必填' },
      }, {
        name: 'idcard', rules: {
          validator: function (rule, value, param, modeels) {
            if (!value || value.length !== 18) {
              return 'idcard格式不正确'
            }
          }
        },
      }]
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