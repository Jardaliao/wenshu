import { queryDoc } from "../../utils/bussiness";
import { setDataSync } from "../../utils/utils";

Page({
    data: {
        pageId: "", // 维持在整个查询周期
        query: {}, // 整个查找对象
    },
    //options(Object)
    async onLoad(options) {
        if (options.data) await setDataSync({ ...this.data, ...options.data })

        const { pageId, requestToken, query } = this.data
        queryDoc({
            pageId, requestToken,
            sortFields: "s50:desc",
            queryCondition: JSON.stringify([{ key: "s21", value: query.input }]) // 暂定s21
        }, {
            s21: query.input
        }).then(data => {
            console.log(data)
        }).catch(err => console.error(err))
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },
    onPageScroll: function () {

    },
    //item(index,pagePath,text)
    onTabItemTap: function (item) {

    }
});