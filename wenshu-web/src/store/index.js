
import { createStore } from 'vuex'

export default createStore({
    state: {
        keepAliveInclude: ["search", "list"]
    },
    mutations: {
        activeKeepAlive(state, path) { // 将 path 放到 keep-alive 标签中
            if (!state.keepAliveInclude.includes(path)) {
                state.keepAliveInclude.push(path)
            }
        },
        inactiveKeepAlive(state, path) { // 将 path 从 keep-alive 标签中移除
            state.keepAliveInclude = state.keepAliveInclude.filter(str => str !== path)
        }
    },
    actions: {
    },
    modules: {
    }
})
