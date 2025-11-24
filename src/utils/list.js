// 对list列表及后代每一项的子列表进行递归排序
export function sortList (list, sortPropName, childrenPropName) {
  list.sort((a, b) => {
    return a[sortPropName] - b[sortPropName];
  });
  list.forEach((item) => {
    const children = item[childrenPropName];
    if (children && children.length > 0) {
      sortList(children, sortPropName, childrenPropName);
    }
  });
  return list;
}
