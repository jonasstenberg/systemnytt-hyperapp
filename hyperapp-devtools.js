import * as hyperapp from 'hyperapp'
import devtools from 'hyperapp-redux-devtools'

export const app = devtools(hyperapp.app)
