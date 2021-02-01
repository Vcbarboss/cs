const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'init_login' :
      return action.data;
    case 'rebase_user' :
      return action.data;
    case 'logout' :
      return null;
    default :
      return state
  }
}

export default userReducer;
