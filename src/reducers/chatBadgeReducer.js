const chatBadgeReducer = (state = 0, action) => {
    switch (action.type) {
        case 'init_badgeChat' :
            return action.data;
        case 'new_badgeChat' :
            return action.data;
        default :
            return state
    }
}

export default chatBadgeReducer;
