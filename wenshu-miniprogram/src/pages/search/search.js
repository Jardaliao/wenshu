import { uuid, random } from "../../utils/wenshu_raw"
import { setDataSync } from "../../utils/utils"

Page({
  data: {
    pageId: "",
    requestToken: "",

    query: {
      input: ""
    }
  },
  inputChange(e) { this.setData({ input: e.detail.value }) },
  search() {
    const pageId = uuid() // 生成pageId，需要传给后面的列表页面用
    const requestToken = random() // 生成requestToken，需要传给后面的列表页面用
    setDataSync({ pageId, requestToken })

    wx.navigateTo({ url: `/pages/list/list?data=${JSON.stringify(this.data)}` })
  }
})