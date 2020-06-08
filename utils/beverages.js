export const filteredBeverages = (beverages, productGroup, searchPhrase) => {
  const groupedBeverages = groupBeveragesBy(beverages, 'product_group')
  const selectedBeverages = groupedBeverages[productGroup]

  if (!selectedBeverages) {
    return []
  }

  if (!searchPhrase) {
    return selectedBeverages
  }

  return selectedBeverages.filter(
    (beverage) => beverage.name.toLowerCase().indexOf(searchPhrase) > -1 ||
      (beverage.additional_name && beverage.additional_name.toLowerCase().indexOf(searchPhrase) > -1) ||
      (beverage.type && beverage.type.toLowerCase().indexOf(searchPhrase) > -1) ||
      (beverage.style && beverage.style.toLowerCase().indexOf(searchPhrase) > -1) ||
      (beverage.producer && beverage.producer.toLowerCase().indexOf(searchPhrase) > -1) ||
      (beverage.provider && beverage.provider.toLowerCase().indexOf(searchPhrase) > -1) ||
      (beverage.alcohol && beverage.alcohol.toLowerCase().indexOf(searchPhrase) > -1) ||
      (beverage.year && beverage.year.toString().indexOf(searchPhrase) > -1) ||
      (beverage.packaging && beverage.packaging.toLowerCase().indexOf(searchPhrase) > -1)
  )
}

export const groupBeveragesBy = (xs, key) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x)
  return rv
}, {})
