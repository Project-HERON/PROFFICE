import { configureStore } from '@reduxjs/toolkit';
import modalsSliceReducer from './modalsSlice';

export const store = configureStore({
  reducer: {
    modals: modalsSliceReducer,
  },
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;