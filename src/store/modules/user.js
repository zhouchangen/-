import { getUUID } from '@/utils'
export default {
    namespaced: true,
    state: {
        id: 0,
        name: ''
    },
    mutations: {
        updateId(state, id) {
            state.id = id
        },
        updateName(state, name) {
            state.name = name
        },

    },
    actions: {
        getUID() {
            commit('SET_UUID', getUUID())
        }
    }
}