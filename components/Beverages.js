import { h } from 'hyperapp'

import { filteredBeverages, groupBeveragesBy } from '../utils/beverages'

import Pagination from './Pagination'
import Search from './Search'
import BeverageList from './BeverageList'

const nextRelease = (beverages, selectedReleaseDate) => {
  if (!selectedReleaseDate) {
    return ''
  }
  const groupedBeverages = groupBeveragesBy(beverages[selectedReleaseDate], 'product_group')
  const stringDate = groupedBeverages[Object.keys(groupedBeverages)[0]][0].sales_start
  const date = new Date(stringDate)

  const locale = 'sv-SE'
  const weekday = date.toLocaleString(locale, { weekday: 'long' })
  const month = date.toLocaleString(locale, { month: 'long' })

  return `${weekday} den ${date.getDate()} ${month}`
}

const isChecked = (starredProductGroup, productGroup) => {
  return starredProductGroup && starredProductGroup === productGroup
}

const beverages = (state, actions) => h('div', { class: 'beverages' }, [
  h('div', { class: 'product-group' }, [
    h('div', { class: 'product-group__info' }, [
      h('h1', { class: 'product-group__info-title' }, state.productGroup),
      h('div', { class: 'product-group__info-star' }, [
        h('input', {
          class: 'product-group__info-star--checkbox',
          type: 'checkbox',
          name: 'star',
          checked: isChecked(state.productGroup, state.starredProductGroup),
          onchange: (evt) => {
            if (evt.target.checked) {
              actions.setStarredProductGroup(state.productGroup)
            } else {
              actions.setStarredProductGroup(null)
            }
          }
        }),
        h('label', {
          for: 'star',
          class: 'product-group__info-star-label'
        },
        h('img', {
          src: `/images/star${isChecked(state.starredProductGroup, state.productGroup) ? '_filled' : ''}.svg`
        })
        )
      ])
    ]),
    h('div', { class: 'product-group__releases' }, [
      h('div', { class: 'product-group__release-next' }, [
        'Finns på Systembolaget: ',
        h('b', {}, nextRelease(state.beverages, state.selectedReleaseDate))
      ]),
      Pagination(state, actions)
    ]),
    Search(state, actions),
    h('div', { class: 'beverages__total' },
      h('span', { class: 'beverages__total-number' }, [
        filteredBeverages(state.beverages[state.selectedReleaseDate], state.productGroup, state.searchPhrase).length,
        ' resultat'
      ])
    )
  ]),
  BeverageList(state, actions)
])

export default (state, actions) => (() => {
  if (state.beverages && !state.loading) {
    return beverages(state, actions)
  } else {
    if (state.error) {
      return h('div', { class: 'beverages beverages__info' }, 'Något gick fel')
    } else if (state.loading) {
      return h('div', { class: 'beverages beverages__info' }, 'Laddar')
    } else {
      return h('div', { class: 'beverages beverages__info' }, 'Inga släpp den här veckan')
    }
  }
})()
