import GetData from "@/utils/axios.js";
const { $get } = new GetData();

export function getIMConfig(userId) {
  return $get(
    `/opsapi/ticket/api/v1/ticket/im/config?source=ops&device=web&role=4&userId=${userId}`
  ).then((res) => {
    return res.data.data;
  });
}