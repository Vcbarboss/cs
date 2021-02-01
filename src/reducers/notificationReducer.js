const notificationReducer = (state = 0, action) => {
  switch (action.type) {
    case 'init_notifications' :
      return action.data;
    case 'new_notification' :
      return state + 1;
    case 'delete_notification' :
      return state - 1;
    case 'logout_notification' :
      return 0;
    default :
      return state
  }
}

export default notificationReducer;
