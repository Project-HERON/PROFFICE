import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface ModalsState {
  addAvailabilityModal: {
    isOpen: boolean;
  };
  bookSessionModal: {
    isOpen: boolean;
  };
}

// Define the initial state using that type
const initialState: ModalsState = {
  addAvailabilityModal: {
    isOpen: false,
  },
  bookSessionModal: {
    isOpen: false,
  }
}

export const modalsSlice = createSlice({
  name: 'modals',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<keyof typeof initialState>) => {
      state[action.payload].isOpen = true;
    },
    closeModal: (state, action: PayloadAction<keyof typeof initialState>) => {
      state[action.payload].isOpen = false;
    },
  },
})

export const { closeModal, openModal } = modalsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAvailabilityModalState = (state: RootState) => state.modals.addAvailabilityModal.isOpen;

export const selectBookSessionModalState = (state: RootState) => state.modals.bookSessionModal.isOpen;

export default modalsSlice.reducer;