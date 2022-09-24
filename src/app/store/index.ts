import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { liveChatReducer } from 'app/store/slices/live-chat';
import { searchReducer } from 'app/store/slices/search';
import { cartReducer } from 'app/store/slices/cart';
import { promotedOrganizationsReducer } from 'app/store/slices/promoted-organizations';
import { promotedCategoriesReducer } from 'app/store/slices/promoted-categories';
import { promotedProductsReducer } from 'app/store/slices/promoted-products';
import { organizationReducer } from 'app/store/slices/organization';
import { categoriesReducer } from 'app/store/slices/categories';
import { productsReducer } from 'app/store/slices/products';
import { productReducer } from 'app/store/slices/product';
import { instructionsReducer } from 'app/store/slices/instructions';
import { onlineStoresReducer } from 'app/store/slices/online-stores';
import { packageReducer } from 'app/store/slices/package';

const combinedReducer = combineReducers({
  search: searchReducer,
  liveChat: liveChatReducer,
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
