import React, { Component, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import {isMobile} from "react-device-detect"
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import {withStyles, Dialog, DialogTitle, DialogContent, DialogActions, ButtonBase, withWidth, Grid} from "@material-ui/core"

import AddIcon from '@material-ui/icons/AddBox'
import { render } from '@testing-library/react'

const ItemTypes = {
    CARD: 'Card',
}

const cardStyle = {
    width:'100%',
    height:"300px",
    backgroundColor:"#ddd",
    border:"1px solid black"
}

const dropStyle = {
    width:'100%',
    height:"300px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"yellow",
}

const dummyData = ["foo", "bar", "baz", "qux"]

class Container extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDragging:false,
            hoverIndex:-1
        }
    }
    
    handleHover = (index) => {
        this.setState({
            hoverIndex:index
        })
    }

    handleDrag = (value) => {
        this.setState({
            isDragging:value
        })
    }

    handleDrop = (data, dropzone) => {
        console.log("something dropped")
        console.log("item:",data)
        console.log("dropzone:",dropzone)
        this.setState({
            hoverIndex:-1
        })
    }

    render(){
        return (<div style={{
            border:'1px solid #ddd',
            borderRadius:"10px", 
            width:"100%", 
            position: 'relative',
        }}>
            <Grid container style={{position:"absolute", top:"0", left:"0", zIndex:"1", opacity:"0.2", pointerEvents:this.state.isDragging?"all":"none"}}>
                {dummyData.map((_, idx)=>{
                    return <Grid item xs={6}>
                        <DropzoneAlt 
                            idx={idx} 
                            onHover={(idx)=>this.handleHover(idx)}
                        />
                    </Grid>
                })}
            </Grid>
            <Grid container>
                {dummyData.map((data, idx)=>{
                        return <>
                            <HoverFiller idx={idx} data={data} isDraggedOver={(this.state.isDragging && this.state.hoverIndex === idx)}/>
                            <Grid item xs={6}>
                                <AltCard data={data} onDrag={this.handleDrag} onDropped={this.handleDrop}/>
                            </Grid>
                        </>
                })}
            </Grid>
        </div>)
    }
    
}

const HoverFiller = (props) => {
    return <Grid item xs={6} style={{
        maxWidth: props.isDraggedOver?"inherit":"0%",
        opacity:"0",
        transition:"0.3s ease-out"
    }}><div>Before {props.data}</div></Grid>
}

const AltCard = (props) => {
    const [{isDragging}, drag] = useDrag({
        item:{
            type:ItemTypes.CARD,
            data:props.data,
        },
        begin:()=>({
            data:props.data,
        }),
        end:(item, monitor)=>{
            let dropzone = monitor.getDropResult()
            if (props.onDrag) {
                setTimeout(()=>{
                    props.onDrag(false) 
                },300)
            }
            if (props.onDropped && dropzone) {
                props.onDropped(item.data, dropzone)
            }
        },
        collect: (monitor) => {
            if (props.onDrag && monitor.isDragging()) {
                props.onDrag(monitor.isDragging())
            }
            return ({
                isDragging: monitor.isDragging(),
                handlerId: monitor.getHandlerId(),
            })
    },
    })

    return <div 
        ref={drag} 
        role="Card" 
        style={cardStyle}
    >{props.data}</div>
}

const DropzoneAlt = (props) => {
    const [{canDrop, isOver}, drop] = useDrop({
        accept:ItemTypes.CARD,
        drop:()=>({name:props.idx}),
        collect:(monitor)=>{
            if (monitor.isOver()) {
                props.onHover(props.idx)
            }
            return ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            })
        }
    })
    return <div ref={drop} style={dropStyle}>dropzone</div>
}

const Dropzone = (props) => {
    const [{canDrop, isOver}, drop] = useDrop({
        accept:ItemTypes.CARD,
        drop:()=>({name:props.name}),
        collect:(monitor)=>{
            return ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            })
        }
    })

    return (<div style={{
        // border:'1px solid #333',
        background:canDrop?"#4caf50":"#fff",
        height:"100px",
        transition:(canDrop && isOver) ? "0.3s ease-out":"0.0001s",
        width:'20px',
        padding:isOver?"0px 40px":"0px",
        opacity:isOver?"0.4":"1"
    }}
        role="Dropzone"
        ref={drop}
    >
    </div>)
}

class DragDrop extends Component {
    constructor(props){
        super(props)
        this.defaultReqBody = {
            context:{},
            filters:[],
            sorts:[],
            limit:10,
            offset:0
        }
        this.state = {
            dataList:props.value
                ? props.value.map((line, index)=>({...line, sequence:index+1})) //make sure sequence starts from 1
                : [
                    {property:{name:"foo"}, sequence:1},
                    {property:{name:"bar"}, sequence:2},
                    {property:{name:"baz"}, sequence:3},
                    {property:{name:"quz"}, sequence:4},
                ],
            searchResult:[],
            defaultSearchResult:[],
            selected:[],
            open:false,
            reqBody:this.defaultReqBody
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            dataList:nextProps.value 
            ? nextProps.value.map((line, index)=>({...line, sequence:index+1}))
            : [
                {property:{name:"foo"}, sequence:1},
                    {property:{name:"bar"}, sequence:2},
                    {property:{name:"baz"}, sequence:3},
                    {property:{name:"quz"}, sequence:4},
            ]
        })
    }

    applyChange = () => {
        if (this.props.onChange) {
            this.props.onChange(this.props.field, this.state.dataList)
        }
    }


    getData = (saveDefault) => {
        // API("browse", "realestate/property", this.state.reqBody).then((response)=>{
        //     let newState = {searchResult:response.data.records}
        //     if (saveDefault){
        //         newState.defaultSearchResult = response.data.records
        //     }
        //     this.setState(newState)
        // })
    }

    handleDrop = (droppedLine, dropzone) => {
        let newSequence = []
        if (dropzone.name === "end") {
            newSequence = [
                ...(this.state.dataList.filter((line)=>line.sequence !== droppedLine.sequence)),
                droppedLine
            ]
        } else {
            let newLocation = parseInt(dropzone.name.split("-")[1])
            console.log(droppedLine.sequence)
            console.log(newLocation)
            if (newLocation !== droppedLine.sequence) {
                this.state.dataList.map((line, index)=>{
                    if (line.sequence !== droppedLine.sequence) {
                        if (index === newLocation-1) {
                            newSequence.push(droppedLine)
                            newSequence.push(line)
                        } else {
                            newSequence.push(line)
                        }
                    }
                })
            } else {
                newSequence = [
                    ...this.state.dataList
                ]
            }
            
        }
        this.setState({
            dataList:newSequence.map((line, index)=>({...line, sequence:index+1}))
        }, ()=>{
            this.applyChange()
            console.log(this.state.dataList)
        })
        
    }

    toggleOpen = () => {
        if (this.state.searchResult.length === 0 && this.state.open === false) {
            this.getData(true)
        }
        this.setState({
            open:!this.state.open
        })
    }

    handleSelect = (id) => {
        let newSelected = []
        if (this.state.selected.includes(id)) {
            newSelected = this.state.selected.filter((el)=>el !== id)
        } else {
            newSelected = [
                ...this.state.selected,
                id
            ]
        }

        this.setState({
            selected:newSelected
        })
    }

    handleAdd = () => {
        let selectedLines = []
        this.state.searchResult.map((resultLine)=>{
            if (this.state.selected.includes(resultLine.id)) {
                selectedLines.push({
                    [this.props.itemField || "item"] : resultLine,
                    [this.props.itemFieldId || "itemId"] : resultLine.id
                })
            }
        })
        let lastSequence = this.state.dataList.length ? this.state.dataList[this.state.dataList.length-1].sequence : 0
        let newDataList = [
            ...this.state.dataList,
            ...selectedLines.map((selectedLine, index)=>{
                selectedLine.sequence = lastSequence + (index +1)
                return selectedLine
            })
        ]
        this.setState({
            open:false,
            searchResult:this.state.defaultSearchResult,
            reqBody:this.defaultReqBody,
            selected:[],
            dataList:newDataList
        },()=>{
            this.applyChange()
        })
    }

    handleFilter = (newFilters) => {
        let newReqBody = this.defaultReqBody
        if (newFilters.location){
            newReqBody.context.location = newFilters.location
        }
        this.setState({
            reqBody:newReqBody
        },()=>this.getData())
    }

    handleRemove = (indexToRemove) => {
        let newDataList = []
        let counter = 0
        this.state.dataList.map((line, idx)=>{
            if (idx === indexToRemove) {
                if (line.id) {
                    newDataList.push({
                        ...line,
                        delete:true,
                        sequence:0
                    })
                }
            } else {
                counter = counter + 1
                newDataList.push({
                    ...line,
                    sequence:counter
                })
            }
            
        })
        this.setState({
            dataList:newDataList
        },()=>{
            this.applyChange()
        })
    }

    render() {
        const {classes, customComponent, itemField, renderMode} = this.props
        return (
            <div>
                <DndProvider backend={isMobile?TouchBackend:HTML5Backend}>
                    <Container 
                        dataList        = {this.state.dataList.filter(line=>!line.delete)} 
                        onDropped       = {this.handleDrop}
                        onAdd           = {this.toggleOpen}
                        customComponent = {customComponent}
                        onRemove        = {renderMode !== "formView" ? this.handleRemove : ()=>{}}
                        itemField       = {itemField}
                        renderMode      = {renderMode}
                    />
                </DndProvider>
                {/* <Dialog
                    open        = {this.state.open}
                    onClose     = {this.toggleOpen}
                    fullScreen  = {this.props.width === "xs"}
                >
                    {this.state.open && <><DialogTitle className={classes.dialogTitle}>
                        {this.props.filterForm ? this.props.filterForm({onClose:this.toggleOpen, onFilter:this.handleFilter}) : ""}
                    </DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        {this.state.searchResult.map((resultLine, index)=>{
                            return <div 
                                key     = {index} 
                                style   = {this.props.listItemComponent?{}:{padding:"10px 0px", border:this.state.selected.includes(resultLine.id)?"1px solid red":"none"}}
                                onClick = {()=>this.handleSelect(resultLine.id)}
                            >
                                {this.props.listItemComponent
                                    ? this.props.listItemComponent({
                                        isSelected:this.state.selected.includes(resultLine.id),
                                        data:resultLine
                                    })
                                    : resultLine.name
                                }
                            </div>
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            color="success"
                            fullWidth={this.props.width === "xs"} 
                            disabled={this.state.selected.length === 0} 
                            onClick={()=>this.handleAdd()}
                        >
                            {tl("add")}{this.state.selected.length ? ` (${this.state.selected.length})` : ""}
                        </Button>
                    </DialogActions></>} 
                </Dialog>*/}
            </div>
        )
    }
}

const styles = {
    dialogTitle:{
        background:"#F7F7F7",
        borderBottom:"1px solid #ddd",
        fontFamily:"Quicksand !important",
        padding:'0px 10px',
    },
    dialogContent:{
        padding:"0px 10px"
    }
}

export default withWidth()(withStyles(styles)(DragDrop))