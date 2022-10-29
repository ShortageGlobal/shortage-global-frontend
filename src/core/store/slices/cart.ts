import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import type { Cart } from 'core/api/types';

export const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    cart: null,
    isCartLoading: false,
    isCartSidebarShown: false,
  } as {
    cart?: Cart;
    isCartLoading: boolean;
    isCartSidebarShown: boolean;
  },

  reducers: {
    setIsCartSidebarShown: (state, action) => {
      state.isCartSidebarShown = action.payload;
    },
    setIsCartLoading: (state, action) => {
      state.isCartLoading = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
      state.isCartLoading = false;
    },
    updateCartItemQuantity: (state, action) => {
      const itemToUpdate = state.cart.items.find(
        (item) => item.uuid === action.payload.cartItemId
      );
      if (!itemToUpdate) {
        return;
      }
      itemToUpdate.quantity = action.payload.quantity;
    },
    deleteCartItem: (state, action) => {
      state.cart.items = state.cart.items.filter(
        (item) => item.uuid !== action.payload.cartItemId
      );
    },
  },
});

// Actions
export const {
  setIsCartSidebarShown,
  setIsCartLoading,
  setCart,
  updateCartItemQuantity,
  deleteCartItem,
} = cartSlice.actions;

// Selectors
export const selectCart = (state: AppState) => state.cart;

// Reducer
export const cartReducer = cartSlice.reducer;
