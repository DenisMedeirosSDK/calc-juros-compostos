import { create } from 'zustand'

// Defina uma chave para armazenar no localStorage
const localStorageKey = '@calcDM:importTax'

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
  // Tente recuperar o histórico do localStorage quando o aplicativo inicia
  const storedHistory = localStorage.getItem(localStorageKey)
  const initialHistory = storedHistory ? JSON.parse(storedHistory) : []

  return {
    history: initialHistory,
    addCalculation: (calculation: CalcImportTaxes) => {
      set((state) => {
        let newHistory = [...state.history, calculation]

        if (newHistory.length > 20) {
          newHistory = newHistory.slice(newHistory.length - 20)
        }

        // Armazene o histórico atualizado no localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(newHistory))

        return {
          history: newHistory,
        }
      })
    },
    clearHistory: () => {
      // Limpe o histórico e remova-o do localStorage
      localStorage.removeItem(localStorageKey)
      set({ history: [] })
    },
  }
})
