import React, { Component } from 'react'
import {withStyles} from "@material-ui/core"
import TestBg from "assets/test_bg_1.jpg"
import {connect} from "react-redux"
import {mapStateToProps, mapDispatchToProps} from "../redux/redux"

class ThemeEngine extends Component {
    render() {
        const {classes, core, children} = this.props
        let theme = core.userConfig.darkMode?" dark":""
        return (
            <div className={classes.container+theme}>
                {children}
            </div>
        )
    }
}
const styles = {
    container:{
        backgroundImage:"url('"+TestBg+"')",
        backgroundSize:"cover",
        height:'100vh',
        "&.dark":{
            backgroundImage:"linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('"+TestBg+"')"
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ThemeEngine))