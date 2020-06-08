import bolaget from '../utils/api/bolaget'
import getQueryParam from '../utils/queryparam'
import { groupBeveragesBy } from '../utils/beverages'

export default {
  setLoading: (loading) => ({ loading }),

  save: () => (state) => {
    window.localStorage.setItem(state.selectedReleaseDate, JSON.stringify(state.beverages))
  },

  restore: (beverages) => (state, actions) => {
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

  setQueryParams: () => (state) => {
    window.history.pushState(null, '', `/?productGroup=${state.productGroup}&releaseDate=${state.selectedReleaseDate}`)
  },

  setSearchPhrase: (searchPhrase) => ({ searchPhrase }),

  setError: (error) => ({ error }),

  fetchBeverages: () => async (state, actions) => {
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

  initProductGroup: () => (state) => {
    const productGroupQuery = getQueryParam('productGroup')
    let productGroup

    const starredProductGroup = window.localStorage.getItem('starredProductGroup')
    const groupedBeverages = groupBeveragesBy(state.beverages[state.selectedReleaseDate], 'product_group')

    if (productGroupQuery) {
      productGroup = productGroupQuery
    } else if (starredProductGroup && groupedBeverages[starredProductGroup]) {
      productGroup = starredProductGroup
    } else if (state.menuItems.length) {
      productGroup = state.menuItems[0].key
    }

    if (!productGroupQuery && productGroup) {
      window.history.pushState(null, '', `/?productGroup=${productGroup}&releaseDate=${state.selectedReleaseDate}`)
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

    window.localStorage.setItem('starredProductGroup', starredProductGroup)

    return {
      starredProductGroup
    }
  },

  setStarredBeverage: (starredBeverages) => {
    window.localStorage.setItem('starredBeverages', JSON.stringify(starredBeverages))

    return {
      starredBeverages
    }
  }
}
