export const openAccountSettings = () => {
  window.dispatchEvent(new CustomEvent("open-account-settings"));
};
