export const RevenueType = {
  ConfirmMoney: 1, // 确认收入
  ConfirmMoneyRefund: 2, //确认收入退款
  FreeCourse: 3, //免费课
  FreeScore: 4, //免费分
  PayScore: 5, //付费分
};

export const RevenueTypeTop = {
  Course: 1, // 课包收入相关
  Points: 2, // 赠送课和积分相关
  Class: 3, //免费课
};

export const buList = (isEn) => {
  return [
    {
      name: isEn ? "Chinese Live" : "中文直播",
      value: "chinese_live",
    },
    {
      name: isEn ? "English Live" : "英文直播",
      value: "english_live",
    },
  ];
};

export const revenueTypeTopList = (isEn) => {
  return [
    {
      name: isEn ? "Recognized revenue" : "课包收入相关",
      value: RevenueTypeTop.Course,
    },
    {
      name: isEn
        ? "Coin"
        : "积分相关",
      value: RevenueTypeTop.Points,
    },
    {
      name: isEn ? "Free lesson" : "免费课相关",
      value: RevenueTypeTop.Class,
    },
  ];
};

export const revenueTypeList = (isEn) => {
  return [
    {
      name: isEn ? "确认收入" : "确认收入",
      value: RevenueType.ConfirmMoney,
    },
    {
      name: isEn ? "确认收入退款" : "确认收入退款",
      value: RevenueType.ConfirmMoneyRefund,
    },
    {
      name: isEn ? "免费课" : "免费课",
      value: RevenueType.FreeCourse,
    },
    {
      name: isEn ? "免费分" : "免费分",
      value: RevenueType.FreeScore,
    },
    {
      name: isEn ? "付费分" : "付费分",
      value: RevenueType.PayScore,
    },
  ];
};

export const revenueTypeFilter = (isEn, code) => {
  const arr1 = [1, 2, 3, 4];
  const arr2 = [5, 6, 7, 8];
  const arr3 = [9, 10];
  if (arr1.includes(code)) {
    return isEn ? "revenue" : "确认收入";
  } else if (arr2.includes(code)) {
    return isEn ? "Points" : "积分";
  } else if (arr3.includes(code)) {
    return isEn ? "Free Classes" : "免费课";
  } else {
    return "-";
  }
};

export const pushStatusList = (isEn) => {
  return [
    {
      name: isEn ? "Unpublished" : "未推送",
      value: 0,
    },
    {
      name: isEn ? "Published" : "已推送",
      value: 1,
    },
  ];
};

export const keymaps = {
  id: null,
  source: null, // 1 课包收入相关 2 赠送课和积分相关
  type: null, // 1 确认收入 2  确认收入退款 3 免费课  4   免费分  5 付费分
  submit: null, // 0 草稿模式 1 已记账
  journalLineExternalReferenceId: null,
  companyReferenceIdType: null,
  companyReferenceId: null,
  currency: null,
  ledgerType: null,
  accountingDate: null,
  journalSource: null,
  journalEntryMemo: null,
  lineOrder: null,
  lineCompanyReferenceIdType: null,
  ledgerAccountReferenceIdParentIdType: null,
  ledgerAccountReferenceIdParentId: null,
  ledgerAccountReferenceIdType: null,
  ledgerAccountReferenceId: null,
  debitAmount: null,
  creditAmount: null,
  lineCurrency: null,
  lineMemo: null,
  worktagCostCenterReferenceId: null,
  worktagSpendCategoryId: null,
  worktagRevenueCategoryId: null,
  worktagSalesItemId: null,
  worktagPurchaseItemId: null,
  worktagBankAccountId: null,
  worktagCashflowId: null,
  worktagBusinessUnitId: null,
  worktagSalesRegion: null,
  worktagSupplierReferenceId: null,
  worktagCompanyReferenceId: null,
  worktagEmployeeId: null,
  worktagTaxApplicabilityId: null,
  uploadStatus: null, // 0 未 1 已
  createTime: null,
};
