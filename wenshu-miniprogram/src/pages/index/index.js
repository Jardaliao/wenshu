import { checkLogin } from '../../utils/login'
import { wsCountSearch } from '../../utils/bussiness'

Page({
  data: {
    statistic: {
      WS_T_taj: "", // 今日新增
    }
  },
  async onShow() {
    const that = this
    wsCountSearch().then(data => { // 合并结果
      that.setData({ statistic: { ...that.data.statistic, ...data.data.result } })
    }).catch(err => console.error(err))
  },
  async onLoad() {
    await checkLogin() // 登录
    // console.log(await queryDoc({})) // 查询接口
  },
  search() { wx.navigateTo({ url: '/pages/search/search' }) }
})
