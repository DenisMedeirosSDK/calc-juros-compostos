import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

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

interface States {
  history: CalcImportTaxes[]
}

interface Actions {
  addCalculation: (calculation: CalcImportTaxes) => void
  clearHistory: () => void
}

export interface ImportTaxesStore extends States, Actions {}

const initialStates: States = {
  history: [],
}

export const useImportTaxesStore = create<ImportTaxesStore>()(
  persist(
    (set) => ({
      ...initialStates,
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
    }),
    {
      name: 'importTaxesStore', // Nome do armazenamento persistente
      storage: createJSONStorage(() => localStorage), // Use sessionStorage para persistência de sessão
    },
  ),
)
