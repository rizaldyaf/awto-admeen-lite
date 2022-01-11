import React, { Component } from 'react'
import {ButtonBase, withStyles, Tooltip} from "@material-ui/core"
import Button from "core/components/Button"
import RefreshIcon from "@material-ui/icons/RefreshOutlined"
import CheckIcon from "@material-ui/icons/CheckBoxOutlined"
import FilterIcon from "@material-ui/icons/Tune"
import DeleteIcon from "@material-ui/icons/DeleteOutlined"
import ListIcon from "@material-ui/icons/ViewListOutlined"
import SettingsIcon from "@material-ui/icons/SettingsOutlined"
import CaretIcon from "@material-ui/icons/KeyboardArrowDown"
import PrevIcon from "@material-ui/icons/KeyboardArrowLeft"
import NextIcon from "@material-ui/icons/KeyboardArrowRight"
import CheckboxOffIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import ImageIcon from "@material-ui/icons/Image"
import ReferenceViewer from "./ReferenceViewer"
import Skeleton from 'react-loading-skeleton'
import moment from "moment-timezone"
import appConfig from 'application/appConfig'

class Browser extends Component {
    constructor(props){
        super(props)
        this.state = {
            checkbox:false,
            checkedRecords:[],
        }
    }

    toggleCheckbox = () => {
        this.setState({
            checkbox:!this.state.checkbox
        })
    }

    handleCheckData = (id) => {
        if (this.state.checkedRecords.includes(id)) {
            this.setState({
                checkedRecords:this.state.checkedRecords.filter((rec)=>rec !== id)
            })
        } else {
            this.setState({
                checkedRecords:[
                    ...this.state.checkedRecords,
                    id
                ]
            })
        }
    }

    resetChecked = () => {
        this.setState({
            checkedRecords:[]
        })
    }

    handleRefresh = () => {
        if (this.props.onRefresh) {
            this.props.onRefresh()
        }
    }

    handleClickNew = () => {
        if (this.props.onCreate) {
            this.props.onCreate()
        }
    }

    handleClickDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.state.checkedRecords)
        }
    }

    handleNext = () => {
        if (this.props.onNext) {
            this.props.onNext()
        }
    }

    handlePrev = () => {
        if (this.props.onPrev) {
            this.props.onPrev()
        }
    }

    render() {
        const {classes, data, route, isLoading, disablePrev, disableNext, theme} = this.props
        const renderedModel = route.model.filter(fld=>fld.field !== "snapshot" && fld.field !== "id" && !fld.hideBrowser)

        let createButtonStyle = {
            color:"#fff",
            background:theme === "dark" ? appConfig.accentColorDark : appConfig.accentColor
        }

        return (
            <div className={classes.Container}>
                <div className={classes.toolbar}>
                    <div className={classes.toolbarInner}>
                        <div className="mainControls">
                            <Button customStyle={createButtonStyle} onClick={()=>this.handleClickNew()}>
                                Create New
                            </Button>
                            <div className={"dataTools "+theme}>
                                <Tooltip title="Refresh">
                                    <ButtonBase className="button" onClick={()=>this.handleRefresh()}>
                                        <RefreshIcon className="icon"/>
                                    </ButtonBase>
                                </Tooltip>
                                <Tooltip title="Select Items">
                                    <ButtonBase className="button" onClick={()=>this.toggleCheckbox()}>
                                        <CheckIcon className={`icon ${this.state.checkbox && data.length > 0 ?"active":""}`}/>
                                    </ButtonBase>
                                </Tooltip>
                                <Tooltip title="Filter data">
                                    <ButtonBase className="button">
                                        <FilterIcon className="icon"/>
                                    </ButtonBase>
                                </Tooltip>
                                <Tooltip title="Delete Selected">
                                    <ButtonBase className="button" onClick={()=>this.handleClickDelete()}>
                                        <DeleteIcon className="icon"/>
                                    </ButtonBase>
                                </Tooltip>
                                <Tooltip title="Change View">
                                    <ButtonBase className="button withCaret">
                                        <ListIcon className="icon"/> <CaretIcon className="caretIcon" style={{fontSize:"0.9em"}}/>
                                    </ButtonBase>
                                </Tooltip>
                                <Tooltip title="Table Settings">
                                    <ButtonBase className="button">
                                        <SettingsIcon className="icon"/>
                                    </ButtonBase>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={"pagination "+theme}>
                                <ButtonBase className={"button"+(disablePrev?" disabled":"")} onClick={()=>this.handlePrev()}>
                                    <PrevIcon className="icon"/>
                                </ButtonBase>
                                <div className="button">
                                    Page {this.props.page}
                                </div>
                                <ButtonBase className={"button"+(disableNext?" disabled":"")} onClick={()=>this.handleNext()}>
                                    <NextIcon className="icon"/>
                                </ButtonBase>
                            </div>
                    </div>
                    
                </div>
                <div className={classes.tableContainer}>
                    <table className={classes.table+" "+theme}>
                        <thead>
                            <tr>
                                {this.state.checkbox && <th className={classes.checkboxContainer}></th>}
                                {renderedModel.map((field, index)=>{
                                    return <th 
                                        key={index} 
                                        {...(renderedModel.length === 1 ? {style:{borderRadius:'10px 10px 0px 0px'}}:{}) }
                                    >
                                        {field.label}
                                    </th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading 
                            ? [...Array(10)].map((item,index)=>{
                                return <tr key={index}>
                                    {renderedModel.map((field, key)=>{
                                        return <td 
                                            key={index+","+key}
                                        >
                                            <Skeleton style={{opacity:theme ==="dark"?"0.5":"1"}}/>
                                        </td>
                                    })}
                                </tr>
                            })
                            : data.length > 0
                                ? data.map((record, index)=>{
                                    return <tr key={index} onClick={()=>this.props.onDataSelected(record)}>
                                            {this.state.checkbox && <td onClick={(e)=>{
                                                this.handleCheckData(record.id)
                                                e.stopPropagation()
                                            }}>
                                                {this.state.checkedRecords.includes(record.id)?<CheckIcon/>:<CheckboxOffIcon/>}
                                            </td>}

                                            {renderedModel.map((field, fieldIdx)=>{
                                                let content = null
                                                if (["text", "string"].includes(field.type)) {
                                                    content = record[field.field]
                                                } else if (field.type === "number") {
                                                    content = record[field.field] ? record[field.field].toLocaleString("en-US") : 0
                                                } else if (field.type === "date") {
                                                    content = moment(record[field.field]).format("DD-MMM-YYYY HH:mm")
                                                } else if (field.type === "reference") {
                                                    content = <ReferenceViewer 
                                                                getter={field.getter || "name"}
                                                                value={record[field.field]}
                                                            />
                                                } else if (field.type === "enum") {
                                                    content = record[field.field]
                                                } else if (field.type === "image"){
                                                    content = record[field.field] 
                                                            ? <img src={record[field.field].url} className={classes.image} alt="preview"/>
                                                            : <div className={classes.imgPlaceholder}><ImageIcon/></div>
                                                } else if (field.type === "viewer") {
                                                    content = (field.setValue && typeof field.setValue === "function")
                                                            ? field.setValue(record)
                                                            : "-"
                                                } else {
                                                    content = <span style={{color:'red'}}>Unknown Data Type</span>
                                                }
                                                return <td 
                                                    key={fieldIdx} 
                                                    {...(renderedModel.length === 1 
                                                        ? {style:{borderRadius:(index === data.length - 1) ? "0px 0px 10px 10px":"0px"}}
                                                        :{}
                                                    )}
                                                >{content}</td>
                                            })}
                                    </tr>
                                })
                                : <tr>
                                    <td colspan={renderedModel.length+(this.state.checkbox?1:0)} style={{textAlign:"center", color:"#888", borderRadius:"0px 0px 10px 10px"}}>
                                        No Data Found
                                    </td>
                                    </tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
        border:'1px solid #fff',
    },
    toolbar:{
        width:'100%',
        display: 'flex',
        justifyContent: 'center',
        margin:'10px 0px',
    },
    toolbarInner:{
        width:"calc(100% - 40px)",
        display: 'flex',
        justifyContent: 'space-between',
        "&>.mainControls":{
            display: 'flex',
            "&>.dataTools":{
                borderRadius:"5px",
                padding:'3px 0px',
                marginLeft:'10px',
                backgroundColor:'rgba(255,255,255,0.5)',
                boxShadow:"0px 3px 5px rgba(0,0,0,0.2)",
                backdropFilter:appConfig.disableBlurEffects?"none":"blur(10px)",
                display: 'flex',
                "&>.button":{
                    padding:"0px 5px",
                    minWidth:'30px',
                    borderRight:"1px solid #333",
                    "&.withCaret":{
                        minWidth:"38px"
                    },
                    "&>.icon":{
                        width:"17px",
                        height:"auto",
                        "&.active":{
                            color:"#fff"
                        }
                    },
                    "&:last-child":{
                        borderRight:"transparent"
                    }
                },
                "&.dark":{
                    backgroundColor:'rgba(0,0,0,0.6)',
                    "&>.button":{
                        borderRight:"1px solid #888",
                        "&>.icon":{
                            color:"#ccc",
                            "&.active":{
                                color:"#fff"
                            }
                        },
                        "&>.caretIcon":{
                            color:"#ccc"
                        }
                    }
                    
                }
            }
        },
        "&>.pagination":{
            borderRadius:"5px",
            padding:'3px 0px',
            backgroundColor:'rgba(255,255,255,0.5)',
            boxShadow:"0px 3px 5px rgba(0,0,0,0.2)",
            backdropFilter:appConfig.disableBlurEffects?"none":"blur(10px)",
            display: 'flex',
            "&>.button":{
                padding:"0px 5px",
                borderRight:"1px solid #333",
                "&.disabled":{
                    color:"#aaa"
                },
                "&:last-child":{
                    borderRight:"transparent"
                }
            },
            "&.dark":{
                backgroundColor:'rgba(0,0,0,0.6)',
                "&>.button":{
                    borderRight:"1px solid #aaa",
                    color:"#ccc",
                    "&.disabled":{
                        color:"#888"
                    }
                }
            }
        }
    },
    tableContainer:{
        width:'100%',
        display: 'flex',
        justifyContent: 'center',
    },
    table:{
        width:"calc(100% - 40px)",
        borderCollapse: "collapse",
        borderRadius:"10px",
        marginTop:"5px",
        boxShadow:"0px 5px 10px rgba(0,0,0,0.2)",
        "& thead":{
            backgroundColor:"rgba(255,255,255,0.5)",
            "&>tr":{
                padding:"15px",
                textAlign:'left !important',
                borderBottom:"1px solid #ddd"
            },
            "& tr, & th":{
                padding:"3px 15px"
            },
            "& tr":{
                "& th":{
                    backdropFilter:appConfig.disableBlurEffects?"none":"blur(10px)",
                    cursor:"pointer",
                    "&:hover":{
                        backgroundColor:"rgba(255,255,255,0.3)"
                    }
                },
                "&:last-child":{
                    "& th":{
                        "&:first-child":{
                            borderRadius:"10px 0px 0px 0px"
                        },
                        "&:last-child":{
                            borderRadius:"0px 10px 0px 0px"
                        },
                    }
                    
                }
            }
        },
        "& tbody":{
            backgroundColor:"#fff",
            padding:"0px 10px",
            "& tr, & td":{
                padding:'10px 15px'
            },
            "& tr":{
                cursor:"pointer",
                "&:hover":{
                    backgroundColor:"#eee"
                },
                "&:last-child":{
                    "& td":{
                        "&:first-child":{
                            borderRadius:"0px 0px 0px 10px"
                        },
                        "&:last-child":{
                            borderRadius:"0px 0px 10px 0px"
                        },
                    }
                    
                }
            }
        },
        "&.dark":{
            "& thead":{
                backgroundColor:"rgba(0,0,0,0.5)",
                color:"#ccc",
                "&>tr":{
                    padding:"15px",
                    textAlign:'left !important',
                    borderBottom:"1px solid #333"
                },
                "& tr":{
                    "& th":{
                        "&:hover":{
                            backgroundColor:"rgba(255,255,255,0.2)"
                        }
                    }
                }
            },
            "& tbody":{
                backgroundColor:"#222",
                "& tr":{
                    color:"#ccc",
                    "&:hover":{
                        backgroundColor:"#333"
                    }
                }
            }
        }
    },
    checkboxContainer:{
        width:'20px'
    },
    image:{
        width:'40px',
        height:'40px',
        objectFit:"cover",
        borderRadius:"3px",
        boxShadow:"0px 2px 3px rgba(0,0,0,0.2)"
    },
    imgPlaceholder:{
        width:'40px',
        height:'40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize:"0.9",
        color:"#888",
        boxShadow:"0px 2px 3px rgba(0,0,0,0.2)",
        backgroundColor:"#ddd"
    }
}

export default withStyles(styles)(Browser)