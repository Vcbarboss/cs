const chatReducer = (state = 0, action) => {
    switch (action.type) {
        case 'init_chat' :
            return action.data;
        case 'new_chat' :
            return state + 1;
        default :
            return state
    }
}

export default chatReducer;
