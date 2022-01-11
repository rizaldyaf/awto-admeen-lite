import React, { Component } from 'react'
import { withStyles, ButtonBase } from '@material-ui/core'
import ViewIcon from "@material-ui/icons/RemoveRedEyeOutlined"
import _ from "lodash"

class TextInput extends Component {
    constructor(props){
        super(props)
        this.state = {
            value : props.value || "",
            showText:false
        }

        this.delayedChange = _.debounce(this.applyChange, 300)
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            value:nextProps.value
        })
    }

    handleChange = (event) => {
        this.setState({
            value:event.target.value
        })
        event.persist()
        this.delayedChange()
    }

    applyChange = () => {
        if (this.props.onChange && this.props.field) {
            this.props.onChange(this.props.field, this.state.value)
            if (this.props.hasEffect) {
                this.props.onEffect(this.state.value)
            }
        }
    }

    toggleShowText = () => {
        this.setState({
            showText:!this.state.showText
        })
    }

    render() {
        const {classes, disableLabel, gridView, theme} = this.props
        return (
            <div className={classes.outer+` ${gridView?"gridView":""}`}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <div className={classes.container+" "+theme}>
                    <input
                        className={classes.innerInput+" "+theme}
                        type={this.props.obscureText 
                            ? this.state.showText ? "text" :"password"
                            : "text"
                        }
                        defaultValue={this.state.value || ""}
                        onChange={this.handleChange}
                    />
                    {this.props.obscureText && <ButtonBase style={{padding:"0px 3px", borderRadius:"2px"}}
                        onClick={()=>this.toggleShowText()}
                    >
                        <ViewIcon style={{color:this.state.showText?"#333":"#888"}}/>
                    </ButtonBase>}
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
        display: 'flex',
        alignItems: 'center',
        "&.dark":{
            backgroundColor:"#222",
            border:"1px solid #555"
        }
    },
    innerInput:{
        flexGrow:"1",
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
        "&.dark":{
            color:"#ccc"
        }
    }
}

export default withStyles(styles)(TextInput)
