import React, { Component } from 'react'
import Select from "react-select"
import {withStyles} from "@material-ui/core"

class EnumSelection extends Component {
    constructor(props){
        super(props)
        this.state = {
            value:null,
            defaultValue:null,
            isLoading:false
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            value:nextProps.value || null,
            defaultValue:nextProps.value || null
        })

    }

    handleChange = ({value}) => {
        if (this.props.onChange && this.props.field) {
            this.props.onChange(this.props.field, value)
        }
        
    }

    render() {
        const {classes, disableLabel, theme} = this.props
        return (
            <div className={classes.container}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <Select
                    value={this.state.value 
                        ? {
                            value:this.state.value,
                            label:this.state.value
                        } 
                        : null
                    }
                    styles={theme === "dark"?{
                        control:(provided)=>({
                            ...provided,
                            backgroundColor:"#222",
                            border:"1px solid #555"
                        }),
                        singleValue:(provided)=>({
                            ...provided,
                            color:"#ccc"
                        })
                    }:undefined}
                    isLoading={this.state.isLoading}
                    onChange={this.handleChange}
                    placeholder={this.state.isLoading?"Loading...":"Search..."}
                    options={this.props.options.map(item => {
                        return {
                            value:item,
                            label:item
                        }
                    })}
                />
            </div>
        )
    }
}

const styles = {
    container:{
        width:'100%',
        marginBottom:'15px',
        marginRight:"10px"
    },
    label:{
        color:"#888",
        fontSize:"0.9em"
    },
}

export default withStyles(styles)(EnumSelection)