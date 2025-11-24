export const getConditionList = (isEn) => {
  return [
    {
      name: isEn ? "付费方式" : "付费方式",
      value: "PAYMENT_TYPE",
      termType:0
    },
    {
      name: isEn ? "用户区域" : "用户区域",
      value: "REGION",
      termType:1
    },
  ];
};

/* 任务包含状态  */
export const getConditionStatus = (isEn) => {
  return [
    {
      name: isEn ? "Included" : "包含",
      value: "in",
    },
    {
      name: isEn ? "Exclude" : "不包含",
      value: "notin",
    },
  ];
};
