import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import FolderIcon from "@material-ui/icons/FolderOutlined"
// import CameraIcon from "@material-ui/icons/CameraAltOutlined"
import CloseIcon from "@material-ui/icons/Close"
import firebase from "firebase"

class Image extends Component {
    constructor(props){
        super(props)
        this.state = {
            file: props.value? props.value.url :null,
            name: null,
            size:0,
            fromCamera: false
        }

        this.fileInputRef = React.createRef()
        this.storage = firebase.storage()
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.value !== prevState.file) {
            if (nextProps.value && nextProps.value.url) {
                let filePath = nextProps.value.url.split("?")[0]
                let fileName = filePath.split("/").reverse()[0]
                return({
                    file : nextProps.value.url || "",
                    name : fileName,
                    size : nextProps.value.size
                })
            } else {
                return ({
                    file: "",
                    name: "",
                    size: 0
                })
            }
        }
        return null
    }
    
    handleChange = (event) => {
        let file = event.target.files[0]
        let ref = this.storage.ref()
        let fullPathRef = ref.child(file.name)
        fullPathRef.put(file).then((response)=>{
            fullPathRef.getDownloadURL().then(res=>{
                console.log("res", res)
                this.setState({
                    file:res,
                    name:response.metadata.fullPath,
                    size:response.metadata.size
                })
                if (this.props.onChange) {
                    this.props.onChange(this.props.field, {
                        url:res,
                        size:response.metadata.size
                    })
                }
            })
        }).catch(error=>{
            console.error(error)
        })
    }

    parseSize = (size) => {
        let unit = "bytes"
        let newSize = 0
        if (size >= 1000 && size < 1000000) {
            unit = "kB"
            newSize = size / 1000
        } else if (size > 10000000) {
            unit = "MB"
            newSize = size / 10000000
        }
        return newSize+" "+unit
    }

    handleRemove = () => {
        if (this.props.onChange) {
            this.props.onChange(this.props.field, null)
        }
    }

    render() {
        const {classes, disableLabel, gridView, theme} = this.props
        return (
            <div className={classes.outer+` ${gridView?"gridView":""}`}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <div className={classes.container+" "+theme}>
                    {this.state.file 
                    ? <>
                        <img src={this.state.file} className={classes.preview} alt="preview"/>
                        <div className={classes.fileInfo+" "+theme}>
                            {this.state.name} <br/>
                            <span>{this.parseSize(this.state.size)}</span>
                        </div>
                        <CloseIcon className={classes.closeIcon+" "+theme} onClick={()=>this.handleRemove()}/>
                    </>
                    : <div className={classes.fileChooser+" "+theme} onClick={()=>{this.fileInputRef.current.click()}}>
                        <div className="text">Choose File...</div>
                        <FolderIcon className="icon"/>
                    </div>}
                </div>
                <input
                    style={{display:'none'}}
                    className={classes.innerInput}
                    type="file"
                    value={this.state.value}
                    onChange={this.handleChange}
                    ref={this.fileInputRef}
                />
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
        height:"44px",
        border:"1px solid #ccc",
        borderRadius:"5px",
        overflow:"hidden",
        padding:"4px 5px",
        display:'flex',
        "&.dark":{
            border:"1px solid #555"
        }
    },
    preview:{
        width:'40px',
        height:'40px',
        objectFit:"cover",
        borderRadius:"3px",
        boxShadow:"0px 2px 3px rgba(0,0,0,0.2)"
    },
    fileInfo:{
        paddingLeft:'10px', 
        flexGrow:"1",
        "& span":{
            color:"#888", 
            fontSize:"0.9em"
        },
        "&.dark":{
            color:"#ccc",
            "& span":{
                color:"#aaa"
            }
        }
    },
    fileChooser:{
        width:'100%',
        display:'flex',
        alignItems: 'center',
        cursor:"pointer",
        color:'#888',
        "&>.text":{
            flexGrow:"1",
            paddingLeft:"5px"
        },
        "&>.icon":{
            margin:"0px 10px",
            "&:hover":{
                color:'#333'
            }
        },
        "&.dark":{
            color:"#ccc",
            "&>.icon":{
                color:"#ccc",
                "&:hover":{
                    color:"#eee"
                }
            }
        }
    },
    innerInput:{
        outline:"none",
        border:"none",
        padding:"2px 5px",
        width:"100%",   
        "&:focus":{
            outline:"none",
        },
        "&:active":{
            outline:"none",
        }
    },
    closeIcon:{
        color:'#888',
        cursor:"pointer",
        "&:hover":{
            color:'#333'
        },
        "&.dark":{
            color:"#ccc",
            "&:hover":{
                color:"#eee"
            }
        }
    }
}

export default withStyles(styles)(Image)
