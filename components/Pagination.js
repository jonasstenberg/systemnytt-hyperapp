import { h } from 'hyperapp'

const findDate = (key, keys, direction) => {
  if (keys.indexOf(key) > -1) {
    const num = direction === 'back' ? -1 : 1
    const nextIndex = keys.indexOf(key) + num
    const next = keys[nextIndex]

    return next
  }

  return null
}

export default (state, actions) => {
  const go = async (direction) => {
    if (state.starredProductGroup && state.starredProductGroup !== state.productGroup) {
      actions.setProductGroup(state.starredProductGroup)
    }

    const releaseDate = findDate(state.selectedReleaseDate, Object.keys(state.beverages), direction)

    actions.setSelectedReleaseDate(releaseDate)
    actions.pushState(state.route)

    const local = window.localStorage.getItem('beverages')
    const beverages = JSON.parse(local)

    const keys = Object.keys(beverages)
    const indexOf = keys.indexOf(releaseDate)

    const existsInBeverages = beverages[releaseDate]
    const futureOrPast = indexOf && (indexOf >= keys.length - 3 || indexOf < 3)

    if (beverages && existsInBeverages && !futureOrPast) {
      actions.restore(beverages)
    } else {
      await actions.fetchBeverages()
    }
  }

  return h('div', { class: 'pagination' }, [
    h('button', {
      class: 'pagination__button pagination__button--back',
      disabled: !findDate(state.selectedReleaseDate, Object.keys(state.beverages), 'back'),
      onclick: () => go('back')
    }, 'Föregående'),
    h('button', {
      class: 'pagination__button pagination__button--forward',
      disabled: !findDate(state.selectedReleaseDate, Object.keys(state.beverages), 'forward'),
      onclick: () => go('forward')
    }, 'Nästa')
  ])
}
