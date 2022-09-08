import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import {
  fetchCart as fetchCartAxios,
  createCart as createCartAxios,
  createCartItem as createCartItemAxios,
} from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type { AxiosSerializedError, Cart } from 'app/api/types';
import type {
  CreateCartParams,
  FetchCartParams,
  CreateCartItemParams,
} from 'app/api';
import { CART_ID_KEY } from 'app/constants';

export const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    cart: null,
    isCartLoading: false,
    isCartCreating: false,
    isCartItemCreating: false,
    error: null,
    isCartSidebarShown: false,
  } as {
    cart?: Cart;
    isCartLoading: boolean;
    isCartCreating: boolean;
    isCartItemCreating: boolean;
    error?: AxiosSerializedError;
    isCartSidebarShown: boolean;
  },

  reducers: {
    showCartSidebar: (state) => {
      state.isCartSidebarShown = true;
    },
    hideCartSidebar: (state) => {
      state.isCartSidebarShown = false;
    },
    updateCartItemQuantity: (state, action) => {
      const itemToUpdate = state.cart.items.find(
        (item) => item.uuid === action.payload.item.uuid
      );
      if (!itemToUpdate) {
        return;
      }
      itemToUpdate.quantity = action.payload.quantity;
    },
    deleteCartItem: (state, action) => {
      state.cart.items = state.cart.items.filter(
        (item) => item.uuid !== action.payload.item.uuid
      );
    },
  },

  extraReducers(builder) {
    builder
      // fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isCartLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isCartLoading = false;
        state.error = action.payload as AxiosSerializedError;
      })
      // create cart
      .addCase(createCart.pending, (state) => {
        state.isCartCreating = true;
        state.error = null;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.isCartCreating = false;
        state.cart = action.payload;
      })
      .addCase(createCart.rejected, (state, action) => {
        state.isCartCreating = false;
        state.error = action.payload as AxiosSerializedError;
      })
      // create cart item
      .addCase(createCartItem.pending, (state) => {
        state.isCartItemCreating = true;
        state.error = null;
      })
      .addCase(createCartItem.fulfilled, (state, action) => {
        state.isCartItemCreating = false;
        state.cart = action.payload;
      })
      .addCase(createCartItem.rejected, (state, action) => {
        state.isCartItemCreating = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const {
  showCartSidebar,
  hideCartSidebar,
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
export const createCart = createAsyncThunk(
  'carts/createCart',
  async (params: CreateCartParams, { rejectWithValue }) => {
    try {
      // POST - create cart
      const responseCreate = await createCartAxios(params);
      const cartId = responseCreate.data.uuid;

      // store cartId in localStorage so the cart could be restored on refresh
      localStorage.setItem(CART_ID_KEY, cartId);

      // GET - fetch newly created cart
      const responseFetch = await fetchCartAxios({
        cartId,
        cancelToken: params.cancelToken,
      });
      return responseFetch.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);
export const createCartItem = createAsyncThunk(
  'carts/createCartItem',
  async (params: CreateCartItemParams, { rejectWithValue }) => {
    try {
      // POST - create cart
      await createCartItemAxios(params);

      // GET - fetch updated cart
      const responseFetch = await fetchCartAxios({
        cartId: params.cartId,
        cancelToken: params.cancelToken,
      });
      return responseFetch.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const cartReducer = cartSlice.reducer;
