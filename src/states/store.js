import { create }  from 'zustand';

export const useStore = create((set) => ({
  init: () => {
    console.log('Store initialized');
  },

  // BETTINGFORM STATES
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set(() => ({ count: 0 })),
  betType: null,
  isBetPlaced: false,
  userPlaceBet: (type) => set((state) => ({
    betType: type,
    isBetPlaced: true
  }),
  ),
  resetAfterPlaced: () => set((state) => ({
    betType: null,
    isBetPlaced: false
  })),
  // GAMETIMER STATES
  timerStatus: null, // Enum: betting_open, draw, payout
  setTimerStatus: (newStatus) => set({ timerStatus: newStatus }),
  // RESULTS STATES
  resultsData:null, // Result socket
  setResultData: (newResults) => set({ resultsData: newResults }),
  // USERDATA STATES
  authUser:null,
  setAuthUser: (newAuth) => set({ authUser: newAuth }),
  // GAMEROUNDDATA STATES
  currentRound:null,
  setCurrentRound: (newRound) => set({ currentRound: newRound  }),
  // DYNAMIC RATE STATES
  currentUpBets: null,
  currentDownBets: null,
  totalUpBets: 0,
  totalDownBets: 0,
  setCurrentUpBets: (newUpBets) => set({ currentUpBets: newUpBets }),
  setCurrentDownBets: (newDownBets) => set({ currentDownBets: newDownBets }),
  setUpTotalBets: (newTotalUpBets) => set({ totalUpBets: newTotalUpBets}),
  setDownTotalBets: (newTotalDownBets) => set({ totalDownBets: newTotalDownBets}),
}));