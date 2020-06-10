import { app } from 'HYPERAPP'

import state from './state'
import actions from './actions'
import App from './components/App'

import './styles/main.css'

app(
  state,
  actions,
  App,
  document.getElementById('app')
)
