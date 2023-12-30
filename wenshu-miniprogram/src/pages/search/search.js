import { uuid, random } from "../../utils/wenshu_raw"
import { setDataSync } from "../../utils/utils"
import { currentUser } from "../../utils/bussiness"

Page({
  data: {
    pageId: "",
    requestToken: "",

    query: {
      input: ""
    }
  },
  inputChange(e) { this.setData({ 'query.input': e.detail.value }) },
  async search() {
    const pageId = uuid() // 生成pageId，需要传给后面的列表页面用
    const requestToken = random() // 生成requestToken，需要传给后面的列表页面用
    await currentUser({ pageId, requestToken, extra: { s21: this.data.query.input } })
    setDataSync(this, { pageId, requestToken })

    wx.navigateTo({ url: `/pages/list/list?data=${JSON.stringify(this.data)}` })
  }
})