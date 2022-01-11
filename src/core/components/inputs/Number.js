import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'

class NumberInput extends Component {
    constructor(props){
        super(props)
        this.state = {
            value : this.props.value || ""
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            value:nextProps.value
        })
    }

    handleChange = (event) => {
        if (this.props.onChange && this.props.field) {
            this.props.onChange(this.props.field, parseFloat(event.target.value))
            if (this.props.hasEffect) {
                this.props.onEffect(event.target.value)
            }
        }
    }

    render() {
        const {classes, disableLabel, gridView, theme, editable} = this.props
        return (
            <div className={classes.outer+` ${gridView?"gridView":""}`}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <div className={classes.container+" "+theme}>
                    <input
                        disabled={editable === false}
                        className={classes.innerInput+" "+theme}
                        type="number"
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
        padding:'4px 5px',
        "&.dark":{
            backgroundColor:"#222",
            border:"1px solid #555"
        }
    },
    innerInput:{
        outline:"none",
        border:"none",
        padding:"2px 5px",
        backgroundColor:"transparent",
        width:"100%",   
        "&:focus":{
            outline:"none",
        },
        "&:active":{
            outline:"none",
        },
        "&::-webkit-inner-spin-button":{
            "-webkit-appearance": "none",
            margin:"0"
        },
        "&.dark":{
            color:"#ccc"
        }
    }
}

export default withStyles(styles)(NumberInput)
