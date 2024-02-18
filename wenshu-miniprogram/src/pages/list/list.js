import { queryDoc } from "../../utils/bussiness";
import { setDataSync } from "../../utils/utils";
import { dic } from "../../utils/wenshu_dict"

Page({
  data: {
    theme: "light",
    pageId: "", // 维持在整个查询周期
    pageNum: 1,
    pageSize: 5,
    query: {}, // 整个查找对象
    list: [], // 页面展示列表
    result: {}
  },
  //options(Object)
  async onLoad(options) {
    this.computeScrollViewHeight()
    if (options.data) {
      const initData = JSON.parse(options.data)
      delete initData["__webviewId__"] // 不知道干啥用的 删掉它
      await setDataSync(this, { ...this.data, ...initData })
    }
    await this.nextPage()
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
        queryCondition: JSON.stringify(this.query2Request(query)), // 暂定s21
      }, {
        // s21: query.input
      }).then(async resp => {
        console.log(resp)
        await setDataSync(that, { result: resp.data.result, pageNum: that.data.pageNum + 1, count: resp.data.result.queryResult.resultCount })
        await setDataSync(that, { list: [...that.data.list, ...that.result2List(resp.data.result)] })
        resolve()
      }).catch(err => reject(err))
    })
  },
  /**
   * 将查询表单对象转化为实际的查询条件
   * 总共 17 个，一个个来
   * @param {Object} query 查询表单对象
   */
  query2Request(query) {
    const queryCondition = [];
    // 1 全文检索
    if (query.quanwenjiansuo) {
      queryCondition.push({
        key: dic.qw[query.quanwenjiansuoIndex].key,
        value: query.quanwenjiansuo
      })
    }
    // 2 案由
    if (query.anyouId) {
      queryCondition.push({
        key: "s13",
        value: query.anyouId
      })
    }
    // 3 案件名称
    if (query.anjianmingcheng) {
       queryCondition.push({
         key: "s1",
         value: query.anjianmingcheng
       })
    }
    // 4 案号
    if (query.anhao) {
      queryCondition.push({
        key: "s7",
        value: query.anhao
      })
    }
    // 5 法院名称
    if (query.fayuanmingcheng) {
      queryCondition.push({
        key: "s2",
        value: query.fayuanmingcheng
      })
    }
    // 6 法院层级
    if (query.fayuancengjiIndex >= 0) {
      queryCondition.push({
        key: "s4",
        value: dic.fycj[query.fayuancengjiIndex].code
      })
    }
    // 7 案件类型
    if (query.anjianleixingIndex >= 0) {
      queryCondition.push({
        key: "s8",
        value: dic.ajlx[query.anjianleixingIndex].code
      })
    }
    // 8 审判程序
    

    console.log(queryCondition)
    return queryCondition
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
    const { rowkey } = e.currentTarget.dataset.item
    wx.navigateTo({ url: `/pages/doc/doc?data=${JSON.stringify({ rowkey })}` })
  }
});