import { queryDoc } from "../../utils/bussiness";
import { setDataSync } from "../../utils/utils";
import { dic } from "../../utils/wenshu_dict"

Page({
  data: {
    theme: "light",
    pageId: "", // 维持在整个查询周期
    pageNum: 1,
    pageSize: 10,
    sortFields: 0,
    sortOps: [{
      name: "法院层级",
      key: "s50",
      asc: false, // 默认降序
    }, {
      name: "裁判日期",
      key: "s51",
      asc: false,
    }, {
      name: "审判程序",
      key: "s52",
      asc: false,
    }],
    query: {}, // 整个查找对象
    list: [], // 页面展示列表
    result: {}
  },
  async sortChange(e) {
    wx.showLoading({ title: '加载中', mask: true })
    const { sortFields, sortOps } = this.data;
    if (sortFields === e.currentTarget.dataset.index) { // 调整升降序
      const { asc } = sortOps[sortFields];
      await setDataSync(this, { [`sortOps[${sortFields}].asc`]: !asc })
    } else { // 切换排序字段
      await setDataSync(this, { ['sortFields']: e.currentTarget.dataset.index })
    }
    await setDataSync(this, { pageNum: 1, list: [], result: [] })
    await this.nextPage()
    wx.hideLoading()
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
    // console.log(pageNum)
    await this.nextPage()
  },
  nextPage() {
    const that = this
    const { pageId, pageNum, requestToken, query } = this.data
    return new Promise((resolve, reject) => {
      queryDoc({
        pageId, pageNum, requestToken,
        sortFields: `${that.data.sortOps[that.data.sortFields].key}:${that.data.sortOps[that.data.sortFields].asc ? "asc" : "desc"}`,
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
    if (query.shenpanchengxuId) {
      queryCondition.push({
        key: "s10",
        value: query.shenpanchengxuId
      })
    }
    // 9 文书类型
    if (query.wenshuleixingIndex >= 0) {
      queryCondition.push({
        key: "s6",
        value: dic.wslx[query.wenshuleixingIndex].code
      })
    }
    // 10 裁判日期开始 & 结束时间
    const cprqStart = query.cprqStart ? query.cprqStart : '1900-01-01',
      cprqEnd = query.cprqEnd ? query.cprqEnd : '2099-01-01';
    queryCondition.push({
      key: "cprq",
      value: `${cprqStart} TO ${cprqEnd}`
    })
    // 11 案例等级
    if (query.anlidengjiIndex >= 0) {
      queryCondition.push({
        key: "s44",
        value: dic.aldj[query.anlidengjiIndex].code
      })
    }
    // 12 公开类型
    if (query.gongkaileixingIndex >= 0) {
      queryCondition.push({
        key: "s43",
        value: dic.gklx[query.gongkaileixingIndex].code
      })
    }
    // 13 审判人员
    if (query.shenpanrenyuan) {
      queryCondition.push({
        key: "s18",
        value: query.shenpanrenyuan
      })
    }
    // 14 当事人
    if (query.dangshiren) {
      queryCondition.push({
        key: "s17",
        value: query.dangshiren
      })
    }
    // 15 律所
    if (query.lvsuo) {
      queryCondition.push({
        key: "s20",
        value: query.lvsuo
      })
    }
    // 16 律师
    if (query.lvshi) {
      queryCondition.push({
        key: "s19",
        value: query.lvshi
      })
    }
    // 17 法律依据
    if (query.falvyiju) {
      queryCondition.push({
        key: "s29",
        value: query.falvyiju
      })
    }

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
    query.select('.sort-area').boundingClientRect()
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