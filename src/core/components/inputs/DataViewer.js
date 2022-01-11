import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'

class DataViewer extends Component {

    render() {
        const {classes, disableLabel, gridView, theme} = this.props
        return (
            <div className={classes.outer+` ${gridView?"gridView":""}`}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <div className={classes.container+" "+theme}>
                    {this.props.value}
                </div>
            </div>
        )
    }
}

const styles = {
    outer:{
        width:"calc(100% - 10px)",
        marginBottom:"15px",
        "&.gridView":{
            marginRight:"20px"
        }
    },
    label:{
        color:"#888",
        fontSize:"0.9em"
    },
    container:{
        width:"100%",
        height:"25px",
        border:"1px solid #ccc",
        backgroundColor:"#f8f8f8",
        borderRadius:"5px",
        overflow:"hidden",
        padding:"4px 5px",
        "&.dark":{
            backgroundColor:"#222",
            border:"1px solid #555",
            color:"#ccc"
        }
    },
    innerInput:{
        outline:"none",
        border:"none",
        padding:"2px 5px",
        width:"100%",
        backgroundColor:"transparent",
        "&:focus":{
            outline:"none",
        },
        "&:active":{
            outline:"none",
        },
    }
}

export default withStyles(styles)(DataViewer)
