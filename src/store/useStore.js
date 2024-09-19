// store/useStore.js
import create from "zustand";


const parchiStore = (set) => ({
  cards : [],

  addCard : (card) => {
    set(state=> ({
      cards: [card, ...state.cards ],
    }))
  },

  removeCard : (cardId) => {
    set(state=>({
      cards : state.cards.filter((c)=> c.id != cardId)
    }))
  },

  updateCard: (id, qty) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, qty } : c
          ),
        })),
})

const useParchiStore = create()

export default useParchiStore;
