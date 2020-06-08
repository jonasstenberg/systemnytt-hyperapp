import { h } from 'hyperapp'

export default (state, actions) => h('div', { class: 'search' }, [
  h('input', {
    type: 'text',
    class: 'search__input',
    value: state.searchPhrase,
    oninput: (evt) => actions.setSearchPhrase(evt.target.value)
  }),
  !state.searchPhrase ? h('span', { class: 'search__suggestions' }, 'Sök bland dryckerna') : null
])
