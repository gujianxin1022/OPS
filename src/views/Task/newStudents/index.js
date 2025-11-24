import i18n from "@/assets/locales/index";
import * as Constants from "@/utils/constants";
import DateTimeUtils from "@/utils/datetime_utils";

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
  parentalExpectationsEn,
} = Constants.default;
import { createForm, onFormUnmount, onFieldMount } from "@formily/core";
import { getExamineDic } from "@/api/tutorManagement";
const _createForm = () =>
  createForm({
    effects() {
      onFormUnmount(() => (form = _createForm()));
      onFieldMount("sopStudentReq.teachingStyle", async (field) => {
        /* 教学风格 */
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
    },
  });
export let form = _createForm();
export const schema = (currentInfo, isEn) => {
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
          // 交接单信息
          handoverInfoPart: {
            type: "void",
            properties: {
              tag: {
                type: "void",
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("交接单信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${isEn ? "200px" : "100px"
                    };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              handoverUserName: {
                type: "string",
                title: i18n.t("交接人"),
                "x-decorator": "FormItem",
                "x-component": "TextDisplay",
              },
              handoverUserPhone: {
                type: "string",
                title: i18n.t("手机号"),
                "x-decorator": "FormItem",
                "x-component": "TextDisplay",
              },
              handoverUserWechat: {
                type: "string",
                title: i18n.t("微信"),
                "x-decorator": "FormItem",
                "x-component": "TextDisplay",
              },
              isChangeTutor: {
                type: "string",
                title: i18n.t("是否更换老师"),
                "x-decorator": "FormItem",
                "x-component": "TextDisplay",
              },
              expectationForTutor: {
                type: "string",
                title: i18n.t("老师要求"),
                "x-decorator": "FormItem",
                "x-component": "TextDisplay",
                "x-decorator-props": {
                  gridSpan: 1,
                },
                "x-reactions": [
                  {
                    target: "expectationForTutor",
                    when: "{{$self.value!==null}}",
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
                  },]
              },
              classWeek: {
                type: "string",
                title: i18n.t("上课周期"),
                "x-decorator": "FormItem",
                "x-component": "TextDisplay",
                "x-decorator-props": {
                  tooltip: i18n.t(
                    "上课周期（北京时间）或对应的班型代码，如：周一23:00; 周四23:00 或 EU1"
                  ),
                },
              },
              notes: {
                type: "object",
                title: i18n.t("交接说明"),
                "x-decorator": "FormItem",
                "x-component": "TextDisplay",
                "x-decorator-props": {
                  gridSpan: 3,
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
                'x-component-props': {
                  "studentLearningPlanId": currentInfo.studentLearningPlanResp.id,
                  "studentUserId": currentInfo.studentUserId
                }
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
          // 试听信息
          auditionClassPart: {
            type: "void",
            properties: {
              tag: {
                type: "void",
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("试听信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${isEn ? "135px" : "100px"
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
                'x-component-props': {
                  "studentLearningPlanId": currentInfo.studentLearningPlanResp.id,
                  "studentUserId": currentInfo.studentUserId,
                }
              },
            },
          },
          // 家长信息
          sopParentReq: {
            type: "object",
            properties: {
              tag: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("家长信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${isEn ? "130px" : "100px"
                    };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              parentAccount: {
                type: "object",
                title: i18n.t("家长账号"),
                "x-decorator": "FormItem",
                "x-component": "ParentAccount",
                "x-component-props": {
                  style: "color:#7580E5;cursor: pointer;",
                },
              },
              internalPhone: {
                type: "string",
                required: true,
                title: i18n.t("手机号码（内）"),
                "x-decorator": "FormItem",
                "x-component": "Input",
              },
              internalEmail: {
                type: "string",
                title: i18n.t("邮箱（内）"),
                "x-decorator": "FormItem",
                "x-component": "Input",
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
                  "popper-append-to-body": false,
                },
              },
              countryOfResidence: {
                type: "string",
                title: i18n.t("居住地"),
                "x-decorator": "FormItem",
                "x-component": "Input",
              },
              studentNum: {
                type: "number",
                title: i18n.t("学生账户数量"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-pattern": "readOnly",
              },
              seat1: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 2,
                },
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
          // 学生信息
          sopStudentReq: {
            type: "object",
            properties: {
              tag: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("学生信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${isEn ? "135px" : "100px"
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
              },
              equipment: {
                type: "string",
                title: i18n.t("学生名字备注"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "Input",
              },
              createTime: {
                type: "string",
                title: i18n.t("学生创建时间"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-pattern": "readOnly",
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
                "x-component-props": {},
              },
              birthday: {
                type: "string",
                title: i18n.t("学生生日"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "DatePicker",
                "x-component-props": {
                  "@change": (val) => {
                    const age = DateTimeUtils.birthdayMapToAge(val);
                    form.setValuesIn("sopStudentReq.age", age);
                  },
                },
              },
              age: {
                type: "number",
                title: i18n.t("学生年龄"),
                "x-decorator": "FormItem",
                "x-component": "Input",
                "x-pattern": "readOnly",
              },
              motherTongue: {
                type: "string",
                title: i18n.t("学生母语"),
                required: true,
                "x-decorator": "FormItem",
                "x-component": "Input",
              },
              languageEnvironment: {
                type: "string",
                title: i18n.t("家庭语言环境"),
                required: true,
                "x-decorator": "FormItem",
                enum: languageEnvironmentList(isEn),
                "x-component": "Select",
                "x-component-props": {
                  placeholder: "",
                  "popper-append-to-body": false,
                },
              },
              teachingStyle: {
                type: "array",
                title: i18n.t("期望教学风格"),
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-component-props": {
                  placeholder: "",
                  "popper-append-to-body": false,
                  multiple: true,
                  filterable: true,
                },
                required: true,
              },
              seat2: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 3,
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
          // 学科信息
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
                ],
              },
              // 中文学科信息
              subjectInfoZh: {
                type: "object",
                properties: {
                  tag: {
                    type: "void",
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "div",
                    "x-content": i18n.t("学科信息"),
                    "x-component-props": {
                      style: `background:#e3e8fe;color:#7689e8;width:${isEn ? "135px" : "100px"
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
                        value: '1',
                      },
                      {
                        label: i18n.t("否"),
                        value: '0',
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
                    'x-reactions': {
                      dependencies: ['sopStudentSubjectReq.subjectInfoZh.chineseUse'],
                      'when': "{{$deps[0]==='4'}}",
                      fulfill: {
                        state: {
                          display: 'none',
                        },
                      },
                      otherwise: {
                        state: {
                          display: 'visible',
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
                  seat21: {
                    type: 'void',
                    'x-component': 'i',
                    'x-decorator': 'FormItem',
                    'x-decorator-props': {
                      gridSpan: 1,
                    },
                    'x-reactions': {
                      dependencies: ['sopStudentSubjectReq.subjectInfoZh.chineseUse'],
                      'when': "{{$deps[0]==='4'}}",
                      fulfill: {
                        state: {
                          display: 'visible',
                        },
                      },
                      otherwise: {
                        state: {
                          display: 'none',
                        },
                      },
                    },
                  },
                },
              },
              // 英文学科信息
              subjectInfoEn: {
                type: "object",
                properties: {
                  tag: {
                    type: "void",
                    required: true,
                    "x-decorator": "FormItem",
                    "x-component": "div",
                    "x-content": i18n.t("学科信息"),
                    "x-component-props": {
                      style: `background:#e3e8fe;color:#7689e8;width:${isEn ? "135px" : "100px"
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
                        value: '1',
                      },
                      {
                        label: i18n.t("否"),
                        value: '0',
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
                },
              },
              classType: {
                title: i18n.t("报名班型"),
                type: "number",
                required: true,
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
                'x-component-props': {
                  disabled: true
                },
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
              },
              courseProgress: {
                type: 'array',
                title: i18n.t('版本/级别/单元/课程'),
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'CourseProgress',
                'x-component-props': {
                  "packageId": currentInfo.studentLearningPlanResp.coursePackageId,
                  "packageTreeId": currentInfo.studentLearningPlanResp.packageTreeId,
                  "lessonId": currentInfo.studentLearningPlanResp.lessonId,
                  '@select': (ids) => {
                    form.setValuesIn("sopStudentSubjectReq.courseProgress", ids);
                  }
                }
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
          // 确认上课信息
          doTaskParam: {
            type: "object",
            properties: {
              tag: {
                type: "void",
                required: true,
                "x-decorator": "FormItem",
                "x-component": "div",
                "x-content": i18n.t("确认上课信息"),
                "x-component-props": {
                  style: `background:#e3e8fe;color:#7689e8;width:${isEn ? "200px" : "100px"
                    };height:26px;line-height:26px;text-align: center;border-radius: 0 8px 0 0;`,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              },
              weekClassesNumber: {
                type: "string",
                title: i18n.t("每周课频"),
                enum: [
                  { label: 1, value: 1 },
                  { label: 2, value: 2 },
                  { label: 3, value: 3 },
                  { label: 4, value: 4 },
                  { label: 5, value: 5 },
                  { label: 6, value: 6 },
                  { label: 7, value: 7 },
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
              notClassWeek: {
                type: "array",
                title: i18n.t("不排课"),
                enum: [
                  { value: "周一", label: i18n.t("周一") },
                  { value: "周二", label: i18n.t("周二") },
                  { value: "周三", label: i18n.t("周三") },
                  { value: "周四", label: i18n.t("周四") },
                  { value: "周五", label: i18n.t("周五") },
                  { value: "周六", label: i18n.t("周六") },
                  { value: "周日", label: i18n.t("周日") },
                ],
                "x-decorator": "FormItem",
                "x-component": "Select",
                "x-component-props": {
                  placeholder: i18n.t("请选择"),
                  "popper-append-to-body": false,
                  filterable: true,
                  multiple: true
                },
              },
              learningTools: {
                type: "string",
                title: i18n.t("上课设备"),
                enum: [
                  { value: "iPad", label: "iPad" },
                  { value: "安卓平板", label: i18n.t("安卓平板") },
                  { value: "WindowsPC", label: "WindowsPC" },
                  { value: "MacBook", label: "MacBook" },
                  { value: "其他", label: i18n.t("其他") },
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
              seat4: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
              },
              leaveRules: {
                title: i18n.t("请假规则"),
                type: "number",
                required: true,
                enum: [
                  {
                    label: i18n.t("已沟通"),
                    value: 1,
                  },
                  {
                    label: i18n.t("未沟通"),
                    value: 0,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
                "x-component-props": {},
              },
              refundRules: {
                title: i18n.t("退费规则"),
                type: "number",
                required: true,
                enum: [
                  {
                    label: i18n.t("已沟通"),
                    value: 1,
                  },
                  {
                    label: i18n.t("未沟通"),
                    value: 0,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
                "x-component-props": {},
              },
              appTraining: {
                title: i18n.t("APP使用"),
                type: "number",
                required: true,
                enum: [
                  {
                    label: i18n.t("已沟通"),
                    value: 1,
                  },
                  {
                    label: i18n.t("未沟通"),
                    value: 0,
                  },
                ],
                "x-decorator": "FormItem",
                "x-component": "Radio.Group",
                "x-component-props": {},
              },
              seat5: {
                type: "void",
                "x-component": "i",
                "x-decorator": "FormItem",
                "x-decorator-props": {
                  gridSpan: 1,
                },
              },
              contactDetails: {
                type: "string",
                title: i18n.t("沟通方式"),
                enum: [
                  { value: "电话", label: i18n.t("电话") },
                  { value: "企业微信", label: i18n.t("企业微信") },
                  { value: "个人微信", label: i18n.t("个人微信") },
                  { value: "WhatsApp", label: "WhatsApp" },
                  { value: "Line", label: "Line" },
                  { value: "邮箱", label: i18n.t("邮箱") },
                  { value: "视频", label: i18n.t("视频") },
                  { value: "其他", label: i18n.t("其他") },
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
              notes: {
                type: "string",
                required: true,
                title: i18n.t("更多信息"),
                "x-decorator": "FormItem",
                "x-component": "Input.TextArea",
                "x-component-props": {
                  maxLength: 200,
                  placeholder: i18n.t("请输入")
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
const handleMultipleSelectStr = (str) => {
  if (str.startsWith('[') && str.endsWith(']')) {
    let valArr = (str.slice(0, str.length - 1)).substr(1).split(',')
    let _valArr = []
    valArr.forEach(e => {
      e = e.replace(/^\s*|\s*$/g, "")
      if (e.includes('_')) {
        _valArr.push(e.split('_')[0])
      }
    })
    return _valArr
  } else {
    if (str.includes('_')) {
      let _val = str.replace(/^\s*|\s*$/g, "").split('_')[0]
      return _val
    }
    return str
  }
}
const handleRadioStr = (str) => {
  const yesStr = `yes,Yes,YES,true,1,是`
  const noStr = `no,No,NO,false,0，否`
  let resultStr = ''
  if (yesStr.includes(str)) {
    resultStr = '1'
  }
  if (noStr.includes(str)) {
    resultStr = '0'
  }
  return resultStr
}
export const initFormData = (data, isEn) => {
  const { sopParentResp, sopStudentResp, studentSubjectResp } = deepClone(data);
  // 学习计划
  const sopLeaningPlanReq = {
    courseEditionId: sopStudentResp.studentLearningPlanResp.courseEditionId,
    courseId: sopStudentResp.studentLearningPlanResp.courseId,
    coursePackageId: sopStudentResp.studentLearningPlanResp.coursePackageId,
    lessonId: sopStudentResp.studentLearningPlanResp.lessonId,
    packageTreeId: sopStudentResp.studentLearningPlanResp.packageTreeId
  };
  // 学生信息
  const sopStudentReq = {
    ...sopStudentResp,
    ...sopStudentResp.handoverStudentExtResp,
  };
  if (sopStudentResp.teachingStyle && sopStudentResp.teachingStyle.length > 0) {
    const teachingStyle = []
    sopStudentResp.teachingStyle.forEach(e => {
      teachingStyle.push(e.id)
    })
    sopStudentReq.teachingStyle = teachingStyle
  }
  sopStudentReq.createTime = DateTimeUtils.dateClockTime(sopStudentReq.createTime)
  sopStudentReq.birthday = DateTimeUtils.dateClockTime(sopStudentReq.birthday)
  if (sopStudentReq?.languageEnvironment !== null) {
    sopStudentReq.languageEnvironment = handleMultipleSelectStr(`${sopStudentReq.languageEnvironment}`);
  }
  delete sopStudentReq.handoverStudentExtResp;
  delete sopStudentReq.studentLearningPlanResp;
  delete sopStudentReq.parentUserId;
  sopStudentReq.age = DateTimeUtils.birthdayMapToAge(sopStudentReq.birthday);
  // 学科信息
  const sopStudentSubjectReq = { ...studentSubjectResp };
  const subjectInfoZh = sopStudentSubjectReq.subjectInfoZh;
  const subjectInfoEn = sopStudentSubjectReq.subjectInfoEn;

  // 处理多选
  if (subjectInfoZh && subjectInfoZh.parentExpect) {
    const parentExpect = handleMultipleSelectStr(subjectInfoZh.parentExpect)
    subjectInfoZh.parentExpect = Array.isArray(parentExpect) ? parentExpect : parentExpect.split(',');
  }
  if (subjectInfoZh && subjectInfoZh.chineseExperience) {
    const chineseExperience = handleMultipleSelectStr(subjectInfoZh.chineseExperience)
    subjectInfoZh.chineseExperience = Array.isArray(chineseExperience) ? chineseExperience : chineseExperience.split(',');
  }
  if (subjectInfoEn && subjectInfoEn.englishExperience) {
    const englishExperience = handleMultipleSelectStr(subjectInfoEn.englishExperience)
    subjectInfoEn.englishExperience = Array.isArray(englishExperience) ? englishExperience : englishExperience.split(',');
  }
  // 处理单选
  if (subjectInfoZh && subjectInfoZh.chineseUse) {
    subjectInfoZh.chineseUse = handleMultipleSelectStr(subjectInfoZh.chineseUse);
  }
  if (subjectInfoZh && subjectInfoZh.chineseUseLanguage) {
    subjectInfoZh.chineseUseLanguage = handleMultipleSelectStr(subjectInfoZh.chineseUseLanguage);
  }
  if (subjectInfoZh && subjectInfoZh.listenSpeakAbility) {
    subjectInfoZh.listenSpeakAbility = handleMultipleSelectStr(subjectInfoZh.listenSpeakAbility);
  }
  if (subjectInfoZh && subjectInfoZh.pinyin) {
    subjectInfoZh.pinyin = handleMultipleSelectStr(subjectInfoZh.pinyin);
    subjectInfoZh.pinyin = handleRadioStr(subjectInfoZh.pinyin)
  }
  if (subjectInfoEn && subjectInfoEn.learnedPhonics) {
    subjectInfoEn.learnedPhonics = handleMultipleSelectStr(subjectInfoEn.learnedPhonics);
    subjectInfoEn.learnedPhonics = handleRadioStr(subjectInfoEn.learnedPhonics)
  }
  if (subjectInfoEn && subjectInfoEn.listenSpeakLevel) {
    subjectInfoEn.listenSpeakLevel = handleMultipleSelectStr(subjectInfoEn.listenSpeakLevel);
  }
  if (subjectInfoEn && subjectInfoEn.readingLevel) {
    subjectInfoEn.readingLevel = handleMultipleSelectStr(subjectInfoEn.readingLevel);
  }
  if (subjectInfoEn && subjectInfoEn.writingLevel) {
    subjectInfoEn.writingLevel = handleMultipleSelectStr(subjectInfoEn.writingLevel);
  }
  sopStudentSubjectReq.classType = sopStudentResp.studentLearningPlanResp.classTypeId
  // 家长信息

  if (sopParentResp?.familyRole !== null) {
    sopParentResp.familyRole = handleMultipleSelectStr(`${sopParentResp.familyRole}`);
  }
  const sopParentReq = {
    ...sopParentResp,
    parentAccount: { name: sopParentResp.username, id: sopParentResp.id },
  };
  const formData = {
    sopLeaningPlanReq,
    sopStudentReq,
    sopStudentSubjectReq,
    sopParentReq,
    doTaskParam: {},
  };
  return formData;
};
export const initHandoverData = (data, isEn) => {
  const {
    handoverUserNameEn,
    handoverUserNameZh,
    handoverUserPhone,
    handoverUserWechat,
    isChangeTutor,
    expectationForTutor,
    classWeek,
    notes,
  } = data;
  return {
    handoverUserName: isEn ? handoverUserNameEn : handoverUserNameZh,
    handoverUserPhone,
    handoverUserWechat,
    isChangeTutor: isChangeTutor == 1 ? i18n.t("是") : i18n.t("否"),
    expectationForTutor,
    classWeek,
    notes,
  };
};


export const constructionParams = (params) => {
  /* 处理学科信息 */
  const subjectInfoZh = params.sopStudentSubjectReq.subjectInfoZh;
  const subjectInfoEn = params.sopStudentSubjectReq.subjectInfoEn;
  if (subjectInfoZh && subjectInfoZh.parentExpect) {
    subjectInfoZh.parentExpect = subjectInfoZh.parentExpect.join(",");
  }
  if (subjectInfoZh && subjectInfoZh.chineseExperience) {
    subjectInfoZh.chineseExperience = subjectInfoZh.chineseExperience.join(",");
  }
  if (subjectInfoEn && subjectInfoEn.englishExperience) {
    subjectInfoEn.englishExperience = subjectInfoEn.englishExperience.join(",");
  }
  /*处理日期 常规=>utc */
  params.sopStudentReq.birthday = moment(
    `${params.sopStudentReq.birthday}`
  ).toISOString();
  params.sopStudentReq.createTime = moment(
    `${params.sopStudentReq.createTime}`
  ).toISOString();
  if (params.submitType === 1) {/* 完成任务参数处理 */
    const courseProgress = params.sopStudentSubjectReq.courseProgress;
    params.sopLeaningPlanReq.packageTreeId = courseProgress[0] + '';
    params.sopLeaningPlanReq.lessonId =
      courseProgress.at(-1);
    delete params.sopParentReq.parentAccount;
    delete params.sopParentReq.username;
    delete params.sopStudentReq.age;
    delete params.sopStudentSubjectReq.courseProgress;
    delete params.sopStudentSubjectReq.classType;
    delete params.notes;
    delete params.classWeek;
    delete params.handoverUserName;
    delete params.initHandoverData;
    delete params.handoverUserPhone;
    delete params.handoverUserWechat;
    delete params.isChangeTutor;
    delete params.sopStudentReq.createTime
  } else {
  }
  params.doTaskParam = JSON.stringify(params.doTaskParam);
  return params
}