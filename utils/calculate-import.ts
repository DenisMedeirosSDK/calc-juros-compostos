export interface ReturnCalcImportTaxes {
  percentage: string
  onlyTaxes: string
  onlyTaxICMS: string
  importTax: string
  valueTotal: string
}

export function calculateImportTaxes(
  price: number,
  tax: number,
  taxICMS: number,
): ReturnCalcImportTaxes {
  const convertTaxToDecimal = tax / 100
  const convertTaxICMSToDecimal = taxICMS / 100

  // Imposto de importação
  const importTax = price * convertTaxToDecimal

  // Valor final do produto
  const valueTotal = (price + importTax) / (1 - convertTaxICMSToDecimal)

  // Pegar apenas o imposto de ICMS
  const onlyTaxICMS = valueTotal - (price + importTax)

  // Pegar o total somente de imposto
  const onlyTaxes = onlyTaxICMS + importTax

  // Pegar a porcentagem do valor final com o valor original
  const percentage = ((valueTotal - price) / price) * 100

  // console.log('percentage', percentage)
  // console.log('onlyTaxes', onlyTaxes)
  // console.log('onlyTaxICMS', onlyTaxICMS)
  // console.log('importTax', importTax)
  // console.log('Value Total', valueTotal)

  return {
    percentage: percentage.toFixed(2),
    onlyTaxes: onlyTaxes
      .toFixed(2)
      .replace('.', ',')
      .replace(/[^\d,]/g, ''),
    onlyTaxICMS: onlyTaxICMS
      .toFixed(2)
      .replace('.', ',')
      .replace(/[^\d,]/g, ''),
    importTax: importTax
      .toFixed(2)
      .replace('.', ',')
      .replace(/[^\d,]/g, ''),
    valueTotal: valueTotal
      .toFixed(2)
      .replace('.', ',')
      .replace(/[^\d,]/g, ''),
  }
}

calculateImportTaxes(513.17, 60, 17)
