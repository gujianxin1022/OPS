export const getAppTypeList = (isEn) => {
  return [
    {
      name: isEn ? "student" : "student",
      value: 1,
    },
    {
      name: isEn ? "parent" : "parent",
      value: 2,
    },
  ];
};

export const getVersionTypeList = (isEn) => {
  return [
    {
      name: isEn ? "正式版本" : "正式版本",
      value: 0,
    },
    {
      name: isEn ? "灰度版本" : "灰度版本",
      value: 1,
    },
  ];
};

export const filterVersionType = (value, isEn) => {
  const valueMap = {
    0: isEn ? "正式版本" : "正式版本",
    1: isEn ? "灰度版本" : "灰度版本",
  };
  return valueMap[value] || "--";
};

export const getPlatformTypeList = (isEn) => {
  return [
    {
      name: isEn ? "android" : "android",
      value: 1,
    },
    {
      name: isEn ? "iOS" : "iOS",
      value: 2,
    },
  ];
};

export const filterPlatformType = (value, isEn) => {
  const valueMap = {
    1: isEn ? "android" : "android",
    2: isEn ? "iOS" : "iOS",
  };
  return valueMap[value] || "--";
};

export const getForceTypeList = (isEn) => {
  return [
    {
      name: isEn ? "不强制" : "不强制",
      value: 1,
    },
    {
      name: isEn ? "强制" : "强制",
      value: 2,
    },
  ];
};

export const filterForceType = (value, isEn) => {
  const valueMap = {
    1: isEn ? "不强制" : "不强制",
    2: isEn ? "强制" : "强制",
  };
  return valueMap[value] || "--";
};
