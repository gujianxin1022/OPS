import router from "../../router/index";
// IM 中的角色
export function getRoleList(isEn) {
  return [
    {
      name: isEn ? "Parent" : "家长",
      value: 1,
    },
    // {
    //   name: isEn ? "Student" : "学生",
    //   value: 2,
    // },
    {
      name: isEn ? "Teacher" : "老师",
      value: 3,
    },
    {
      name: isEn ? "CC" : "顾问",
      value: 4,
    },
    {
      name: isEn ? "LA" : "学管",
      value: 5,
    },
  ];
}
/**
 * 获取角色名称
 * @param {Number} role 角色值
 * @param {Boolean} isEn 获取英文名称
 * @returns role name
 */
export function toRoleName(role, isEn) {
  const roleList = getRoleList(isEn);
  const targetRole = roleList.find((item) => item.value === role);
  return targetRole ? targetRole.name : "";
}
/**
 * 将特定格式的用户 ID 转换为我们的用户 ID。例如：p-123456 -> 123456
 */
export function toOurUserId(str) {
  if (str && typeof str === "string") {
    const list = str.split("-");
    return list.length === 2 ? list[1] : str;
  }
  return str;
}
/**
 * 创建IM消息通知
 * @param {Object} msg IM 消息对象
 */
export async function createNotification(msg) {
  console.log("createNotification:", msg);
  // 检查浏览器通知权限
  if (Notification.permission !== "denied") {
    await Notification.requestPermission();
  }
  if (Notification.permission !== "granted") {
    return;
  }
  let msgContent = "";
  // 消息类型
  switch (msg.type) {
    // 文本消息内容
    case "TIMTextElem":
      msgContent = msg.payload.text;
      break;
    case "TIMImageElem":
      msgContent = "[image]";
      break;
  }
  const title = msg.nick || "您有一条新消息"; // 优先取消息发送者的昵称
  const ntfOptions = {
    body: msgContent,
    icon: msg.avatar,
  };
  const notification = new Notification(title, ntfOptions);
  notification.addEventListener("click", (event) => {
    // console.log("当点击通知时：", event);
    event.target.close();
    window.focus();
    // 显示 IM 页面
    router.push({
      name: "im",
      query: {
        groupId: msg.conversationType === "GROUP" ? msg.to : undefined,
      },
    });
  });
}
// IM 窗口对象
let imTabWindow = null;
/**
 * 使用浏览器新 Tab 标签页的形式打开IM聊天页面
 */
export function openIMWindow({ roleCode, groupId }) {
  const tabName = "ops_im_tab";
  try {
    if (!imTabWindow || imTabWindow.closed) {
      const url = getIMUrl({ roleCode, groupId });
      // 使用第二个参数指定上下文名称，再次调用时可以复用同一个窗口。但是tab会重新加载
      const openWindow = window.open(url, tabName);
      if (openWindow === null) {
        alert("您的浏览器阻止了新窗口打开，请在浏览器设置中允许弹出窗口");
      } else {
        imTabWindow = openWindow;
      }
    } else {
      // 如果窗口已经打开，则聚焦
      imTabWindow.focus();
    }
  } catch (error) {
    console.error("openIMWindow error:", error);
  }
}
/**
 * 拼接IM聊天页面的URL
 */
export function getIMUrl({ roleCode, groupId }) {
  const jsonStr = localStorage.getItem("userInfo");
  const userInfo = jsonStr ? JSON.parse(jsonStr) : null;
  if (!userInfo) {
    throw new Error("No userInfo");
  }
  const lang = localStorage.getItem("localeLanguage") || "en";
  const id = userInfo.id;
  const nickName = userInfo.nickName || userInfo.username || "";
  const avatar = userInfo.avatar || "";
  const token = userInfo.jwtToken;
  roleCode = roleCode || 5;
  let url = `${process.env.VUE_APP_IM_URL}/?source=ops&lang=${lang}&userId=${id}&roleCode=${roleCode}&nickName=${nickName}&avatar=${avatar}&token=${token}`;
  if (groupId) {
    // 指定群聊
    url += `&groupId=${groupId}`;
  }
  return url;
}
