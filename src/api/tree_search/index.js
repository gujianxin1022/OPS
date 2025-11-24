import GetData from '@/utils/axios.js'
const { $get} = new GetData()

export const getGropData= (userId)=>{
  return $get(`/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/list/tree/${userId}`)
  
}

export const getStudentSData = (userId)=>{
  return $get(`/opsapi/usercenter-service/api/v1/pub/usercenter/manage/post/my/user/list`,{userId:userId})
}

export const getTeachingUsersData = (params)=>{
  return $get(`/opsapi/manage/post/my/user/list`,params)
}

export const getTeachingTmData = ()=>{
  return $get(`/opsapi/manage/post/tm/my/user/list`)
}