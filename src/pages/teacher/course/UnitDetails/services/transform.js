const requestKnowledgeTransform = (param,_unitId) => {
    let newParam = param.map(item =>{
      let {
       dimensionTitleZhCN,
       dimensionTitleEnUS,
       knowledgeContentZhCN,
       knowledgeContentEnUS,
       id,
       unitId
     } = item;
     return {
         ...item,
         knowledgeContent:knowledgeContentZhCN.split('\n'),
         knowledgeContentEn:knowledgeContentEnUS.split('\n'),
         knowledgeTitle:dimensionTitleZhCN,
         knowledgeTitleEn:dimensionTitleEnUS,
         id: id || null,
         sortNo: 0,
         unitId: unitId || _unitId,
         status: 0,
     }
    })
    return newParam;
  };
  const requestSkillTransform = (param,_unitId) => {
    let newParam = param.map(item =>{
      let {
       dimensionTitleZhCN,
       dimensionTitleEnUS,
       knowledgeContentZhCN,
       knowledgeContentEnUS,
       id,
       unitId
     } = item;
     return {
         ...item,
         skillContent:knowledgeContentZhCN.split('\n'),
         skillContentEn:knowledgeContentEnUS.split('\n'),
         skillsTitle:dimensionTitleZhCN,
         skillsTitleEn:dimensionTitleEnUS,
         id: id || null,
         sortNo: 0,
         unitId: unitId || _unitId,
         status: 0,
     }
    })
    return newParam;
  };
  const requestCommunicationTransform = (param,_unitId)=>{
    let newParam = param.map(item =>{
      let {
       dimensionTitleZhCN,
       dimensionTitleEnUS,
       knowledgeContentZhCN,
       knowledgeContentEnUS,
       id,
       unitId
     } = item;
     return {
         ...item,
         performanceContentZh:JSON.stringify(knowledgeContentZhCN.split('\n')),
         performanceContentEn:JSON.stringify(knowledgeContentEnUS.split('\n')),
         performanceTitleZh:dimensionTitleZhCN,
         performanceTitleEn:dimensionTitleEnUS,
         id: id || null,
         unitId: unitId || _unitId,
         sortNo: 0,
         status: 0,
     }
    })
    return newParam;
  };
const responseKnowledgeTransform = (param) =>{
    let response = param.map(item =>{
        let {
            knowledgeContent,
            knowledgeContentEn,
            knowledgeTitle,
            knowledgeTitleEn
       } = item;
       return {
           ...item,
           knowledgeContentZhCN:knowledgeContent.join('\n'),
           knowledgeContentEnUS:knowledgeContentEn.join('\n'),
           dimensionTitleZhCN:knowledgeTitle,
           dimensionTitleEnUS:knowledgeTitleEn,
       }
      })
      return response;
};
const responseSkillTransform = (param) =>{
    let newParam = param.map(item =>{
        let {
            skillContent,
            skillContentEn,
            skillsTitle,
            skillsTitleEn
       } = item;
       return {
           ...item,
           knowledgeContentZhCN:skillContent.join('\n'),
           knowledgeContentEnUS:skillContentEn.join('\n'),
           dimensionTitleZhCN:skillsTitle,
           dimensionTitleEnUS:skillsTitleEn
        }
      })
      return newParam;
      
};
const responseCommunicationTransform = (param) =>{
    let newParam = param.map(item =>{
        let {
            performanceContentZh,
            performanceContentEn,
            performanceTitleZh,
            performanceTitleEn
       } = item;
       delete item.id;
       return {
           ...item,
           knowledgeContentZhCN:JSON.parse(performanceContentZh).join('\n'),
           knowledgeContentEnUS:JSON.parse(performanceContentEn).join('\n'),
           dimensionTitleZhCN:performanceTitleZh,
           dimensionTitleEnUS:performanceTitleEn,
       }
      })
      return newParam;
};


export default {
    requestKnowledgeTransform,
    requestSkillTransform,
    requestCommunicationTransform,
    responseKnowledgeTransform,
    responseSkillTransform,
    responseCommunicationTransform
}