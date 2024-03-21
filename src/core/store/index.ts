import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { userReducer } from 'core/store/slices/user';
import { liveChatReducer } from 'core/store/slices/live-chat';
import { searchReducer } from 'core/store/slices/search';
import { notificationsReducer } from 'core/store/slices/notifications';
import { cartReducer } from 'core/store/slices/cart';
import { promotedOrganizationsReducer } from 'core/store/slices/promoted-organizations';
import { promotedExternalOrganizationsReducer } from 'core/store/slices/promoted-external-organizations';
import { promotedCategoriesReducer } from 'core/store/slices/promoted-categories';
import { promotedProductsReducer } from 'core/store/slices/promoted-products';
import { promotedBlogPostsReducer } from 'core/store/slices/promoted-blog-posts';
import { shortageBlogPostsReducer } from 'core/store/slices/shortage-blog-posts';
import { organizationReducer } from 'core/store/slices/organization';
import { campaignsReducer } from 'core/store/slices/campaigns';
import { campaignReducer } from 'core/store/slices/campaign';
import { campaignCategoriesReducer } from 'core/store/slices/campaign-categories';
import { campaignProductsReducer } from 'core/store/slices/campaign-products';
import { campaignProductReducer } from 'core/store/slices/campaign-product';
import { categoriesReducer } from 'core/store/slices/categories';
import { productsReducer } from 'core/store/slices/products';
import { organizationBlogPostsReducer } from 'core/store/slices/organization-blog-posts';
import { productReducer } from 'core/store/slices/product';
import { instructionsReducer } from 'core/store/slices/instructions';
import { packageReducer } from 'core/store/slices/package';
import { packageBlogPostsReducer } from 'core/store/slices/package-blog-posts';
import { accountOrganizationReducer } from 'core/store/slices/account-organization';
import { accountDeliveryInstructionsReducer } from 'core/store/slices/account-delivery-instruction';
import { accountProductReducer } from 'core/store/slices/account-product';
import { accountCampaignReducer } from 'core/store/slices/account-campaign';
import { accountBlogPostReducer } from 'core/store/slices/account-blog-post';
import { accountOrganizationPackageReducer } from 'core/store/slices/account-organization-package';

const combinedReducer = combineReducers({
  user: userReducer,
  liveChat: liveChatReducer,
  search: searchReducer,
  notifications: notificationsReducer,
  cart: cartReducer,
  promotedOrganizations: promotedOrganizationsReducer,
  promotedExternalOrganizations: promotedExternalOrganizationsReducer,
  promotedCategories: promotedCategoriesReducer,
  promotedProducts: promotedProductsReducer,
  promotedBlogPosts: promotedBlogPostsReducer,
  shortageBlogPosts: shortageBlogPostsReducer,
  organization: organizationReducer,
  campaigns: campaignsReducer,
  campaign: campaignReducer,
  campaignCategories: campaignCategoriesReducer,
  campaignProducts: campaignProductsReducer,
  campaignProduct: campaignProductReducer,
  categories: categoriesReducer,
  products: productsReducer,
  organizationBlogPosts: organizationBlogPostsReducer,
  product: productReducer,
  instructions: instructionsReducer,
  package: packageReducer,
  packageBlogPosts: packageBlogPostsReducer,
  accountOrganization: accountOrganizationReducer,
  accountDeliveryInstructions: accountDeliveryInstructionsReducer,
  accountProduct: accountProductReducer,
  accountCampaign: accountCampaignReducer,
  accountBlogPost: accountBlogPostReducer,
  accountOrganizationPackage: accountOrganizationPackageReducer,
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

    // preserve some state on client side navigation
    nextState.user = state.user;
    nextState.cart = state.cart;
    nextState.notifications = state.notifications;

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
  // debug: process.env.NODE_ENV === 'development',
});
