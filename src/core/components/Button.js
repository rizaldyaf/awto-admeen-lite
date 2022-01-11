import React, { Component } from 'react'
import {ButtonBase, withStyles} from "@material-ui/core"
import Config from "application/appConfig"
import {connect} from "react-redux"
import {mapStateToProps, mapDispatchToProps} from "core/redux/redux"

class Button extends Component {
    render() {
        const {classes, color, core} = this.props
        let selectedColor = ""
        if (color && color === "primary") {
            selectedColor = color
            if (core.userConfig.darkMode) {
                selectedColor = color+"-dark"
            }
        }
        return (
            <>
                <ButtonBase
                    className={classes.button+" "+(this.props.className?this.props.className:"")+" "+selectedColor}
                    style={this.props.customStyle || null}
                    disabled={this.props.disabled}
                    onClick={(event)=>{
                        if (this.props.onClick) {
                            this.props.onClick(event)
                        }
                    }}
                >
                    {this.props.children}
                </ButtonBase>
            </>
        )
    }
}

const styles = {
    button:{
        borderRadius:'5px',
        padding:'7px 20px',
        fontSize:'1rem',
        backgroundColor:"#ddd",
        color:"#333",
        "&.primary":{
            backgroundColor:Config.accentColor,
            color:"#fff"
        },
        "&.primary-dark":{
            backgroundColor:Config.accentColorDark,
            color:"#fff"
        }
    },
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Button))