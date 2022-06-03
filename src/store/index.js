import Vue from 'vue'
import Vuex from 'vuex'

import _ from "lodash"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tableData: {},
    tableDataWithError: {}
  },

  getters: {
    tableData: state => {
      return state.tableData;
    },

    tableDataById: state => tableId => {
      return _.get(state.tableData, tableId);
    },

    tableDataWithError: state => {
      return state.tableDataWithError;
    },

    tableDataWithErrorById: state => tableId => {
      return _.get(state.tableDataWithError, tableId);
    },
  },

  mutations: {
    setTableData(state, { data, tableId }) {
      Vue.set(state.tableData, tableId, data);
    },
    resetTableData(state) {
      state.tableData = {};
    },
    setTableDataWithError(state, { data, tableId }) {
      Vue.set(state.tableDataWithError, tableId, data);
    },
    resetTableDataWithError(state) {
      state.tableDataWithError = {};
      for (const [key, value] of Object.entries(state.tableData)) {
        Vue.set(state.tableDataWithError, key, value);
      }
    }
  },

  actions: {
    setTableData({ commit }, { data, tableId }) {
      commit("setTableData", { data, tableId });
    },
    resetTableData({ commit }) {
      commit("resetTableData");
    },
    setTableDataWithError({ commit }, { data, tableId }) {
      commit("setTableDataWithError", { data, tableId });
    },
    resetTableDataWithError({ commit }) {
      commit("resetTableDataWithError");
    }
  }
})