import React, { Component } from 'react'
import {withStyles, ButtonBase} from "@material-ui/core"
import Text from "core/components/inputs/Text"
import Number from "core/components/inputs/Number"
import DateTime from "core/components/inputs/DateTime"
import Reference from "core/components/inputs/Reference"
import Image from "core/components/inputs/Image"
import DataViewer from "core/components/inputs/DataViewer"
import Enum from "core/components/inputs/Enum"
import DeleteIcon from "@material-ui/icons/Close"

class List extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: props.value || []
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.value) {
            this.setState({
                value: nextProps.value || []
            })
        }
    }

    addNewLine = () => {
        this.setState({
            value:[
                ...this.state.value,
                {}
            ]
        })
    }

    handleInputChange = (field, value, row) => {
        this.setState({
            value:this.state.value.map((valObj, idx)=>{
                if (idx === row) {
                    return valObj = {
                        ...valObj,
                        [field]:value
                    }
                } else {
                    return valObj
                }
            })
        },()=>{
            if (this.props.onChange) {
                this.props.onChange(this.props.field, this.state.value)
                if (this.props.hasEffect) {
                    this.props.onEffect(this.state.value)
                }
            }
        })
    }

    deleteRow = (index) => {
        this.setState({
            value:this.state.value.filter((val, idx)=>idx !== index)
        }, ()=>{
            if (this.props.onChange) {
                this.props.onChange(this.props.field, this.state.value)
            }
        })
    }

    render() {
        const {classes, disableLabel, theme} = this.props
        return (
            <div className={classes.outer}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <div className={classes.container+" "+theme}>
                    <div className={classes.heading+" "+theme}>
                        {this.props.columns.map((column)=><div className={classes.list}>{column.label}</div>)}
                    </div>
                    {this.state.value && this.state.value.map((row, rowIndex)=>{
                        return <div className={classes.list} key={rowIndex}>
                            {this.props.columns.map((column, index)=>{
                                if (column.type === "text") {
                                    return <Text
                                        disableLabel
                                        gridView
                                        key={index}
                                        label={column.label}
                                        value={row[column.field]}
                                        field={column.field}
                                        theme={theme}
                                        onChange={(field, value)=>this.handleInputChange(field, value, rowIndex)}
                                    />
                                } else if (column.type === "reference") {
                                    return <Reference
                                        disableLabel
                                        gridView
                                        key={index}
                                        label={column.label}
                                        onChange={(field, value)=>this.handleInputChange(field, value, rowIndex)}
                                        value={row[column.field]}
                                        model={column.to || column.field}
                                        field={column.field}
                                        getter={column.getter || "name"}
                                        theme={theme}
                                        preload={column.preload || false}
                                    />
                                } else if (column.type === "number") {
                                    return <Number
                                        disableLabel
                                        gridView
                                        key={index}
                                        label={column.label}
                                        value={row[column.field]}
                                        field={column.field}
                                        theme={theme}
                                        onChange={(field, value)=>this.handleInputChange(field, value, rowIndex)}
                                    />
                                } 
                                else if (column.type === "image") {
                                    return <Image
                                        disableLabel
                                        gridView
                                        key={index}
                                        label={column.label}
                                        value={row[column.field]}
                                        field={column.field}
                                        theme={theme}
                                        onChange={(field, value)=>this.handleInputChange(field, value, rowIndex)}
                                    />
                                }
                                else if (column.type === "date") {
                                    return <DateTime
                                        disableLabel
                                        gridView
                                        key={index}
                                        label={column.label}
                                        value={row[column.field]}
                                        field={column.field}
                                        theme={theme}
                                        onChange={(field, value)=>this.handleInputChange(field, value, rowIndex)}
                                    />
                                } else if (column.type === "viewer") {
                                    return <DataViewer
                                        gridView
                                        key={index}
                                        theme={theme}
                                        value={(column.setValue && typeof column.setValue === "function")
                                            ? column.setValue(row) 
                                            : "-"
                                        }
                                    />
                                } else if (column.type === "enum") {
                                    return <Enum
                                        disableLabel
                                        gridView
                                        key={index}
                                        label={column.label}
                                        value={row[column.field]}
                                        field={column.field}
                                        theme={theme}
                                        options={column.options}
                                        onChange={(field, value)=>this.handleInputChange(field, value, rowIndex)}
                                    />
                                } else {
                                    return <></>
                                }
                            })}
                            <ButtonBase className={classes.deleteIcon+" "+theme} onClick={()=>this.deleteRow(rowIndex)}>
                                <DeleteIcon className="icon"/>
                            </ButtonBase>
                        </div>
                    })}
                    <div className={classes.buttonContainer+" "+theme}>
                        <ButtonBase className="button" onClick={()=>this.addNewLine()}>
                            Add new line 
                        </ButtonBase>
                    </div>
                </div>
            </div>
        )
    }
}

const styles = {
    outer:{
        width:'100%',
        marginBottom:"15px",
    },
    label:{
        color:"#888",
        fontSize:"0.9em",
        marginBottom:"5px",
    },
    container:{
        border:"1px solid #ddd",
        borderRadius:'5px',
        padding:"10px",
        "&.dark":{
            border:"1px solid #555"
        }
    },
    heading:{
        display:'flex',
        width:"calc(100% - 50px)",
        color:"#333",
        "&.dark":{
            color:"#aaa"
        }
    },
    list:{
        display:"flex",
        width:'100%',
        alignItems: 'center',
    },
    deleteIcon:{
        padding:'5px',
        marginLeft:"20px",
        marginBottom:"15px",
        borderRadius:'5px',
        "&:hover":{
            backgroundColor:"rgba(0,0,0,0.2)"
        },
        "&>.icon":{
            fontSize:"1em"
        },
        "&.dark":{
            "&:hover":{
                backgroundColor:"rgba(255,255,255,0.3)"
            },
            "&>.icon":{
                color:"#ccc"
            }
        }
    },
    buttonContainer:{
        width:'100%',
        marginTop:"20px",
        "&>.button":{
            width:'100%',
            padding:'5px 0px',
            borderRadius:'3px',
            fontSize:'1rem',
            color:"#333",
            "&:hover":{
                backgroundColor:"rgba(0,0,0,0.2)"
            }
        },
        "&.dark":{
            "&>.button":{
                color:"#ccc",
                "&:hover":{
                    backgroundColor:"rgba(255,255,255,0.3)"
                },
            }
        }
    }
}

export default withStyles(styles)(List)