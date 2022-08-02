import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { promotedOrganizationsReducer } from 'app/store/slices/promoted-organizations';
import { promotedCategoriesReducer } from 'app/store/slices/promoted-categories';
import { promotedProductsReducer } from 'app/store/slices/promoted-products';

const combinedReducer = combineReducers({
  promotedOrganizations: promotedOrganizationsReducer,
  promotedCategories: promotedCategoriesReducer,
  promotedProducts: promotedProductsReducer,
});

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState as ReturnType<typeof combinedReducer>;
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
