import React, { Component } from 'react'
import {withStyles, CircularProgress} from "@material-ui/core"
import Button from "core/components/Button"
import BackIcon from "@material-ui/icons/KeyboardArrowLeft"
import SaveIcon from "@material-ui/icons/SaveOutlined"
import Text from "core/components/inputs/Text"
import Number from "core/components/inputs/Number"
import DateTime from "core/components/inputs/DateTime"
import Reference from "core/components/inputs/Reference"
import Image from "core/components/inputs/Image"
import List from "core/components/inputs/List"
// import DragDrop from "core/components/inputs/DragDrop"
import DataViewer from "core/components/inputs/DataViewer"
import QrScan from "core/components/inputs/qrPlugin"
import EnumSelection from "core/components/inputs/Enum"
import appConfig from "application/appConfig"

 class Form extends Component {
    constructor(props){
        super(props)
        this.state = {
            record:{
                ...(props.record?props.record:{}),
            },
            _isEdited:false
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            record:nextProps.record
        })
    }

    handleInputChange = (field, value) => {
        this.setState({
            record:{
                ...this.state.record,
                [field]: value,
            },
            _isEdited:true
        })
    }

    handleSave = () => {
        if (this.props.onSave) {
            this.props.onSave(this.state.record)
        }
    }

    handleBack = () => {
        if (this.state._isEdited) {
            console.log(prompt("You have an unsaved changes"))
        }
    }

    handleEffect = (effect, data) => {
        let effectResult = effect(data, this.state.record)
        console.log("test", effectResult)
        if (effectResult) {
            setTimeout(()=>{
                this.setState({
                    record:{
                        ...this.state.record,
                        ...effectResult
                    }
                })
            },300)
            
        }
    }

    render() {
        const {classes, route, theme} = this.props
        const renderedModel = route.model.filter(fld=>(fld.field !== "snapshot" && fld.field !== "id") && fld.hideForm !== true)
        return (
            <div className={classes.container}>
                <div className={classes.formMedia}>
                    <div className={classes.toolbar+" "+theme}>
                        <Button onClick={()=>this.props.onBack()} className={classes.transparentButton+" "+theme}><BackIcon/> Back</Button>
                        <div style={{display:'flex'}}>
                            <Button 
                                onClick={()=>this.handleSave()} 
                                disabled={this.props.isSaving}
                                className={classes.transparentButton+" "+theme}
                                style={{
                                    padding:"3px 10px",
                                    ...(this.props.isSaving?{color:"#aaa"}:{})
                                }}
                            >
                                {this.props.isSaving 
                                ? <><CircularProgress size={20} style={{marginRight:"10px"}}/> Saving ... </> 
                                :<><SaveIcon style={{width:"0.9em", marginRight:"10px"}}/> Save</>}
                            </Button>
                        </div>
                    </div>
                    <div className={classes.formContent+" "+theme}>
                        {route.model && renderedModel.map((field, index)=>{
                            if (["text", "string"].includes(field.type)) {
                                return <Text
                                    theme={theme}
                                    key={index}
                                    label={field.label}
                                    value={this.state.record[field.field]}
                                    field={field.field}
                                    onChange={this.handleInputChange}
                                    editable={field.editable === false?false:true}
                                />
                            } else if (field.type === "reference") {
                                return <Reference
                                    theme={theme}
                                    key={index}
                                    label={typeof field.label === "function" ? field.label(this.state.record):field.label}
                                    onChange={this.handleInputChange}
                                    hasEffect={field.hasEffect}
                                    onEffect={(data)=>this.handleEffect(field.hasEffect, data)}
                                    value={this.state.record[field.field]}
                                    model={field.to
                                        ?typeof field.to === "function" 
                                            ? field.to(this.state.record) 
                                            : field.to
                                        :field.field}
                                    field={field.field}
                                    getter={field.getter || "name"}
                                    editable={field.editable === false?false:true}
                                    preload={field.preload || false}
                                />
                            } else if (field.type === "enum") {
                                return <EnumSelection
                                    theme={theme}
                                    key={index}
                                    label={field.label}
                                    onChange={this.handleInputChange}
                                    value={this.state.record[field.field]}
                                    model={field.field}
                                    field={field.field}
                                    options={field.options || []}
                                    editable={field.editable === false?false:true}
                                />
                            } else if (field.type === "number") {
                                return <Number
                                    theme={theme}
                                    key={index}
                                    label={field.label}
                                    value={this.state.record[field.field]}
                                    field={field.field}
                                    hasEffect={field.hasEffect}
                                    onEffect={(data)=>this.handleEffect(field.hasEffect, data)}
                                    onChange={this.handleInputChange}
                                    editable={field.editable === false?false:true}
                                />
                            } 
                            else if (field.type === "image") {
                                return <Image
                                    theme={theme}
                                    key={index}
                                    label={field.label}
                                    value={this.state.record[field.field]}
                                    field={field.field}
                                    onChange={this.handleInputChange}
                                    editable={field.editable === false?false:true}
                                />
                            } else if (field.type === "date") {
                                return <DateTime
                                    key={index}
                                    theme={theme}
                                    label={field.label}
                                    value={this.state.record[field.field]}
                                    hasEffect={field.hasEffect}
                                    onEffect={(data)=>this.handleEffect(field.hasEffect, data)}
                                    field={field.field}
                                    onChange={this.handleInputChange}
                                    editable={field.editable === false?false:true}
                                />
                            } else if (field.type === "list") {
                                return <List
                                    theme={theme}
                                    key={index}
                                    label={field.label}
                                    columns={field.columns || []}
                                    value={this.state.record[field.field]}
                                    hasEffect={field.hasEffect}
                                    onEffect={(data)=>this.handleEffect(field.hasEffect, data)}
                                    field={field.field}
                                    onChange={this.handleInputChange}
                                    editable={field.editable === false?false:true}
                                />
                            } else if (field.type === "viewer") {
                                return <DataViewer
                                    theme={theme}
                                    key={index}
                                    label={field.label}
                                    value={(field.setValue && typeof field.setValue === "function")
                                        ? field.setValue(this.state.record) 
                                        : "-"
                                    }
                                />
                            } else if (field.type === "qr") {
                                return <QrScan
                                    fps={10}
                                    qrbox={250}
                                    disableFlip={false}
                                    qrCodeSuccessCallback={(decodedText, decodedResult)=>console.log(decodedResult)}
                                />
                            } else {
                                return <></>
                            }
                        })}
                        <div className={classes.filler}/>
                    </div>
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
        width:'100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop:"10px",
    },
    formMedia:{
        width:'calc(100% - 40px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius:"10px",
        overflow:'hidden',
        boxShadow:'0px 5px 10px rgba(0,0,0,0.2)'
    },
    toolbar:{
        display:"flex",
        justifyContent: 'space-between',
        padding:"3px 10px",
        backgroundColor:"rgba(255,255,255,0.6)",
        backdropFilter:appConfig.disableBlurEffects?"none":"blur(10px)",
        "&.dark":{
            backgroundColor:"rgba(0,0,0,0.4)",
        }
    },
    formContent:{
        backgroundColor:"#fff",
        height:'calc(100vh - 140px)',
        padding:'10px 15px 0px 15px',
        overflowX:"auto",
        "&::-webkit-scrollbar"  :{
            width:"10px",
            transition:"width 0.3s ease-out",
        },
        "&::-webkit-scrollbar-thumb":{
            background:"rgba(0,0,0,0.3)",
            width:"8px",
            borderRadius:"3px",
        },
        "&.dark":{
            backgroundColor:"#333",
            "&::-webkit-scrollbar-thumb":{
                background:"rgba(255,255,255,0.5)",
            }
        }, 
    },
    transparentButton:{
        backgroundColor:"transparent", 
        paddingLeft:"0px", 
        paddingRight:'0px',
        "& .icon":{
            width:'0.9em !important',
            height:"auto",
            marginRight:'10px'
        },
        "&.dark":{
            color:"#ccc",
            "& .icon":{
                color:"#ccc"
            }
        }
    },
    filler:{
        width:"100%",
        height:'100px'
    }
}

export default withStyles(styles)(Form)