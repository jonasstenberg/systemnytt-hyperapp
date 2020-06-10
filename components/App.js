import { h } from 'hyperapp'

import NavigationBar from './NavigationBar'
import Beverages from './Beverages'

import getQueryParam from '../utils/queryparam'

export default (state, actions) => h('div', {
  oncreate: async () => {
    const local = window.localStorage.getItem(getQueryParam('releaseDate'))
    if (local) {
      actions.restore(JSON.parse(local))
    } else {
      await actions.fetchBeverages()
    }

    actions.pushState(state.route)
  }
}, [
  h('h1', { class: 'title' }, 'systemnytt.se'),
  h('h3', { class: 'title-description' }, 'småpartier på systembolaget'),
  NavigationBar(state, actions),
  Beverages(state, actions)
])
