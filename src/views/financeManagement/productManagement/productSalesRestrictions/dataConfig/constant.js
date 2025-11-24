/* ops用户条件列表 */
export const getOPSConditionList = (isEn) => {
  return [
    {
      name: isEn ? "Departments" : "岗位树",
      value: 0,
    },
  ];
};

/* c端用户条件列表 */
export const getCUserConditionList = (isEn) => {
  return [
    {
      name: isEn ? "Channel" : "用户渠道",
      value: 0,
    },
    {
      name: isEn ? "New/Renewal" : "新签/续费",
      value: 1,
    },
  ];
};

/* 用户新签/续费标签列表 */

export const getNewSigningOrRenewalList = (isEn) => {
  return [
    {
      name: isEn ? "new bookings on platform" : "平台新签",
      value: 1,
    },
    {
      name: isEn ? "renew bookings on platform" : "平台续费",
      value: 2,
    },
    {
      name: isEn ? "new bookings of this subject" : "单学科新签",
      value: 3,
    },
    {
      name: isEn ? "renew bookings of this subject" : "单学科续费",
      value: 4,
    },
    {
      name: isEn ? "cross-selling new bookings" : "扩科新签",
      value: 5,
    },
  ];
};
import {
  CONDITION_STATUS,
} from "./enum";

/* 任务包含状态  */
export const getConditionStatus = (isEn) => {
  return [
    {
      name: isEn ? "Included" : "包含",
      value: CONDITION_STATUS.CONTAINE,
    },
    {
      name: isEn ? "Exclude" : "不包含",
      value: CONDITION_STATUS.EXCLUDE,
    },
  ];
};
