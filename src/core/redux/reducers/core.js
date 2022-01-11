import Cookies from "js-cookie"

const core = (state = {
    isSidebarOpen : true,
    activeRecord:{},
    userConfig:{
        darkMode:Cookies.get("darkMode") === "true"?true:false,
        username:""
    }
}, action) => {
    switch (action.type) {
        case "TOGGLE_SIDEBAR" : 
            state = {
                ...state,
                isSidebarOpen : !state.isSidebarOpen
            }
            break
        case "SET_ACTIVE_RECORD":
            state = {
                ...state,
                activeRecord:action.payload
            }
            break
        case "SET_USER_CONFIG":
            state = {
                ...state,
                userConfig:{
                    ...state.userConfig,
                    username:action.payload
                }
            }
            break
        case "TOGGLE_DARKMODE":
            state = {
                ...state,
                userConfig:{
                    ...state.userConfig,
                    darkMode: !state.userConfig.darkMode
                }
            }
            break
        default:break
    }
    return state;
} 

export default core