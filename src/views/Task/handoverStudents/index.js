import i18n from "@/assets/locales/index";
import * as Constants from "@/utils/constants";
let {
  languageEnvironmentList,
  chineseAbility,
  englishAbility,
  wordList,
  wordListEn,
  learningExperience,
  learningExperienceEn,
  chineseUsing,
  standardOrNotLang,
  parentalExpectations,
  englishWordLevelList,
  englishReadLevelList,
  englishWriteLevelList,
  timeZonesWithMin,
} = Constants.default;
// import { classRequirementslListForEn } from "@/utils/zoho_menu.js";

import { getStorage } from "@/utils/handleStorage";
import { createForm, onFormUnmount, onFieldMount } from "@formily/core";
import { getExamineDic } from "@/api/tutorManagement";
import { reqSpecialLanguagesList } from "@/api/studentManagement";
import { getCountryList } from "@/api/base";
const isEn = getStorage("localeLanguage") === "en";
const _createForm = () =>
  createForm({
    effects() {
      onFormUnmount(() => (form = _createForm()));
      onFieldMount("sopStudentReq.teachingStyle", async (field) => {
        field.loading = true;
        const {
          status,
          data: { code, data },
        } = await getExamineDic(4);
        if (status !== 200 || code !== 200) return Promise.reject();
        data.forEach((e) => {
          e.value = e.id;
          e.label = e.typeKey;
        });
        field.dataSource = data;
        field.loading = false;
      });
      onFieldMount("sopParentReq.countryOfResidence", async (field) => {
        /*居住地下拉*/
        field.loading = true;
        const {
          status,
          data: { code, data },
        } = await getCountryList();
        if (status !== 200 || code !== 200) return Promise.reject();
        data.forEach((e) => {
          e.value = e.nameZh || e.nameEn;
          e.label = `${e.nameZh}-${e.nameEn}`;
        });
        field.dataSource = data;
        field.loading = false;
      });
      onFieldMount("saveHandOverReq.specialLanguage", async (field) => {
        /*特殊语言下拉*/
        field.loading = true;
        const res = await reqSpecialLanguagesList();
        res.forEach((e) => {
          e.value = `${e.code}_${e.name}`;
          e.label = e.name;
        });
        field.dataSource = res;
        field.loading = false;
      });
    },
  });
export let form = _createForm();

export const schema = (currentInfo, isEn, taskLine) => {
  return {
    type: "object",
    properties: {
      grid: {
        type: "void",
        "x-component": "FormGrid",
        "x-component-props": {
          minColumns: 0,
          maxColumns: 4,
        },
        properties: {
          // 家长信息
          sopParentReq: {
            type: "object",
            properties: {
              tag1: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("家长信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${
                    isEn ? "130px" : "100px"
                  };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              parentAccount: {
                type: "object",
                title: i18n.t("家长ID"),
                "x-decorator": "FormItem",
                "x-component": "ParentAccount",
                "x-component-props": {
                  style: "color:#7580E5;cursor: pointer;",
                },
              },
              familyRole: {
                type: "string",
                title: i18n.t("家长关系"),
                enum: [
                  {
                    label: i18n.t("父亲"),
                    value: "1",
                  },
                  {
                    label: i18n.t("母亲"),
                    value: "2",
                  },
                  {
                    label: i18n.t("祖父/外祖父"),
                    value: "3",
                  },
                  {
                    label: i18n.t("祖母/外祖母"),
                    value: "4",
                  },
                  {
                    label: i18n.t("女父亲"),
                    value: "5",
                  },
                  {
                    label: i18n.t("男母亲"),
                    value: "6",
                  },
                  {
                    label: i18n.t("其他"),
                    value: "7",
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                },
              },
              alias: {
                type: "string",
                title: i18n.t("家长称呼"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  placeholder: i18n.t("请输入"),
                },
              },
              internalEmail: {
                type: "string",
                title: i18n.t("邮箱（内）"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  placeholder: i18n.t("请输入"),
                },
              },
              countryOfResidence: {
                type: "array",
                title: i18n.t("居住地"),
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                  multiple: false,
                  filterable: true,
                },
                required: true,
              },
              timeZone: {
                type: "string",
                title: i18n.t("时区"),
                "x-decorator": "FormItem",
                enum: timeZonesWithMin(),
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                  "@change": (val) => {
                    if ((new Date().getTimezoneOffset() + "").includes("45"))
                      /* 尼泊尔的时区比格林尼治标准时间快了5个小时又45分钟,不能命中我们的下拉项,所以不计算 */
                      return;
                    let offset = new Date().getTimezoneOffset();
                    let sign = val.includes("+") ? "+" : "-";
                    let hour, minute;
                    if (val.includes("+")) {
                      hour = val.split("+")[1].split(":")[0];
                    } else {
                      hour = val.split("-")[1].split(":")[0];
                    }
                    minute = val.split(":")[1] - 0;
                    let result = sign + (hour * 60 + minute) - 0 + offset;
                    let isPositiveNumber = result > 0 ? true : false;
                    let timeDiffHour = parseInt(Math.abs(result) / 60);
                    let timeDiffMinute = parseInt(Math.abs(result) % 60);
                    form.setValuesIn(
                      "sopParentReq.isPositiveNumber",
                      isPositiveNumber
                    );
                    form.setValuesIn("sopParentReq.hour", timeDiffHour);
                    form.setValuesIn("sopParentReq.minute", timeDiffMinute);
                  },
                },
                required: true,
              },
              timeDifference: {
                type: "void",
                title: i18n.t("时差"),
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  asterisk: true,
                  feedbackLayout: "none",
                  gridSpan: 1,
                  tooltip: i18n.t("时差计算方式tips"),
                },
                "x-component": "Space",
                properties: {
                  isPositiveNumber: {
                    type: "boolean",
                    required: true,
                    enum: [
                      {
                        label: "+",
                        value: true,
                      },
                      {
                        label: "-",
                        value: false,
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    "x-component-props": {
                      "@change": (val) => {
                        if (
                          (new Date().getTimezoneOffset() + "").includes("45")
                        )
                          /* 尼泊尔的时区比格林尼治标准时间快了5个小时又45分钟,不能命中我们的下拉项,所以不计算 */
                          return;
                        let hour = form.getValuesIn("sopParentReq.hour");
                        let minute = form.getValuesIn("sopParentReq.minute");
                        if (hour === null || minute === null) {
                          return;
                        }
                        let offset = new Date().getTimezoneOffset();
                        let timeDiff = val
                          ? `+${hour * 60 + minute}`
                          : `-${hour * 60 + minute}`;
                        const result = timeDiff - 0 - offset;
                        const timeZoonStr = `UTC${
                          result > 0 ? "+" : "-"
                        }${parseInt(Math.abs(result) / 60)}:${
                          parseInt(Math.abs(result) % 60) === 0
                            ? "00"
                            : parseInt(Math.abs(result) % 60)
                        }`;
                        form.setValuesIn("sopParentReq.timeZone", timeZoonStr);
                      },
                    },
                  },
                  hour: {
                    type: "number",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      addonAfter: i18n.t("小时"),
                    },
                    enum: [
                      { label: "0", value: 0 },
                      { label: "1", value: 1 },
                      { label: "2", value: 2 },
                      { label: "3", value: 3 },
                      { label: "4", value: 4 },
                      { label: "5", value: 5 },
                      { label: "6", value: 6 },
                      { label: "7", value: 7 },
                      { label: "8", value: 8 },
                      { label: "9", value: 9 },
                      { label: "10", value: 10 },
                      { label: "11", value: 11 },
                      { label: "12", value: 12 },
                      { label: "13", value: 13 },
                      { label: "14", value: 14 },
                      { label: "15", value: 15 },
                      { label: "16", value: 16 },
                      { label: "17", value: 17 },
                      { label: "18", value: 18 },
                      { label: "19", value: 19 },
                      { label: "20", value: 20 },
                      { label: "21", value: 21 },
                      { label: "22", value: 22 },
                      { label: "23", value: 23 },
                    ],
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: "",
                      "popper-append-to-body": false,
                      "@change": (val) => {
                        if (
                          (new Date().getTimezoneOffset() + "").includes("45")
                        )
                          /* 尼泊尔的时区比格林尼治标准时间快了5个小时又45分钟,不能命中我们的下拉项,所以不计算 */
                          return;
                        let isPositiveNumber = form.getValuesIn(
                          "sopParentReq.isPositiveNumber"
                        );
                        let minute = form.getValuesIn("sopParentReq.minute");
                        if (minute === null || isPositiveNumber === null) {
                          return;
                        }
                        let offset = new Date().getTimezoneOffset();
                        let timeDiff = isPositiveNumber
                          ? `+${val * 60 + minute}`
                          : `-${val * 60 + minute}`;
                        const result = timeDiff - 0 - offset;
                        const timeZoonStr = `UTC${
                          result > 0 ? "+" : "-"
                        }${parseInt(Math.abs(result) / 60)}:${
                          parseInt(Math.abs(result) % 60) === 0
                            ? "00"
                            : parseInt(Math.abs(result) % 60)
                        }`;
                        form.setValuesIn("sopParentReq.timeZone", timeZoonStr);
                      },
                    },
                    required: true,
                  },
                  minute: {
                    type: "number",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      addonAfter: i18n.t("分钟"),
                    },
                    enum: [
                      { label: "0", value: 0 },
                      { label: "30", value: 30 },
                    ],
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: "",
                      "popper-append-to-body": false,
                      "@change": (val) => {
                        if (
                          (new Date().getTimezoneOffset() + "").includes("45")
                        )
                          /* 尼泊尔的时区比格林尼治标准时间快了5个小时又45分钟,不能命中我们的下拉项,所以不计算 */
                          return;
                        let hour = form.getValuesIn("sopParentReq.hour");
                        let isPositiveNumber = form.getValuesIn(
                          "sopParentReq.isPositiveNumber"
                        );
                        if (hour === null || isPositiveNumber === null) {
                          return;
                        }
                        let offset = new Date().getTimezoneOffset();
                        let timeDiff = isPositiveNumber
                          ? `+${hour * 60 + val}`
                          : `-${hour * 60 + val}`;
                        const result = timeDiff - 0 - offset;
                        const timeZoonStr = `UTC${
                          result > 0 ? "+" : "-"
                        }${parseInt(Math.abs(result) / 60)}:${
                          parseInt(Math.abs(result) % 60) === 0
                            ? "00"
                            : parseInt(Math.abs(result) % 60)
                        }`;
                        form.setValuesIn("sopParentReq.timeZone", timeZoonStr);
                      },
                    },
                    required: true,
                  },
                },
              },
              studentNum: {
                type: "string",
                title: i18n.t("名下孩子"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-pattern": "readOnly",
              },

              line1: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "el-divider",
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
            },
          },
          // 学生信息
          sopStudentReq: {
            type: "object",
            properties: {
              tag2: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("学生信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${
                    isEn ? "135px" : "100px"
                  };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              realName: {
                type: "string",
                title: i18n.t("学生名字"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  placeholder: i18n.t("请输入"),
                },
              },
              equipment: {
                type: "string",
                title: i18n.t("学生名字备注"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  placeholder: i18n.t("请输入"),
                },
              },
              gender: {
                title: i18n.t("学生性别"),
                type: "number",
                required: true,
                enum: [
                  {
                    label: i18n.t("男"),
                    value: 1,
                  },
                  {
                    label: i18n.t("女"),
                    value: 2,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
              },
              createTime: {
                type: "string",
                title: i18n.t("学生创建时间"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-pattern": "readOnly",
              },
              birthday: {
                type: "string",
                title: i18n.t("学生生日"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "DatePicker",
                "x-component-props": {
                  placeholder: i18n.t("请输入"),
                },
              },
              motherTongue: {
                type: "string",
                title: i18n.t("学生母语"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  placeholder: i18n.t("请输入"),
                },
              },
              languageEnvironment: {
                type: "string",
                title: i18n.t("家庭语言环境"),
                "x-decorator": "FormItem",
                enum: languageEnvironmentList(isEn),
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                },
              },
              teachingStyle: {
                type: "array",
                title: i18n.t("期望教学风格"),
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                  multiple: true,
                  filterable: true,
                  multipleLimit: 2,
                },
                required: true,
              },
              line2: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "el-divider",
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
            },
          },
          sopStudentSubjectReq: {
            type: "object",
            properties: {
              subjectTypeId: {
                type: "number",
                "x-component-props": {
                  style: "display:hidden",
                },
                "x-reactions": [
                  {
                    target: "sopStudentSubjectReq.subjectInfoZh",
                    when: "{{$self.value==0}}",
                    fulfill: {
                      state: {
                        display: "visible",
                      },
                    },
                    otherwise: {
                      state: {
                        display: "visible",
                        display: "none",
                      },
                    },
                  },
                  {
                    target: "sopStudentSubjectReq.subjectInfoEn",
                    when: "{{$self.value==1}}",
                    fulfill: {
                      state: {
                        display: "visible",
                      },
                    },
                    otherwise: {
                      state: {
                        display: "none",
                      },
                    },
                  },
                  {
                    target: "sopStudentSubjectReq.subjectInfoJDC",
                    when: "{{$self.value==6}}",
                    fulfill: {
                      state: {
                        display: "visible",
                      },
                    },
                    otherwise: {
                      state: {
                        display: "none",
                      },
                    },
                  },
                ],
              },
              // 中文学科信息
              subjectInfoZh: {
                type: "object",
                properties: {
                  tag3: {
                    type: "void",
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "div",
                    "x-content": i18n.t("学科信息"),
                    "x-component-props": {
                      style: `background:#e3e8fe;color:#7689e8;width:${
                        isEn ? "135px" : "100px"
                      };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                    },
                    "x-decorator-props": {
                      gridSpan: 4,
                    },
                  },
                  pinyin: {
                    title: i18n.t("是否学过拼音"),
                    type: "number",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("是"),
                        value: "1",
                      },
                      {
                        label: i18n.t("否"),
                        value: "0",
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    "x-component-props": {},
                  },
                  listenSpeakAbility: {
                    type: "string",
                    title: i18n.t("中文听说能力"),
                    enum: chineseAbility(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  literacy: {
                    type: "string",
                    title: i18n.t("中文识字量"),
                    enum: isEn ? wordListEn : wordList,
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  writeAmount: {
                    type: "string",
                    title: i18n.t("中文写字量"),
                    enum: isEn ? wordListEn : wordList,
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  chineseExperience: {
                    type: "Array",
                    title: i18n.t("中文学习经历"),
                    enum: learningExperience(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                      multiple: true,
                    },
                    required: true,
                  },
                  chineseUse: {
                    type: "string",
                    title: i18n.t("中文使用情况"),
                    enum: chineseUsing(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  chineseUseLanguage: {
                    type: "string",
                    title: i18n.t("中文使用语言"),
                    enum: standardOrNotLang(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                    "x-reactions": {
                      dependencies: [
                        "sopStudentSubjectReq.subjectInfoZh.chineseUse",
                      ],
                      when: "{{$deps[0]==='4'}}",
                      fulfill: {
                        state: {
                          display: "none",
                        },
                      },
                      otherwise: {
                        state: {
                          display: "visible",
                        },
                      },
                    },
                  },
                  parentExpect: {
                    type: "array",
                    title: i18n.t("家长期望和要求"),
                    enum: parentalExpectations(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                      multiple: true,
                    },
                    required: true,
                  },
                  seat2: {
                    type: "void",
                    "x-component": "i",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 1,
                    },
                    "x-reactions": {
                      dependencies: [
                        "sopStudentSubjectReq.subjectInfoZh.chineseUse",
                      ],
                      when: "{{$deps[0]==='4'}}",
                      fulfill: {
                        state: {
                          display: "visible",
                        },
                      },
                      otherwise: {
                        state: {
                          display: "none",
                        },
                      },
                    },
                  },

                  line3: {
                    type: "void",
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "el-divider",
                    "x-decorator-props": {
                      gridSpan: 4,
                    },
                  },
                },
              },
              // 英文学科信息
              subjectInfoEn: {
                type: "object",
                properties: {
                  tag4: {
                    type: "void",
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "div",
                    "x-content": i18n.t("学科信息"),
                    "x-component-props": {
                      style: `background:#e3e8fe;color:#7689e8;width:${
                        isEn ? "135px" : "100px"
                      };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                    },
                    "x-decorator-props": {
                      gridSpan: 4,
                    },
                  },
                  englishExperience: {
                    type: "array",
                    title: i18n.t("英文学习经历"),
                    enum: learningExperienceEn(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                      multiple: true,
                    },
                    required: true,
                  },
                  studyYears: {
                    type: "string",
                    title: i18n.t("英文学习年限"),
                    enum: [
                      { label: "0", value: "0" },
                      { label: "1", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "4+", value: "4+" },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  learnedPhonics: {
                    title: i18n.t("是否学过自拼"),
                    type: "string",
                    required: true,
                    enum: [
                      {
                        label: i18n.t("是"),
                        value: "1",
                      },
                      {
                        label: i18n.t("否"),
                        value: "0",
                      },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    "x-component-props": {},
                  },
                  vocabularyLevel: {
                    type: "string",
                    title: i18n.t("英文词汇水平"),
                    enum: englishWordLevelList(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  listenSpeakLevel: {
                    type: "string",
                    title: i18n.t("英文听说能力"),
                    enum: englishAbility(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  readingLevel: {
                    type: "string",
                    title: i18n.t("英文阅读水平"),
                    enum: englishReadLevelList(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  writingLevel: {
                    type: "string",
                    title: i18n.t("英文书写水平"),
                    enum: englishWriteLevelList(isEn),
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  placementTestScore: {
                    type: "string",
                    title: i18n.t("定级测试结果"),
                    enum: [
                      { label: "Lv1", value: "Lv1" },
                      { label: "Lv2", value: "Lv2" },
                      { label: "Lv3", value: "Lv3" },
                      { label: "Lv4", value: "Lv4" },
                      { label: "Lv5", value: "Lv5" },
                      { label: "Lv6", value: "Lv6" },
                      { label: "Lv7", value: "Lv7" },
                      { label: "Lv8", value: "Lv8" },
                      { label: "Lv9", value: "Lv9" },
                      { label: "Lv10", value: "Lv10" },
                      { label: "Lv11", value: "Lv11" },
                      { label: "Lv12", value: "Lv12" },
                      { label: "Lv13", value: "Lv13" },
                      { label: "Lv14", value: "Lv14" },
                      { label: "Lv15", value: "Lv15" },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Select",
                    "x-component-props": {
                      placeholder: i18n.t("请选择"),
                      "popper-append-to-body": false,
                      filterable: true,
                    },
                    required: true,
                  },
                  seat3: {
                    type: "void",
                    "x-component": "i",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 3,
                    },
                  },
                  line4: {
                    type: "void",
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "el-divider",
                    "x-decorator-props": {
                      gridSpan: 4,
                    },
                  },
                },
              },
              // 单词通学科信息
              subjectInfoJDC: {
                type: "object",
                properties: {
                  tag3: {
                    type: "void",
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "div",
                    "x-content": i18n.t("学科信息"),
                    "x-component-props": {
                      style: `background:#e3e8fe;color:#7689e8;width:${
                        isEn ? "135px" : "100px"
                      };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                    },
                    "x-decorator-props": {
                      gridSpan: 4,
                    },
                  },
                  // classRequirements: {
                  //   type: "string",
                  //   title: i18n.t("上课需求"),
                  //   enum: classRequirementslListForEn(isEn),
                  //   "x-decorator": "FormItem",
                  //   "x-component": "Select",
                  //   "x-component-props": {
                  //     placeholder: i18n.t("请选择"),
                  //     "popper-append-to-body": false,
                  //     filterable: true,
                  //     multiple: true,
                  //     multipleLimit:3
                  //   },
                  //   required: true,
                  // },
                  note: {
                    type: "string",
                    title: i18n.t("备注"),
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "Input.TextArea",
                    "x-component-props": {
                      placeholder: i18n.t("请输入"),
                      showWordLimit: true,
                      maxlength: 2000,
                    },
                  },
                  seat4: {
                    type: "void",
                    "x-component": "i",
                    "x-decorator": "FormItem",
                    "x-decorator-props": {
                      gridSpan: 3,
                    },
                  },
                },
              },
            },
          },
          // 试听信息
          auditionClassPart: {
            type: "void",
            properties: {
              tag5: {
                type: "void",
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("试听信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${
                    isEn ? "135px" : "100px"
                  };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              shitingke: {
                type: "void",
                "x-decorator": "FormItem",
                "x-component": "AuditionInformation",
                "x-decorator-props": {
                  gridSpan: 4,
                },
                "x-component-props": {
                  studentLearningPlanId: currentInfo.course.studentPlanId,
                  studentUserId: currentInfo.studentId,
                },
              },
            },
          },
          // 报名信息
          sopLeaningPlanReq: {
            type: "object",
            properties: {
              tag6: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("报名信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${
                    isEn ? "180px" : "100px"
                  };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              dingdan: {
                title: i18n.t("订单信息"),
                type: "void",
                "x-decorator": "FormItem",
                "x-component": "OrderInformation",
                "x-decorator-props": {
                  gridSpan: 4,
                },
                "x-component-props": {
                  studentLearningPlanId: currentInfo.course.studentPlanId,
                  studentUserId: currentInfo.studentId,
                },
              },
              classType: {
                title: i18n.t("报名班型"),
                type: "number",
                enum: [
                  {
                    label: i18n.t("一对一"),
                    value: 1,
                  },
                  {
                    label: i18n.t("小班课"),
                    value: 2,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
                "x-component-props": {
                  disabled: true,
                },
              },
              courseProgress: {
                type: "array",
                title: i18n.t("版本/级别/单元/课程"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "CourseProgress",
                "x-component-props": {
                  packageId: currentInfo.course.packageId,
                  packageTreeId: currentInfo.course.packageTreeId,
                  lessonId: currentInfo.course.lessonId,
                  "@select": (ids) => {
                    form.setValuesIn("sopLeaningPlanReq.courseProgress", ids);
                  },
                },
              },
              seat4: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 2,
                },
              },
              line5: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "el-divider",
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
            },
          },
          // 交接信息
          saveHandOverReq: {
            type: "object",
            properties: {
              tag7: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("交接信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${
                    isEn ? "180px" : "100px"
                  };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              handoverType: {
                type: "string",
                "x-reactions": {
                  target: "saveHandOverReq.handoverType",
                  when: "{{$self.value==1}}",
                  fulfill: {
                    state: {
                      display: "hide",
                    },
                  },
                  otherwise: {
                    state: {
                      display: "hide",
                    },
                  },
                },
              },
              isChangeTutor: {
                title: i18n.t("是否更换老师"),
                type: "string",
                required: true,
                layout: "vertical",
                enum: [
                  {
                    label: i18n.t("是"),
                    value: 1,
                  },
                  {
                    label: i18n.t("否"),
                    value: 0,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
                "x-component-props": {},
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              expectationForTutor: {
                title: i18n.t("老师要求"),
                type: "string",
                required: true,
                layout: "vertical",
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  placeholder: i18n.t("请填写对老师的要求"),
                  maxLength: 30,
                },
                "x-decorator-props": {
                  gridSpan: 1,
                },
                "x-reactions": {
                  dependencies: ["saveHandOverReq.isChangeTutor"],
                  when: "{{$deps[0]==1}}",
                  fulfill: {
                    state: {
                      display: "visible",
                    },
                  },
                  otherwise: {
                    state: {
                      display: "none",
                    },
                  },
                },
              },
              seat4: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 3,
                },
                "x-reactions": {
                  dependencies: ["saveHandOverReq.isChangeTutor"],
                  when: "{{$deps[0]==1}}",
                  fulfill: {
                    state: {
                      display: "visible",
                    },
                  },
                  otherwise: {
                    state: {
                      display: "none",
                    },
                  },
                },
              },
              specialLanguage: {
                type: "array",
                title: i18n.t("用户服务语言偏好"),
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                  multiple: false,
                  filterable: true,
                },
                required: true,
                "x-decorator-props": {
                  tooltip: i18n.t("特殊服务语言要求提示"),
                },
              },
              seat6: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 3,
                },
              },
              classWeek: {
                type: "string",
                title: i18n.t("上课周期"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-component-props": {
                  placeholder: i18n.t("请填写上课周期或班型代码"),
                  maxLength: 200,
                },
                "x-decorator-props": {
                  tooltip: i18n.t(
                    "请填写上课周期（北京时间）或对应的班型代码，如：周一23:00; 周四23:00 或 EU1"
                  ),
                },
                "x-reactions": {
                  dependencies: ["sopLeaningPlanReq.classType"],
                  when: "{{$deps[0]==1}}",
                  fulfill: {
                    state: {
                      display: "none",
                    },
                  },
                  otherwise: {
                    state: {
                      display: "visible",
                    },
                  },
                },
              },
              seat7: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 3,
                },
                "x-reactions": {
                  dependencies: ["sopLeaningPlanReq.classType"],
                  when: "{{$deps[0]==1}}",
                  fulfill: {
                    state: {
                      display: "none",
                    },
                  },
                  otherwise: {
                    state: {
                      display: "visible",
                    },
                  },
                },
              },
              notes: {
                type: "string",
                required: true,
                title: i18n.t("交接说明"),
                "x-decorator": "FormItem",
                "x-component": "Input.TextArea",
                "x-component-props": {
                  placeholder: i18n.t("请输入"),
                  maxLength: 200,
                },
              },
              seat8: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              isHandoverCc: {
                title: i18n.t("学管是否分配给本人"),
                type: "string",
                required: true,
                layout: "vertical",
                enum: [
                  {
                    label: i18n.t("是"),
                    value: 1,
                  },
                  {
                    label: i18n.t("否"),
                    value: 0,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
                "x-component-props": {},
                "x-decorator-props": {
                  gridSpan: 4,
                  tooltip: i18n.t(
                    `1.若用户的销售和学管是同一人服务时，请选择'是'，系统将会把用户的学管分给销售；2.若用户的销售和学管不是同一人服务，请选择'否'，系统将按照正常分配规则分配学管。`
                  ),
                },
              },
            },
          },
        },
      },
    },
  };
};
import { deepClone } from "@/utils/handleData";
import moment from "moment";
import DateTimeUtils from "@/utils/datetime_utils";

// 处理zoho数据
const handleMultipleSelectStr = (str, type) => {
  if (type === "multiple") {
    if (str.startsWith("[") && str.endsWith("]")) {
      let valArr = str
        .slice(0, str.length - 1)
        .substr(1)
        .split(",");
      let _valArr = [];
      valArr.forEach((e) => {
        e = e.replace(/^\s*|\s*$/g, "");
        if (e.includes("_")) {
          _valArr.push(e.split("_")[0]);
        }
      });
      return _valArr;
    }
    return str.split(",");
  } else {
    if (str.includes("_")) {
      let _val = str.replace(/^\s*|\s*$/g, "").split("_")[0];
      return _val;
    }
    return str;
  }
};
const handleRadioStr = (str) => {
  const yesStr = `yes,Yes,YES,true,1,是`;
  const noStr = `no,No,NO,false,0，否`;
  let resultStr = "";
  if (yesStr.includes(str)) {
    resultStr = "1";
  }
  if (noStr.includes(str)) {
    resultStr = "0";
  }
  return resultStr;
};
// 初始化表单数据
export const initFormData = ({ status, data: { code, data } }, taskLine) => {
  if (status !== 200 || code !== 200 || !data || data.length <= 0)
    return {
      sopLeaningPlanReq: {},
      sopStudentReq: {},
      sopStudentSubjectReq: {},
      sopParentReq: {},
      saveHandOverReq: {
        handoverType: taskLine === 1 ? 0 : 1,
      },
    };
  const { sopParentResp, sopStudentResp, studentSubjectResp } = deepClone(data);
  // 学习计划
  const sopLeaningPlanReq = {
    classType: sopStudentResp.studentLearningPlanResp.classTypeId,
    packageTreeId: sopStudentResp.studentLearningPlanResp.packageTreeId,
    coursePackageId: sopStudentResp.studentLearningPlanResp.coursePackageId,
    lessonId: sopStudentResp.studentLearningPlanResp.lessonId,
  };
  // 学生信息
  const sopStudentReq = {
    ...sopStudentResp,
    ...sopStudentResp.handoverStudentExtResp,
  };
  sopStudentReq.createTime = DateTimeUtils.dateClockTime(
    sopStudentReq.createTime
  );
  sopStudentReq.birthday = DateTimeUtils.dateClockTime(sopStudentReq.birthday);
  if (sopStudentResp.teachingStyle && sopStudentResp.teachingStyle.length > 0) {
    const teachingStyle = [];
    sopStudentResp.teachingStyle.forEach((e) => {
      teachingStyle.push(e.id);
    });
    sopStudentReq.teachingStyle = teachingStyle;
  }
  const saveHandOverReq = {
    studentLearningPlan: sopStudentResp.studentLearningPlanResp.id,
    studentUserId: sopStudentResp.id,
    taskLine: taskLine,
    handoverType: taskLine === 1 ? 0 : 1,
    specialLanguage: sopParentResp.specialLanguage
      ? `${sopParentResp.specialLanguage}_${sopParentResp.specialLanguageDesc}`
      : sopParentResp.specialLanguage,
  };
  if (sopStudentReq?.languageEnvironment !== null) {
    sopStudentReq.languageEnvironment = handleMultipleSelectStr(
      `${sopStudentReq.languageEnvironment}`
    );
  }
  delete sopStudentReq.handoverStudentExtResp;
  delete sopStudentReq.studentLearningPlanResp;
  delete sopStudentReq.parentUserId;
  // 学科信息
  const sopStudentSubjectReq = { ...studentSubjectResp };
  sopStudentSubjectReq.subjectTypeId =
    sopStudentResp.studentLearningPlanResp.subjectTypeId;
  const subjectInfoZh = sopStudentSubjectReq.subjectInfoZh;
  const subjectInfoEn = sopStudentSubjectReq.subjectInfoEn;
  const subjectInfoJDC = sopStudentSubjectReq.subjectInfoJDC;
  // 处理多选
  if (subjectInfoZh && subjectInfoZh.parentExpect) {
    subjectInfoZh.parentExpect = handleMultipleSelectStr(
      subjectInfoZh.parentExpect,
      "multiple"
    );
  }
  if (subjectInfoZh && subjectInfoZh.chineseExperience) {
    subjectInfoZh.chineseExperience = handleMultipleSelectStr(
      subjectInfoZh.chineseExperience,
      "multiple"
    );
  }
  if (subjectInfoEn && subjectInfoEn.englishExperience) {
    const englishExperience = subjectInfoEn.englishExperience;
    subjectInfoEn.englishExperience = handleMultipleSelectStr(
      englishExperience,
      "multiple"
    );
  }

  // if (subjectInfoJDC && subjectInfoJDC.classRequirements) {
  //   const classRequirements = subjectInfoJDC.classRequirements;
  //   if (classRequirements.startsWith("[") && classRequirements.endsWith("]")) {
  //     subjectInfoJDC.classRequirements = handleMultipleSelectStr(
  //       classRequirements,
  //       "multiple"
  //     );
  //   } else {
  //     subjectInfoJDC.classRequirements = subjectInfoJDC.classRequirements.split(',');
  //   }
  // }

  // 处理单选
  if (subjectInfoZh && subjectInfoZh.chineseUse) {
    subjectInfoZh.chineseUse = handleMultipleSelectStr(
      subjectInfoZh.chineseUse
    );
  }
  if (subjectInfoZh && subjectInfoZh.chineseUseLanguage) {
    subjectInfoZh.chineseUseLanguage = handleMultipleSelectStr(
      subjectInfoZh.chineseUseLanguage
    );
  }
  if (subjectInfoZh && subjectInfoZh.listenSpeakAbility) {
    subjectInfoZh.listenSpeakAbility = handleMultipleSelectStr(
      subjectInfoZh.listenSpeakAbility
    );
  }
  if (subjectInfoZh && subjectInfoZh.pinyin) {
    subjectInfoZh.pinyin = handleMultipleSelectStr(subjectInfoZh.pinyin);
    subjectInfoZh.pinyin = handleRadioStr(subjectInfoZh.pinyin);
  }
  if (subjectInfoEn && subjectInfoEn.learnedPhonics) {
    subjectInfoEn.learnedPhonics = handleMultipleSelectStr(
      subjectInfoEn.learnedPhonics
    );
    subjectInfoEn.learnedPhonics = handleRadioStr(subjectInfoEn.learnedPhonics);
  }
  if (subjectInfoEn && subjectInfoEn.listenSpeakLevel) {
    subjectInfoEn.listenSpeakLevel = handleMultipleSelectStr(
      subjectInfoEn.listenSpeakLevel
    );
  }
  if (subjectInfoEn && subjectInfoEn.readingLevel) {
    subjectInfoEn.readingLevel = handleMultipleSelectStr(
      subjectInfoEn.readingLevel
    );
  }
  if (subjectInfoEn && subjectInfoEn.writingLevel) {
    subjectInfoEn.writingLevel = handleMultipleSelectStr(
      subjectInfoEn.writingLevel
    );
  }

  // 家长信息
  let isPositiveNumber, time, hour, minute;
  if (sopParentResp.timeDifference !== null) {
    isPositiveNumber = sopParentResp.timeDifference > 0 ? true : false;
    time = sopParentResp.timeDifference + "";
    hour = parseInt(time.startsWith("-") ? time.substr(1) / 60 : time / 60);
    minute = parseInt(time.startsWith("-") ? time.substr(1) % 60 : time % 60);
    if (sopParentResp.timeDifference == 0) {
      isPositiveNumber = null;
      hour = null;
      minute = null;
    }
  } else {
    isPositiveNumber = null;
    hour = null;
    minute = null;
  }
  if (sopParentResp?.familyRole !== null) {
    sopParentResp.familyRole = handleMultipleSelectStr(
      `${sopParentResp.familyRole}`
    );
  }
  const sopParentReq = {
    ...sopParentResp,
    parentAccount: { name: sopParentResp.id, id: sopParentResp.id },
    isPositiveNumber: isPositiveNumber,
    hour: hour,
    minute: minute,
  };

  const formData = {
    sopLeaningPlanReq,
    sopStudentReq,
    sopStudentSubjectReq,
    sopParentReq,
    saveHandOverReq,
  };
  return formData;
};
// 构建任务提交参数
export const constructionParams = (params) => {
  /* 处理多选的中英文期望 array=>string */
  const subjectInfoZh = params.sopStudentSubjectReq.subjectInfoZh;
  const subjectInfoEn = params.sopStudentSubjectReq.subjectInfoEn;
  const subjectInfoJDC = params.sopStudentSubjectReq.subjectInfoJDC;

  if (subjectInfoZh && subjectInfoZh.parentExpect) {
    subjectInfoZh.parentExpect = subjectInfoZh.parentExpect.join(",");
  }
  if (subjectInfoEn && subjectInfoEn.englishExperience) {
    subjectInfoEn.englishExperience = subjectInfoEn.englishExperience.join(",");
  }
  // if (subjectInfoJDC && subjectInfoJDC.classRequirements) {
  //   subjectInfoJDC.classRequirements =
  //     subjectInfoJDC.classRequirements.join(",");
  // }
  /*处理日期 常规=>utc */
  params.sopStudentReq.birthday = moment(
    `${params.sopStudentReq.birthday}`
  ).toISOString();
  params.sopStudentReq.createTime = moment(
    `${params.sopStudentReq.createTime}`
  ).toISOString();
  /* 处理时差 int */
  params.sopParentReq.timeDifference = parseInt(
    (params.sopParentReq.isPositiveNumber ? "+" : "-") +
      (params.sopParentReq.hour * 60 + params.sopParentReq.minute)
  );
  params.sopParentReq.specialLanguage =
    params.saveHandOverReq === 0
      ? ""
      : params.saveHandOverReq.specialLanguage || "";
  /* 处理多学科：保留一个多学科参数 */
  if (params.sopStudentSubjectReq.subjectTypeId === 0) {
    const { subjectInfoZh } = params.sopStudentSubjectReq;
    if (subjectInfoZh && subjectInfoZh.chineseExperience) {
      subjectInfoZh.chineseExperience =
        subjectInfoZh.chineseExperience.join(",");
    }
    delete params.sopStudentSubjectReq.subjectInfoEn;
    delete params.sopStudentSubjectReq.subjectInfoJDC;
  }
  if (params.sopStudentSubjectReq.subjectTypeId === 1) {
    delete params.sopStudentSubjectReq.subjectInfoEn.writeAmount;
    delete params.sopStudentSubjectReq.subjectInfoZh;
    delete params.sopStudentSubjectReq.subjectInfoJDC;
  }
  if (params.sopStudentSubjectReq.subjectTypeId === 6) {
    delete params.sopStudentSubjectReq.subjectInfoZh;
    delete params.sopStudentSubjectReq.subjectInfoEn;
  }
  /* 处理学生进度 [editionId, levelId, unitId, lessonId]=>packageTreeId:editionId;lessonId:lessonId */
  if (params.sopLeaningPlanReq.courseProgress.length > 0) {
    params.sopLeaningPlanReq.packageTreeId =
      params.sopLeaningPlanReq.courseProgress[0];
    params.sopLeaningPlanReq.lessonId =
      params.sopLeaningPlanReq.courseProgress.at(-1);
  }
  delete params.sopLeaningPlanReq.courseProgress;
  delete params.sopParentReq.parentAccount;
  delete params.saveHandOverReq.familyLa;
  delete params.sopStudentReq.createTime;
  delete params.sopLeaningPlanReq.classType;
  delete params.sopParentReq.hour;
  delete params.sopParentReq.minute;
  delete params.sopParentReq.isPositiveNumber;
  delete params.sopParentReq.studentNum;
  delete params.sopParentReq.username;
  delete params.saveHandOverReq.specialLanguage;
  return params;
};
