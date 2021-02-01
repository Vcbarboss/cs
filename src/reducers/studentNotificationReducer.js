const studentNotificationReducer = (state = 0, action) => {
  switch (action.type) {
    case 'student_init_notifications' :
      return action.data;
    case 'student_new_notification' :
      return state + 1;
    case 'student_delete_notification' :
      return state - 1;
    case 'student_logout_notification' :
      return 0;
    default :
      return state
  }
}

export default studentNotificationReducer;
