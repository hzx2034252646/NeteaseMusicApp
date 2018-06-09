import Vue from 'vue'
import filters from '~/utils/filter'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

