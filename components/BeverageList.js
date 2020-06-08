import { h } from 'hyperapp'

import { filteredBeverages } from '../utils/beverages'

const title = (beverage) => {
  let title = ''
  title += beverage.name ? `${beverage.name} ` : ''
  title += beverage.additional_name ? `${beverage.additional_name} ` : ''
  title += beverage.alcohol ? `(${beverage.alcohol}) ` : ''
  title += beverage.year ? `(${beverage.year}) ` : ''

  return title
}

const iconUrl = (packaging, filled) => {
  switch (packaging) {
    case 'Burk':
      return filled ? '/images/can_filled.svg' : '/images/can.svg'
    default:
      return filled ? '/images/bottle_filled.svg' : '/images/bottle.svg'
  }
}

const beverageType = (beverage) => {
  let type = ''
  if (beverage.product_group) {
    if (beverage.type) {
      type += `${beverage.product_group}, `
      type += beverage.type
    } else {
      type += beverage.product_group
    }
  } else {
    type += beverage.type ? beverage.type : ''
  }
  return type
}

const beverageIsChecked = (starredBeverages, beverage) => {
  return starredBeverages.includes(beverage.nr)
}

const Attributes = (beverage) => h('div', { class: 'beverage-list__item-attributes' }, [
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Typ: '),
    beverageType(beverage) || '-'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Stil: '),
    beverage.style || '-'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Årgång: '),
    beverage.year || '-'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Alkoholhalt: '),
    beverage.alcohol || '-'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Volym: '),
    beverage.volume_in_milliliter ? `${beverage.volume_in_milliliter} ml` : '-'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, `${beverage.product_group === 'Öl' ? 'Bryggeri' : 'Producent'}: `),
    beverage.producer || '.'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Leverantör: '),
    beverage.provider || '.'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Kr/l - jämförelsepris: '),
    beverage.price_per_liter || '-'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Förslutning: '),
    beverage.sealing || '-'
  ]),
  h('p', { class: 'beverage-list__item-attribute' }, [
    h('span', { class: 'beverage-list__item-attribute--bold' }, 'Säljstart: '),
    beverage.sales_start || '-'
  ])
])

export default (state, actions) => {
  const beverages = filteredBeverages(state.beverages[state.selectedReleaseDate], state.productGroup, state.searchPhrase)
  return h('div', { class: 'beverage-list' },
    beverages
      .map((beverage) => h('div', { class: 'beverage-list__item' }, [
        h('div', {
          class: 'beverage-list__item-title',
          onclick: () => {
            const all = state.beverages
            const b = all[state.selectedReleaseDate].find(n => n.nr === beverage.nr)
            b.expanded = !b.expanded

            actions.setBeverages(all)
          }
        }, [
          h('img', {
            class: 'beverage-list__item-icon',
            src: iconUrl(beverage.packaging, state.starredBeverages.includes(beverage.nr))
          }),
          title(beverage),
          h('span', { class: 'beverage-list__item-price' }, `${beverage.price.amount.toFixed(2)} ${beverage.price.currency}`)
        ]),
        beverage.expanded ? h('div', { class: 'beverage-list__item-expanded' }, [
          Attributes(beverage),
          h('div', { class: 'beverage-list__item-star' }, [
            h('input', {
              type: 'checkbox',
              name: 'beverage-star',
              class: 'beverage-list__item-star-checkbox',
              checked: beverageIsChecked(state.starredBeverages, beverage),
              onchange: (evt) => {
                const starredBeverages = state.starredBeverages

                if (evt.target.checked) {
                  if (!starredBeverages.includes(beverage.nr)) {
                    starredBeverages.push(beverage.nr)
                  }
                } else {
                  const index = starredBeverages.indexOf(beverage.nr)
                  if (index >= 0) {
                    starredBeverages.splice(index, 1)
                  }
                }

                actions.setStarredBeverage(starredBeverages)
              }
            }),
            h('label', {
              for: 'beverage-star',
              class: 'beverage-list__item-star-label'
            }, h('img', {
              src: `/images/star${beverageIsChecked(state.starredBeverages, beverage) ? '_filled' : ''}.svg`
            }))
          ])
        ]) : null
      ]))
  )
}
