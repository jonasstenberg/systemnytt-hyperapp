import { h } from 'hyperapp'

export default (state, actions) => h('nav', { class: 'navigation' },
  h('ul', { class: 'navigation-list' }, [
    state.menuItems.map(menuItem =>
      h('li', { class: 'navigation-list__item' },
        h('button', {
          class: `navigation-list__item-button${state.productGroup === menuItem.key ? ' navigation-list__item-button--active' : ''}`,
          onclick: () => {
            actions.pushState(menuItem.key)
            actions.setProductGroup(menuItem.key)
          }
        }, `${menuItem.key} (${menuItem.len})`)
      )
    )
  ])
)
