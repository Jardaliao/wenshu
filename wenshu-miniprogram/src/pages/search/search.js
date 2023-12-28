import { queryDoc } from "../../utils/bussiness"
import { uuid, random } from "../../utils/wenshu_raw"

Page({
  data: {
    pageId: "",
    requestToken: "",

    input: ""
  },
  inputChange(e) { this.setData({ input: e.detail.value }) },
  search() {
    const pageId = uuid() // 生成pageId，需要传给后面的列表页面用
    const requestToken = random() // 生成requestToken，需要传给后面的列表页面用
    this.setData({ pageId, requestToken })

    queryDoc({
      pageId, requestToken,
      sortFields: "s50:desc",
      queryCondition: JSON.stringify([{ key: "s21", value: this.data.input }]) // 暂定s21
    }, {
      s21: this.data.input
    }).then(data => {
      console.log(data)
    }).catch(err => console.error(err))
  }
})