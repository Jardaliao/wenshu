import { uuid, random } from "../../utils/wenshu_raw"
import { setDataSync } from "../../utils/utils"
import { currentUser, quanwenjiansuo, fayuancengji } from "../../utils/bussiness"
import { dic } from "../../utils/wenshu_dict"

Page({
  data: {
    pageId: "",
    requestToken: "",
    dic,
    query: {
      input: "",
      quanwenjiansuoIndex: 0,
      anyouId: "",
      fayuancengjiIndex: 0,
      anjianleixingIndex: -1,
      shenpanchengxuId: "",
      wenshuleixingIndex: 0,
      cprqStart: '',
      cprqEnd: '',
      anlidengjiIndex: -1,
      gongkaileixingIndex: -1,
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
    scrollStart: 200,
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
        that.setData({['scrollStart']: rect.bottom})
      } else {
        console.error('未找到元素');
      }
    }).exec();
  },
  inputChange(e) { this.setData({ 'query.input': e.detail.value }) },
  async search() {
    const pageId = uuid() // 生成pageId，需要传给后面的列表页面用
    const requestToken = random() // 生成requestToken，需要传给后面的列表页面用
    await currentUser({ pageId, requestToken, extra: { s21: this.data.query.input } })
    setDataSync(this, { pageId, requestToken })

    wx.navigateTo({ url: `/pages/list/list?data=${JSON.stringify(this.data)}` })
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
  bindAnjianleixingChange(e) { this.setData({ ['query.anjianleixingIndex']: e.currentTarget.dataset.index }) },
  bindAnlidengjiChange(e) { this.setData({ ['query.anlidengjiIndex']: e.currentTarget.dataset.index }) },
  bindGongkaileixingChange(e) { this.setData({ ['query.gongkaileixingIndex']: e.currentTarget.dataset.index }) },
  bindWenshuleixingChange(e) { this.setData({ ['query.wenshuleixingIndex']: e.currentTarget.dataset.index }) },
  bindCprqStartChange(e) { this.setData({ ['query.cprqStart']: e.detail.value }) },
  bindCprqEndChange(e) { this.setData({ ['query.cprqEnd']: e.detail.value }) },
})