import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { liveChatReducer } from 'core/store/slices/live-chat';
import { searchReducer } from 'core/store/slices/search';
import { accountReducer } from 'core/store/slices/account';
import { cartReducer } from 'core/store/slices/cart';
import { promotedOrganizationsReducer } from 'core/store/slices/promoted-organizations';
import { promotedCategoriesReducer } from 'core/store/slices/promoted-categories';
import { promotedProductsReducer } from 'core/store/slices/promoted-products';
import { organizationReducer } from 'core/store/slices/organization';
import { categoriesReducer } from 'core/store/slices/categories';
import { productsReducer } from 'core/store/slices/products';
import { productReducer } from 'core/store/slices/product';
import { instructionsReducer } from 'core/store/slices/instructions';
import { onlineStoresReducer } from 'core/store/slices/online-stores';
import { packageReducer } from 'core/store/slices/package';

const combinedReducer = combineReducers({
  search: searchReducer,
  liveChat: liveChatReducer,
  account: accountReducer,
  cart: cartReducer,
  promotedOrganizations: promotedOrganizationsReducer,
  promotedCategories: promotedCategoriesReducer,
  promotedProducts: promotedProductsReducer,
  organization: organizationReducer,
  categories: categoriesReducer,
  products: productsReducer,
  product: productReducer,
  instructions: instructionsReducer,
  onlineStores: onlineStoresReducer,
  package: packageReducer,
});

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    } as ReturnType<typeof combinedReducer>;

    // preserve cart on client side navigation
    nextState.cart = state.cart;

    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV === 'development',
});
