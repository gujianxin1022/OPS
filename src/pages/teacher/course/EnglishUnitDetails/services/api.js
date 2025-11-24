
import Request from '@/utils/axios.js'

const { $post, $get } = new Request();

/** 
 *   保存&更新，删除 单元知识点 
 *   courseUnitKnowledgePointsIds:[]number 删除指定单元知识点 
 * **/
async function saveUnitKnowledge(params) {
  return $post('/opsapi/teachingreport/report/unit/knowledge/points/en', params);
}

/** 
 *  提交&更新，删除 单元知识点 
 *  courseUnitKnowledgePointsIds:[]number 删除指定单元知识点 
 *  
 **/
async function updateUnitKnowledge(params) {
  return $post('/opsapi/teachingreport/report/unit/release/knowledge/points/en', params);
}

/** 
 *  获取单元知识点列表 
 **/
async function getUnitKnowledgeList(params) {
  return $get(`/opsapi/unit/report/select/knowledge/pointsV2/${params.unitId}/${params.status}`);
}



/** 
 *  保存&更新，删除 单元技能
 *  courseUnitSkillsIds:[]number 删除指定单元技能
 *  
 **/
async function saveUnitSkill(params) {
  return $post('/opsapi/teachingreport/report/unit/skill/en', params);
}

/** 
 *  提交&更新，删除 单元技能 
 *  courseUnitSkillsIds:[]number 删除指定单元技能
 *  
 **/
async function updateUnitSkill(params) {
  return $post('/opsapi/teachingreport/report/unit/release/skill/en', params);
}


/** 
 *  获取单元技能列表 
 **/
async function getUnitSkillList(params) {
  return $get(`/opsapi/unit/report/select/skillV2/${params.unitId}/${params.status}`);
}






/** 
 *  保存&更新，删除 课堂参与
 *  courseUnitPerformanceIds:[]number  删除指定课堂参与
 *  status:number  0-保存, 1-更新发布
 *  
 **/
async function saveOrUpdateCommunication(params) {
  return $post('/opsapi/teachingreport/report/unit/saveOrUpdatePerformancesForEN', params);
}

/** 
 *  获取课堂参与列表 
 **/
async function getCommunicationList(params) {
  return $get(`/opsapi/report/getClassroomPerformances/${params.unitId}/${params.status}`);
}


const EnglishUnitDetailServices = {
  saveUnitKnowledge,
  updateUnitKnowledge,
  getUnitKnowledgeList,
  saveUnitSkill,
  updateUnitSkill,
  getUnitSkillList,
  saveOrUpdateCommunication,
  getCommunicationList,
};

const conversionSchema = (config) => {
  const schema = {
    type: 'object',
    properties: {
      switchDisabled: {
        type: 'boolean',
        'x-decorator': 'FormItem',
        'x-component': 'Switch',
        'default': false,
        "x-display": "none"
      },
      array: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 80,
                title: config.title,
                align: 'center',
              },
              properties: {
                index: {
                  type: 'void',
                },
              },
            },
            index: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 50, title: '序号' },
              properties: {
                Index: {
                  type: 'string',
                  'x-component': 'ArrayTable.Index',
                },
              },
            },
            language: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 100, title: '语言' },
              properties: {
                en_US: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  "x-component-props": {
                    "placeholder": "English",
                  },
                  "x-pattern": "disabled"
                },
              },
            },
            knowledgeDimension: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 250, title: config.knowledgeDimension,
              },
              properties: {
                dimensionTitleEnUS: {
                  type: 'string',
                  "x-validator": [
                    {
                      required: true,
                      "whitespace": true
                    }
                  ],
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    maxlength: 100,
                    max: 100,
                    'placeholder': "请输入知识点维度"
                  },
                  'x-reactions': [
                    {
                      dependencies: ['switchDisabled'],
                      when: '{{$deps[0]}}',
                      fulfill: {
                        schema: {
                          "x-pattern": "editable"
                        },
                      },
                      otherwise: {
                        schema: {
                          "x-pattern": "disabled"
                        },
                      },
                    },
                  ],
                },
              },
            },
            knowledgeContent: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': { width: 400, title: config.knowledgeContent },
              properties: {
                knowledgeContentEnUS: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input.TextArea',
                  "x-decorator-props": {
                    "style": {
                      "margin": "20px 0px 0px 0px"
                    }
                  },
                  "x-validator": [
                    {
                      required: true,
                      "whitespace": true
                    }
                  ],
                  'x-component-props': {
                    maxlength: 1000,
                    max: 1000,
                    rows: 3,
                    'placeholder': "请输入知识点内容"
                  },
                  'x-reactions': [
                    {
                      dependencies: ['switchDisabled'],
                      when: '{{$deps[0]}}',
                      fulfill: {
                        schema: {
                          "x-pattern": "editable"
                        },
                      },
                      otherwise: {
                        schema: {
                          "x-pattern": "disabled"
                        },
                      },
                    },
                  ],
                },
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component-props': { title: '删除' },
                      'x-component': 'ArrayTable.Remove',
                      'x-reactions': [
                        {
                          dependencies: ['switchDisabled', 'array'],
                          when: config.when,
                          fulfill: {
                            schema: {
                              'x-visible': true,
                            },
                          },
                          otherwise: {
                            schema: {
                              'x-visible': false,
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        properties: {
          add: {
            type: 'void',
            'x-component': 'ArrayTable.Addition',
            'x-reactions': [
              {
                dependencies: ['switchDisabled', 'array'],
                when: '{{$deps[0] && $deps[1].length<10}}',
                fulfill: {
                  schema: {
                    'x-visible': true,
                  },
                },
                otherwise: {
                  schema: {
                    'x-visible': false,
                  },
                },
              },
            ],
            title: '继续添加',
          },
        },
      },
    },
  }
  return schema;
};


export {
  EnglishUnitDetailServices,
  conversionSchema
}

