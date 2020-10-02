import { h } from 'hyperapp'

export default (state, actions) => h('div', {}, [
  h('h1', { class: 'title' }, 'systemnytt.se'),
  h('h3', { class: 'title-description' }, 'Systembolaget har stängt ner sitt API för att hämta dryckesinformation.')
])
