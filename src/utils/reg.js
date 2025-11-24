export const parentIdValidate = (instance, id) => {
  if (!/^[0-9]{10,}$/.test(id)) {
    instance.$notify.error({
      title: instance.$t("提示"),
      message: instance.$t("请输入正确的家长ID格式"),
    });
    return false;
  }
  return true;
};

export const studentIdValidate = (instance, id) => {
  if (!/^[0-9]{10,}$/.test(id)) {
    instance.$notify.error({
      title: instance.$t("提示"),
      message: instance.$t("请输入正确的学生ID格式"),
    });
    return false;
  }
  return true;
};
