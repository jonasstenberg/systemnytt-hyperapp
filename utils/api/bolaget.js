import fetch from '../pseudo-fetch'
import formatDate from '../date'
import getQueryParam from '../queryparam'

const groupBy = (key) => (array) => array.reduce((objectsByKeyValue, obj) => {
  const value = obj[key]
  objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
  return objectsByKeyValue
}, {})

const getStartDate = (releaseDate) => {
  const supposedlyDate = releaseDate ? new Date(releaseDate) : Date.now()
  const date = new Date(supposedlyDate)
  date.setDate(date.getDate() - 60)

  return formatDate(date)
}

const getEndDate = (releaseDate) => {
  const supposedlyDate = releaseDate ? new Date(releaseDate) : Date.now()
  const date = new Date(supposedlyDate)
  date.setDate(date.getDate() + 60)

  return formatDate(date)
}

export default async () => {
  const releaseDateQuery = getQueryParam('releaseDate')

  const startDate = getStartDate(releaseDateQuery)
  const endDate = getEndDate(releaseDateQuery)

  const getBeverages = async (params, beverages = []) => {
    const queryParams = new URLSearchParams(params).toString()
    const res = await fetch(`https://bolaget.io/v1/products?${queryParams}`)
    const data = await res.json()

    beverages.push(...data)

    if (data.length >= 100) {
      const p = Object.assign({}, params, {
        offset: params.offset ? params.offset + data.length : data.length
      })
      return getBeverages(p, beverages)
    }

    return beverages
  }

  const params = {
    assortment: 'TSE|TSLS|TSV|TST',
    limit: 100,
    sales_start_from: startDate,
    sales_start_to: endDate
  }

  const beverages = await getBeverages(params)

  const groupByProductGroup = groupBy('sales_start')
  const groupedBeverages = groupByProductGroup(beverages)

  const sortedGroupedBeverages = Object.keys(groupedBeverages)
    .sort()
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue] = groupedBeverages[currentValue]
      return accumulator
    }, {})

  return sortedGroupedBeverages
}
