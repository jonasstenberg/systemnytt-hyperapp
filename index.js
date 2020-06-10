import { app } from 'HYPERAPP'

import state from './state'
import actions from './actions'
import App from './components/App'

import './styles/main.css'

const wiredActions = app(
  state,
  actions,
  App,
  document.getElementById('app')
)

wiredActions.init()

window.addEventListener('popstate', () => {
  wiredActions.parseLocation()
})
