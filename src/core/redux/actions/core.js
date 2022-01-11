export const toggleSidebar = () => ({
    type     : "TOGGLE_SIDEBAR",
    payload  : null
})

export const setActiveRecord = (payload) => ({
    type     : "SET_ACTIVE_RECORD",
    payload
})

export const toggleDarkMode = () =>({
    type : "TOGGLE_DARKMODE"
})

export const setUserConfig = (username) =>({
    type : "SET_USER_CONFIG",
    payload:username
})
