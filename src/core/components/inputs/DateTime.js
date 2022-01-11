import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
// import moment from "moment-timezone"

class DateTime extends Component {
    constructor(props){
        super(props)
        this.state = {
            value : props.value || ""
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.value !== this.state.value) {
            this.setState({
                value : nextProps.value || ""
            })
        }
    }

    handleChange = (event) => {
        if (this.props.onChange && this.props.field) {
            this.props.onChange(this.props.field, event.target.value)
        }
    }

    render() {
        const {classes, disableLabel, gridView, theme} = this.props
        return (
            <div className={classes.outer+` ${gridView?"gridView":""}`}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <div className={classes.container+" "+theme}>
                    <input
                        className={classes.innerInput+" "+theme}
                        type="datetime-local"
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
}

const styles = {
    outer:{
        width:"100%",
        marginBottom:"15px",
        marginRight:"0px",
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
        height:"35px",
        border:"1px solid #ccc",
        backgroundColor:'#f8f8f8',
        borderRadius:"5px",
        overflow:"hidden",
        padding:"4px 5px",
        boxSizing:"border-box",
        "&.dark":{
            border:"1px solid #555",
            backgroundColor:"#222"
        }
    },
    innerInput:{
        outline:"none",
        border:"none",
        boxSizing:"border-box",
        backgroundColor:"transparent",
        padding:"2px 5px",
        width:"100%",   
        "&:focus":{
            outline:"none",
        },
        "&:active":{
            outline:"none",
        },
        "&.dark":{
            color:"#ccc",
            "&::-webkit-calendar-picker-indicator":{
                filter:"invert(0.8)"
            }
        }
    }
}

export default withStyles(styles)(DateTime)
