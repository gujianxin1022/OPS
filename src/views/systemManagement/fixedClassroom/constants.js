export const STUDENT_OR_CLASS = {
  student: 1,
  class: 2
}

export const ONETOONE_OR_SMALLCLASS = {
  oneToOne: 1,
  smallClass: 2
}

// 新的枚举 - 不需要百家
export const VIRTUAL_CLASS_TYPE = [
  {
    id: 1,
    label: '拓课云'
  },{
    id: 3,
    label: 'LingoAce'
  },
]

// 兼容老数据 - 需要百家
export const OLD_VIRTUAL_CLASS_TYPE = [
  {
    id: 1,
    label: '拓课云'
  },{
    id: 2,
    label: '百家云'
  },{
    id: 3,
    label: 'LingoAce'
  },
]

export function filterVirtualClassType(val) {
  switch (val) {
    case 1: return '拓课云';
    case 2: return '百家云';
    case 3: return 'LingoAce';
    default: return '--'
  }
}