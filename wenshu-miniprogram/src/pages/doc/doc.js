import { setDataSync } from "../../utils/utils"

Page({
    data: {
        rowkey: "",
        result1: {
            "s1": "刘少林、薛祖华等生产、销售伪劣产品罪刑事指定管辖管辖决定书",
            "s2": "最高人民法院",
            "s3": "000",
            "s5": "fp0mq9b5UUVZQfu3rI6kgCiIleWo7YQaWY65ACLCLfetGM+sXpMnEcQ34qjNFAcX",
            "s6": "04",
            "s7": "（2023）最高法刑辖377号",
            "s8": "管辖案件",
            "s9": "刑事管辖",
            "s10": "刑事指定管辖",
            "s31": "2023-06-27",
            "s41": "2023-10-11",
            "s43": "01",
            "s22": "中华人民共和国最高人民法院\n指定管辖决定书\n（2023）最高法刑辖377号",
            "s23": "上海市浦东新区人民法院受理的上海市奉贤区人民检察院指控被告人刘少林犯生产、销售伪劣产品罪一案，因该案与重庆市第三中级人民法院正在审理的重庆市人民检察院第三分院指控被告人薛祖华、罗燕、罗翔升犯生产、销售伪劣产品罪案的事实同一，且发生地在重庆市。为便于全案事实的查明",
            "s26": "依照《中华人民共和国刑事诉讼法》第二十六条、第二十七条的规定，本院经审查，决定如下",
            "s27": "指定重庆市第三中级人民法院依照刑事第一审程序对该案进行审判",
            "s28": "二〇二三年六月二十七日",
            "s17": [
                "刘少林",
                "薛祖华",
                "罗燕",
                "罗翔升",
                "重庆市第三中级人民法院",
                "重庆市人民检察院第三分院"
            ],
            "s45": [],
            "s11": [],
            "wenshuAy": [],
            "s47": [
                {
                    "tkx": "第二十六条",
                    "fgmc": "《中华人民共和国刑事诉讼法（2018年）》",
                    "fgid": "4402596"
                },
                {
                    "tkx": "第二十七条",
                    "fgmc": "《中华人民共和国刑事诉讼法（2018年）》",
                    "fgid": "4402596"
                }
            ],
            "relWenshu": [],
            "qwContent": "<!DOCTYPE HTML PUBLIC -//W3C//DTD HTML 4.0 Transitional//EN'><HTML><HEAD><TITLE></TITLE></HEAD><BODY><div style='TEXT-ALIGN: center; LINE-HEIGHT: 25pt; MARGIN: 0.5pt 0cm; FONT-FAMILY: 黑体; FONT-SIZE: 18pt;'>中华人民共和国最高人民法院</div><div style='TEXT-ALIGN: center; LINE-HEIGHT: 25pt; MARGIN: 0.5pt 0cm; FONT-FAMILY: 黑体; FONT-SIZE: 18pt;'>指 定 管 辖 决 定 书</div><div id='1'  style='TEXT-ALIGN: right; LINE-HEIGHT: 25pt; MARGIN: 0.5pt 0cm;  FONT-FAMILY: 宋体;FONT-SIZE: 15pt; '>（2023）最高法刑辖377号</div><div id='2'  style='LINE-HEIGHT: 25pt; TEXT-INDENT: 30pt; MARGIN: 0.5pt 0cm;FONT-FAMILY: 宋体; FONT-SIZE: 15pt;'>上海市浦东新区人民法院受理的上海市奉贤区人民检察院指控被告人刘少林犯生产、销售伪劣产品罪一案，因该案与重庆市第三中级人民法院正在审理的重庆市人民检察院第三分院指控被告人薛祖华、罗燕、罗翔升犯生产、销售伪劣产品罪案的事实同一，且发生地在重庆市。为便于全案事实的查明，依照《中华人民共和国刑事诉讼法》第二十六条、第二十七条的规定，本院经审查，决定如下,本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下本院经审查，决定如下：</div><div id='6'  style='LINE-HEIGHT: 25pt; TEXT-INDENT: 30pt; MARGIN: 0.5pt 0cm;FONT-FAMILY: 宋体; FONT-SIZE: 15pt;'>指定重庆市第三中级人民法院依照刑事第一审程序对该案进行审判。</div><div id='7'  style='TEXT-ALIGN: right; LINE-HEIGHT: 25pt; MARGIN: 0.5pt 36pt 0.5pt 0cm;FONT-FAMILY: 宋体; FONT-SIZE: 15pt;'>二〇二三年六月二十七日</div></BODY></HTML>",
            "directory": [
                "1",
                "2",
                "6",
                "7"
            ],
            "globalNet": "outer",
            "viewCount": "591"
        }
    },
    async onLoad(e) {
        const that = this
        this.computeScrollViewHeight()
        if (e.data) {
            const initData = JSON.parse(e.data)
            delete initData["__webviewId__"] // 不知道干啥用的 删掉它
            await setDataSync(this, { ...this.data, ...initData })
        }
        await this.update(this.data.result1)
    },
    async update(result) { // 将查询的结果 setData
        const {qwContent} = result
        // 1 qwContent 是原始 html，需要把头和尾摘掉，这样 rich-text 才能识别
        result.qwContent = qwContent.replace(/.*?<BODY>/, "").replace(/<\/BODY>.*/, "")
            .replace(/.*?<body>/, "").replace(/<\/body>.*/, "")
            // .replace(result.s7, result.s7 + "<br>")
        await setDataSync(this, { result })
    },
    computeScrollViewHeight() {
        let query = wx.createSelectorQuery().in(this)
        query.select('.header').boundingClientRect()
        query.exec(res => {
          const { top, height } = res[0]
          let windowHeight = wx.getSystemInfoSync().windowHeight
          this.setData({ scrollHeight: windowHeight - top - height })
        })
    },
})