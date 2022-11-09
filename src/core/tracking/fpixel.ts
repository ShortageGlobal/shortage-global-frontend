export const pageview = () => {
  // window.fbq('track', 'PageView');
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  // window.fbq('track', name, options);
};

// https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-events
export const custom = (name, options = {}) => {
  // window.fbq('trackCustom', name, options);
};
