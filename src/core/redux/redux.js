import {toggleSidebar, setActiveRecord, toggleDarkMode, setUserConfig} from "./actions/core"

export const mapStateToProps = (state) => {
    return {
        core : state.core
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        setUserConfig : (username) => {dispatch(setUserConfig(username))},
        toggleSidebar : () => {dispatch(toggleSidebar())},
        setActiveRecord : (payload) => {dispatch(setActiveRecord(payload))},
        toggleDarkMode : () => {dispatch(toggleDarkMode())}
    }
}