import bolaget from '../utils/api/bolaget'
import getQueryParam from '../utils/queryparam'
import { groupBeveragesBy } from '../utils/beverages'

export default {
  init: () => (_, actions) => {
    actions.parseLocation()
  },

  set: param => ({ ...param }),

  pushState: pathname => (state, actions) => {
    window.history.pushState(null, '', `${pathname}?releaseDate=${state.selectedReleaseDate}`)
    actions.parseLocation()
  },

  parseLocation: () => (_, actions) => {
    const [
      route
    ] = window.location.pathname
      .split('/')
      .filter(s => s.length)
      .map(s => decodeURIComponent(s))

    if (route) {
      actions.set({
        route
      })
    }
  },

  setLoading: (loading) => ({ loading }),

  save: () => (state) => {
    window.localStorage.setItem(state.selectedReleaseDate, JSON.stringify(state.beverages))
  },

  restore: (beverages) => (_, actions) => {
    const starredProductGroup = window.localStorage.getItem('starredProductGroup')

    actions.setLoading(true)
    actions.setBeverages(beverages)

    actions.initSelectedReleaseDate()
    actions.initMenuItems()
    actions.initProductGroup()
    actions.initStarredBeverages()

    if (starredProductGroup) {
      actions.setStarredProductGroup(starredProductGroup)
    }
    actions.setLoading(false)
  },

  setSearchPhrase: (searchPhrase) => ({ searchPhrase }),

  setError: (error) => ({ error }),

  fetchBeverages: () => async (_, actions) => {
    actions.setLoading(true)
    try {
      const result = await bolaget()
      actions.setBeverages(result)

      actions.initSelectedReleaseDate()
      actions.initMenuItems()
      actions.initProductGroup()
      actions.initStarredBeverages()

      actions.save()
    } catch (err) {
      console.log(err)
      actions.setError(err)
    }
    actions.setLoading(false)
  },

  setBeverages: (beverages) => ({ beverages }),

  initSelectedReleaseDate: () => (state) => {
    const releaseDateQuery = getQueryParam('releaseDate')
    const today = new Date()

    const selectedReleaseDate = !releaseDateQuery
      ? Object.keys(state.beverages).reduce((a, b) => {
        const adiff = new Date(a) - today
        return adiff > 0 && adiff < new Date(b) - today ? a : b
      })
      : releaseDateQuery

    return {
      selectedReleaseDate
    }
  },

  setSelectedReleaseDate: (selectedReleaseDate) => ({ selectedReleaseDate }),

  initMenuItems: () => (state) => {
    const groupedBeverages = groupBeveragesBy(state.beverages[state.selectedReleaseDate], 'product_group')

    const menuItems = Object.keys(groupedBeverages)
      .map((beverage) => ({ key: beverage, len: groupedBeverages[beverage].length }))
      .sort((a, b) => b.len - a.len)

    return {
      menuItems
    }
  },

  setMenuItems: (menuItems) => ({ menuItems }),

  initProductGroup: () => (state, actions) => {
    let productGroup

    const starredProductGroup = window.localStorage.getItem('starredProductGroup')
    const groupedBeverages = groupBeveragesBy(state.beverages[state.selectedReleaseDate], 'product_group')

    if (state.route) {
      productGroup = state.route
    } else if (starredProductGroup && groupedBeverages[starredProductGroup]) {
      productGroup = starredProductGroup
    } else if (state.menuItems.length) {
      productGroup = state.menuItems[0].key
    }

    if (!state.route && productGroup) {
      actions.pushState(productGroup)
    }

    return {
      productGroup,
      starredProductGroup
    }
  },

  setProductGroup: (productGroup) => ({ productGroup }),

  initStarredBeverages: () => {
    const s = window.localStorage.getItem('starredBeverages')
    const starredBeverages = JSON.parse(s) || []

    return {
      starredBeverages
    }
  },

  setStarredProductGroup: (starredProductGroup) => {
    // Oops, saved null as a string to localStorage by mistake
    if (starredProductGroup === 'null') {
      window.localStorage.removeItem('starredProductGroup')
      return {
        starredProductGroup: null
      }
    }

    if (starredProductGroup) {
      window.localStorage.setItem('starredProductGroup', starredProductGroup)
    } else {
      window.localStorage.removeItem('starredProductGroup')
    }

    return {
      starredProductGroup
    }
  },

  setStarredBeverage: (starredBeverages) => {
    if (starredBeverages && starredBeverages.length) {
      window.localStorage.setItem('starredBeverages', JSON.stringify(starredBeverages))
    } else {
      window.localStorage.removeItem('starredBeverages')
    }

    return {
      starredBeverages
    }
  }
}
