const sectorReducer = (state = 0, action) => {
    console.log(action)
    switch (action.type) {
        case 'init_sector' :
            return action.data;
        case 'rebase_sector' :
            return action.data;
        default :
            return state
    }
}

export default sectorReducer;
