import Vue from 'vue'
import Vuex from 'vuex'

import _ from "lodash"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tableData: {}
  },

  getters: {
    tableData: state => {
      return state.tableData;
    },

    tableDataById: state => tableId => {
      return _.get(state.tableData, tableId);
    }
  },

  mutations: {
    setTableData(state, { data, tableId }) {
      Vue.set(state.tableData, tableId, data);
    }
  },

  actions: {
    setTableData({ commit }, { data, tableId }) {
      commit("setTableData", { data, tableId });
    }
  }
})