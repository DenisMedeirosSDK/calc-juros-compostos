import { formattedCurrency, formattedPercent } from './formatted-numbers'

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
  const percentage = (valueTotal - price) / price

  // console.log('percentage', percentage)
  // console.log('onlyTaxes', onlyTaxes)
  // console.log('onlyTaxICMS', onlyTaxICMS)
  // console.log('importTax', importTax)
  // console.log('Value Total', valueTotal)

  const percentageFormatted = formattedPercent(percentage)
  const onlyTaxesFormatted = formattedCurrency(onlyTaxes)
  const onlyTaxICMSFormatted = formattedCurrency(onlyTaxICMS)
  const importTaxFormatted = formattedCurrency(importTax)
  const valueTotalFormatted = formattedCurrency(valueTotal)

  return {
    percentage: percentageFormatted,
    onlyTaxes: onlyTaxesFormatted,
    onlyTaxICMS: onlyTaxICMSFormatted,
    importTax: importTaxFormatted,
    valueTotal: valueTotalFormatted,
  }
}
