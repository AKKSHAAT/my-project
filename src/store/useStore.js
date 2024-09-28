import { create } from "zustand";

// Properly pass the store definition to create the Zustand store
const useParchiStore = create((set) => ({
  cards: [],

  // Update a card by id and update its qty and name
  updateCard: (id, qty, name) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, qty, name } : card
      ),
    })),

  // Add a new card with id, qty, and name
  addCard: (newCard) =>
    set((state) => ({
      cards: [...state.cards, newCard],
    })),

  // Remove card by id
  removeCard: (cardId) => {
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),
    }));
  },

  parchiReset: () => set({ cards: [] }),
}));

export default useParchiStore;
