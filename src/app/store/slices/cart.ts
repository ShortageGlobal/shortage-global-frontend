import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import { serizalizeAxiosError } from 'app/helpers';
import { fetchCart as fetchCartAxios } from 'app/api';
import type { FetchCartParams } from 'app/api';
import type { Cart } from 'app/api/types';

export const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    cart: null,
    isCartReady: false,
    isCartLoading: false,
    isCartSidebarShown: false,
  } as {
    cart?: Cart;
    isCartReady: boolean;
    isCartLoading: boolean;
    isCartSidebarShown: boolean;
  },

  reducers: {
    showCartSidebar: (state) => {
      state.isCartSidebarShown = true;
    },
    hideCartSidebar: (state) => {
      state.isCartSidebarShown = false;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setCartReady: (state) => {
      state.isCartReady = true;
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

  extraReducers(builder) {
    builder
      // fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isCartLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.isCartLoading = false;
      });
  },
});

// Actions
export const {
  showCartSidebar,
  hideCartSidebar,
  setCart,
  setCartReady,
  updateCartItemQuantity,
  deleteCartItem,
} = cartSlice.actions;

// Selectors
export const selectCart = (state: AppState) => state.cart;

// API calls
export const fetchCart = createAsyncThunk(
  'carts/fetchCart',
  async (params: FetchCartParams, { rejectWithValue }) => {
    try {
      const response = await fetchCartAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const cartReducer = cartSlice.reducer;
