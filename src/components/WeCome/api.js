import GetData from "@/utils/axios.js";
const { $get, $post, $delete } = new GetData();

function commonThen(res) {
  const { code, data, message } = res.data;
  if (code === 200 || code === 0) {
    return data;
  }
  throw new Error(message);
}

const api = {
  /**
   * 获取用户的企业微信绑定地址
   * @param {boolean} force 是否强制获取，默认false。true: 强制获取，用于更换绑定场景；false: 不强制获取，如果已经绑定的用户则不会返回url
   */
  getUserWecomeBindUrl(force = false) {
    const redirectUrl = encodeURIComponent(`${location.origin}/wecome/bind`);
    // const redirectUrl = encodeURIComponent(`https://b-ops.lingoace.com/wecome/bind`);
    let path = `/opsapi/usercenter-service/api/v1/pub/usercenter/user/info/bind/qrcode?url=${redirectUrl}`;
    if (force) {
      path += "&force=1";
    }
    return $get(path).then(commonThen);
  },
  /**
   * 企业微信回跳场景下，查询企业微信绑定状态
   */
  bindWeCome(code, state) {
    return $post(
      `/opsapi/usercenter-service/api/v1/pub/usercenter/user/info/bindwechat`,
      {
        code,
        state,
      }
    );
  },
};

export default api;
