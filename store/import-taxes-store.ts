import { create } from 'zustand'

export interface CalcImportTaxes {
  price: string
  percentage: string
  onlyTaxes: string
  onlyTaxICMS: string
  importTax: string
  importTaxPercent: string
  importTaxICMSPercent: string
  valueTotal: string
}

export interface ImportTaxesStore {
  history: CalcImportTaxes[]
  addCalculation: (calculation: CalcImportTaxes) => void
  clearHistory: () => void
}

export const useImportTaxesStore = create<ImportTaxesStore>((set, get) => {
  return {
    history: [],
    addCalculation: (calculation: CalcImportTaxes) => {
      set((state) => {
        let newHistory = [...state.history, calculation]

        // Verifica se o histórico tem mais de 20 itens
        if (newHistory.length > 20) {
          // Se tiver mais de 20 itens, mantenha apenas os 20 mais recentes
          newHistory = newHistory.slice(newHistory.length - 20)
        }

        return {
          history: newHistory,
        }
      })
    },
    clearHistory: () => {
      set({ history: [] })
    },
  }
})
