import { checkLogin, currentUser, wsCountSearch } from '../../utils/bussiness'
import { uuid, random } from '../../utils/wenshu_raw'
import { setDataSync } from '../../utils/utils'

Page({
  data: {
    statistic: {
      WS_T_taj: "", // 今日新增
    },
    tabs: [],
    activeTab: 0,
  },
  async onLoad() {
    const pageId = uuid() // 生成pageId，需要传给后面的列表页面用
    const requestToken = random() // 生成requestToken，需要传给后面的列表页面用
    setDataSync(this, { pageId, requestToken })

    await checkLogin() // 登录
    const r = await wsCountSearch({ requestToken })
    setDataSync(this, { statistic: { ...this.data.statistic, ...r.data.result } })

    const current = await currentUser({ pageId, requestToken, extra: {} }) // 保持Session？
    if (current?.data?.result?.userId === "anonymousUser") {
      console.error(`[error] 匿名用户`);
    }

    const titles = ['全国判决书查询']
    const tabs = titles.map(item => ({ title: item }))
    this.setData({ tabs })

  },
  search() { wx.navigateTo({ url: '/pages/search/search' }) },

  onTabCLick(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
  }
})
