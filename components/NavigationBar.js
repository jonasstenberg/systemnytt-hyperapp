import { h } from 'hyperapp'

import getQueryParam from '../utils/queryparam'

export default (state, actions) => h('nav', { class: 'navigation' },
  h('ul', { class: 'navigation-list' }, [
    state.menuItems.map(menuItem =>
      h('li', { class: 'navigation-list__item' },
        h('button', {
          class: 'navigation-list__item--link',
          onclick: () => {
            const releaseDate = getQueryParam('releaseDate')
            window.history.pushState(null, '', `?productGroup=${menuItem.key}&releaseDate=${releaseDate}`)
            actions.setProductGroup(menuItem.key)
          }
        }, `${menuItem.key} (${menuItem.len})`)
      )
    )
  ])
)
