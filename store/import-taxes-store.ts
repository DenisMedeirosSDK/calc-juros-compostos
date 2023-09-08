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
  addCalculation: (calculation: CalcImportTaxes) => Promise<void>
  clearHistory: () => void
}

export interface ImportTaxesStore extends States, Actions { }

const initialStates: States = {
  history: [],
}

export const useImportTaxesStore = create<ImportTaxesStore>()(
  persist(
    (set) => ({
      ...initialStates,
      history: [],
      addCalculation: async (calculation: CalcImportTaxes) => {
        set((state) => {
          let newHistory = [...state.history, calculation]

          // Verifica se o histórico tem mais de 10 itens
          if (newHistory.length > 10) {
            // Se tiver mais de 10 itens, mantenha apenas os 10 mais recentes
            newHistory = newHistory.slice(newHistory.length - 10)
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
      name: 'importTaxesStore',
      storage: createJSONStorage(() => localStorage),
      // skipHydration: true,

    },
  ),
)
