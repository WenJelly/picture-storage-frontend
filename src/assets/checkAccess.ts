import ACCESS_ENUM from '@/assets/accessEnum.ts'

/**
 * 检查权限
 *
 * @param loginUser 当前登陆用户
 * @param needAccess 所需的权限
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 获取当前登陆用户具有的权限，没有 loginUser 则表示未登陆
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN

  // 需要登陆后才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    // 用户没登陆，则无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false
    }
  }

  // 需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 用户不是管理员，则无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false
    }
  }

  return true
}

export default checkAccess
