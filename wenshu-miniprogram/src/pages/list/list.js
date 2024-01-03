import { queryDoc } from "../../utils/bussiness";
import { setDataSync } from "../../utils/utils";

Page({
  data: {
    theme: "light",
    pageId: "", // 维持在整个查询周期
    pageNum: 1,
    pageSize: 5,
    query: { input: "罗翔" }, // 整个查找对象
    list: [], // 页面展示列表
    result: {}
  },
  //options(Object)
  async onLoad(options) {
    this.computeScrollViewHeight()
    await this.nextPage()
    if (options.data) {
      const initData = JSON.parse(options.data)
      delete initData["__webviewId__"] // 不知道干啥用的 删掉它
      await setDataSync(this, { ...this.data, ...initData })
    }
  },
  async reachLower() {
    const { count, pageNum, pageSize } = this.data
    if (count && pageNum * pageSize > count) {
      return
    }
    await this.nextPage()
  },
  nextPage() {
    const that = this
    const { pageId, requestToken, query } = this.data
    return new Promise((resolve, reject) => {
      queryDoc({
        pageId, requestToken,
        sortFields: "s50:desc",
        queryCondition: JSON.stringify([{ key: "s21", value: query.input }]), // 暂定s21
      }, {
        s21: query.input
      }).then(async resp => {
        console.log(resp)
        await setDataSync(that, { result: resp.data.result, pageNum: that.data.pageNum + 1, count: resp.data.result.queryResult.resultCount })
        await setDataSync(that, { list: [...that.data.list, ...that.result2List(resp.data.result)] })
        resolve()
      }).catch(err => reject(err))
    })
  },
  result2List(result) {
    const list = result.queryResult.resultList
    for (let item of list) {
      item["relWenshu"] = result.relWenshu[item["rowkey"]]
    }
    return list
  },
  computeScrollViewHeight() {
    let query = wx.createSelectorQuery().in(this)
    query.select('.searchbar').boundingClientRect()
    query.exec(res => {
      // console.log(res) 
      const { top, height } = res[0]
      let windowHeight = wx.getSystemInfoSync().windowHeight
      this.setData({ scrollHeight: windowHeight - top - height })
    })
  },
  detail(e) {
    const {rowkey} = e.currentTarget.dataset.item
    wx.navigateTo({ url: `/pages/doc/doc?data=${JSON.stringify({ rowkey })}` })
  }
});