export const toSSOPage = () => {
  let url=`${process.env.VUE_APP_AUTH_URL}/ops`
  window.location.href = `${process.env.VUE_APP_BASE_API}/opsapi/manage/user/auth/oauth2/url?redirectUri=${encodeURIComponent(url)}`;
};

export const toSSOLogOutPage = () => {
  let url=`${process.env.VUE_APP_BASE_API}/login`
  window.location.href = `${process.env.VUE_APP_BASE_API}/opsapi/manage/user/auth/oauth2/logout?redirectUri=${encodeURIComponent(url)}`;
};