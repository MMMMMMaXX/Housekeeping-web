import { login, logout, getInfo, findUserDetailsById, deleteById, saveOrUpdate, addUserWidthRole } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userId: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  roleIds: [],
  user: {},
  // 查看详情的用户
  current_d: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE_IDS: (state, roleIds) => {
    state.roleIds = roleIds
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_CURRENT_D(state, payload) {
    state.current_d = payload
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_USER', data)
        const { realname: name, userFace: avatar, introduction, id } = data
        // [{id:1,name:"编辑"},{id:2,name:"管理员"}]
        const roles = data.roles.map(item => item.name)
        const roleIds = data.roles.map(item => item.id)
        commit('SET_ROLE_IDS', roleIds)
        // roles must be a non-empty array
        roles.push('admin')
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_USER_ID', id)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },
  /**
   * @description: 通过id获取用户信息
   * @param {*} commit
   * @param {*} payload
   * @return {*}
   */
  async findUserById({ commit }, payload) {
    const res = await findUserDetailsById(payload)
    commit('SET_CURRENT_D', res.data)
  },
  /**
   * @description: 保存或更新用户基本信息，不包括角色信息
   * @param {*} commit
   * @param {*} payload
   * @return {*}
   */
  async saveOrUpdate({ commit }, payload) {
    await saveOrUpdate(payload)
  },
  /**
 * @description: 通过id删除用户
 * @param {*}
 * @return {*}
 */
  async deleteById({ commit }, payload) {
    await deleteById(payload)
  },
  /**
    * @description: 保存顾客信息和角色信息
    * @param {*}
    * @return {*}
    */
  async addUserWidthRole({ commit }, payload) {
    await addUserWidthRole(payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
