import i18n from "@/assets/locales/index";
import Vue from "vue";

export const validateFileSize /* 校验文件大小 */ = (fileSize, size) => {
  if (fileSize / 1024 / 1024 <= size) return;
  const msg = i18n.t("上传的文件大于$M，请编辑后重新上传");
  Vue.prototype.$message.error(msg.replace("$", size));
  return Promise.reject();
};
