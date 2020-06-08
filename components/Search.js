import { h } from 'hyperapp'

export default (state, actions) => h('div', { class: 'search' }, [
  h('input', {
    type: 'text',
    class: 'search__input',
    value: state.searchPhrase,
    oninput: (evt) => {
      const value = evt.target.value.trim().toLowerCase()
      actions.setSearchPhrase(value)
    },
    onkeydown: (evt) => {
      if (evt.key && evt.key === 'Escape') {
        actions.setSearchPhrase('')
      }
    }
  }),
  !state.searchPhrase ? h('span', { class: 'search__suggestions' }, 'Sök bland dryckerna') : null
])
