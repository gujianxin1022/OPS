import GetData from "@/utils/axios.js";
const { $get, $post, $delete } = new GetData();

function commonThen(res) {
  const { code, data } = res.data;
  if (code === 200 || code === 0) {
    return data;
  }
  throw new Error(res.data.message);
}
function commonPageThen(res) {
  const data = res.data;
  ["pageNum", "pageSize", "total", "totalPage"].forEach((prop) => {
    const value = data[prop];
    if (value && typeof value === "string") {
      data[prop] = Number(value);
    }
  });
  return res.data;
}
/**
 * IM 功能灰度接口
 */
export function checkIMEnabled(data) {
  return $post("/opsapi/ticket/api/v1/ticket/lingo-im/opsGray", data).then(
    commonThen
  );
}
/**
 * 获取当前ops用户与学生的关系
 */
export function getRelationWithStudent(data) {
  return $get(
    "/opsapi/ticket/api/v1/ticket/lingo-im/opsUserForStudentRelation",
    data
  ).then(commonThen);
}
/**
 * 获取群聊信息（如果不存在会创建）
 */
export function getIMGroupInfo(data) {
  return $post(
    "/opsapi/ticket/api/v1/ticket/lingo-im/ops/createGroup",
    data
  ).then(commonThen);
}
/**
 * 获取单聊会话列表
 */
export function getSingleChatList(data) {
  return $post("/opsapi/ticket/api/v1/ticket/lingo-im/c2cChats", data).then(
    commonPageThen
  );
}
/**
 * 获取群聊会话列表
 */
export function getGroupChatList(data) {
  return $get("/opsapi/ticket/api/v1/ticket/lingo-im/groups", data).then(
    commonPageThen
  );
}
/**
 * 获取一个会话中的消息数据
 */
export function getConversationMessages(data, isGroup = false) {
  const path = isGroup ? "scrollGroupMessages" : "scrollC2CMessages";
  const url = "/opsapi/ticket/api/v1/ticket/lingo-im/" + path;
  return $get(url, data).then(commonThen);
}
/**
 * 获取 IM 用户签名
 */
export function getIMSignature(data) {
  return $post("/opsapi/ticket/api/v1/ticket/lingo-im/sign", data).then(
    commonThen
  );
}

/**
 * 分页查询白名单记录
 */
export function getWhiteList(data) {
  return $post(
    "/opsapi/ticket/api/v1/ticket/lingo-im/whiteListPage",
    data
  ).then(commonPageThen);
}
/**
 * 删除白名单记录
 */
export function deleteWhiteList(data) {
  return $delete("/opsapi/ticket/api/v1/ticket/lingo-im/delWhiteList", data).then(
    commonThen
  );
}
/**
 * 批量新增白名单记录
 */
export function batchAddWhiteList(data) {
  return $post(
    "/opsapi/ticket/api/v1/ticket/lingo-im/batchAddWhiteList",
    data
  ).then(commonThen);
}
/**
 * 翻译
 */
export function translateText(sourceText, targetLanguage) {
  return $post("/opsapi/ticket/api/v1/ticket/lingo-im/translate", {
    sourceText,
    targetLanguage,
  }).then(commonThen);
}
