import React, { Component } from 'react'
import {withStyles, Dialog} from '@material-ui/core'
import SwipeableViews from "react-swipeable-views"
import firebase from 'firebase'
import Navbar from "core/layouts/Navbar"
import Browser from "core/components/Browser"
import Form from "core/components/Form"
import Button from "core/components/Button"
import appConfig from "application/appConfig"
import Snackbar from "core/components/system/Snackbar"

import {mapStateToProps, mapDispatchToProps} from "../redux/redux"
import {connect} from "react-redux"
import { withRouter } from 'react-router'
import { compose } from "redux"
import { withSnackbar } from 'notistack' 
import _ from 'lodash';

const styles = {
    container:{
        padding:"10px",
        transition:"0.3s ease-in-out",
        "&.sidebarOpen":{
            paddingLeft:"260px",
            transition:"0.3s ease-in-out",
            "@media(max-width:560px)":{
                paddingLeft:"10px"
            }
        }
    },
    swipeable:{
        "& >div":{
            willChange:"unset !important"
        }
    }
}


class CRUDEngine extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: "",
            class: "",
            mode: "create",
            activeId:null,
            records:[],
            record:{},
            viewIndex:0,
            page:1,
            isDialogOpen:false,
            dialog:null,
            isLoading:false,
            isSaving:false,
            _cachedRecords:[]
        }

        this.browserRef = React.createRef()
    
        if (firebase.apps.length === 0) {
            firebase.initializeApp(appConfig.firebase)
        }
        this.db = firebase.firestore()
        this.searchField = null

        if (props.route.searchableField) {
            this.searchField = props.route.searchableField
        } else if (props.route.model && Array.isArray(props.route.model) && props.route.model.length > 0 && props.route.model[0].field) {
            this.searchField = props.route.model[0].field
        } else if (_.find(props.route.model, ["field", "name"])) {
            this.searchField = "name"
        } else {
            console.error("please define searchableField for model '"+props.route.modelName+"'")
        }
    }

    handleOpenDialog = (dialogOptions) => {
        this.setState({
            isDialogOpen: true,
            dialog:dialogOptions
        })
    }

    handleDialogClose = () => {
        this.setState({
            isDialogOpen: false,
            dialog:null
        })
    }

    pushNotification = (type, title, desc) => {
        this.props.enqueueSnackbar('',{
            content : key => <Snackbar 
                key={key}
                type={type}
                title={title}
                desc={desc}
            />
        })
    }

    componentDidMount(){
        const {core, match} = this.props
        this.refreshData()
        if (match.params.id) {
            if (match.params.id === "create") {
                setTimeout(()=>{
                    this.setState({
                        viewIndex:1
                    })
                },300)
                    
            } else {
                this.db.collection(this.props.route.modelName).doc(match.params.id).get().then((snap)=>{
                    if (snap.exists) {
                        let data = snap.data()
                        this.props.setActiveRecord({
                            id: snap.id,
                            snapshot: snap,
                            ...data
                        })
                        this.setState({
                            viewIndex:1,
                            activeRecord:core.activeRecord
                        })
                    } else {
                        this.handleOpenDialog({
                            title:"Data Not Found",
                            text:"Data you're looking is not available. Probably deleted",
                            disableDismiss:true,
                            labelYes:"Close",
                            handleYes:()=>{
                                this.handleDialogClose()
                                this.props.history.push(this.props.match.path.replace("/:id?",""))
                            }
                        })
                    }
                })              
            }
        }
    }

    refreshData = () => {
        this.setState({
            isLoading:true,
            isError:false
        })
        this.db.collection(this.props.route.modelName).limit(10).get().then((response)=>{
            let newRecords = []
            response.forEach((doc) => {
                let data = doc.data()
                data.id = doc.id
                data.snapshot = doc
                newRecords.push(data)
            })
            this.setState({
                isLoading:false,
                records:newRecords,
                _cachedRecords:newRecords,
                disableNext:newRecords.length < 10
            })
        }).catch((error)=>{
            this.setState({
                isLoading:false,
                isError:true
            })
            console.error(error)
        })
    }

    handleChange = (field, event) => {
        this.setState({
            record:{
                ...this.state.record,
                [field]:event.target.value
            }
        })
    }

    handleClickRow = (record) => {
        this.setState({
            viewIndex:1,
            activeId:record.id,
            record: record,
        })
        if (this.props.match.path.endsWith(":id?")) {
            this.props.history.push(this.props.match.path.replace(":id?", record.id))
        }
        this.props.setActiveRecord(record)
    }

    handleClickCreate = () => {
        this.setState({
            viewIndex:1,
        })
        if (this.props.match.path.endsWith(":id?")) {
            this.props.history.push(this.props.match.path.replace(":id?", "create"))
        }
        this.props.setActiveRecord({})
    }

    handleSaveRecord = (record) => {
        if (record.id) {
            this.handleUpdate(record)
        } else {
            this.handleCreate(record)
        }
    }

    handleUpdate = (record) => {
        delete record.snapshot
        this.setState({
            isSaving: true
        })
        this.db.collection(this.props.route.modelName).doc(record.id).update(record).then(()=>{
            this.props.setActiveRecord(record)
            this.pushNotification("success", "Data successfully updated")
            this.setState({
                isSaving:false
            })
        }).catch((error)=>{
           console.error(error)
           this.setState({isSaving:false})
           this.pushNotification("danger", "Failed to update data")
        })
    }

    handleCreate = (record) => {
        this.setState({
            isSaving: true
        })
        this.db.collection(this.props.route.modelName).add(record).then((result)=>{
            const dataResult = result
            this.handleBack()
            this.pushNotification("success", "Data successfully created")
            this.refreshData()
            if (this.props.route.onCreated) {
                const routeCopy = {
                    ...this.props.route,
                    onCreated:undefined
                }
                dataResult.get().then((res)=>{
                    let record = {
                        id:res.id,
                        ...res.data()
                    }
                    this.props.route.onCreated(record, routeCopy, this.db, this.pushNotification)
                })
            }
        }).catch((error)=>{
            console.error(error)
            this.setState({isSaving:false})
            this.pushNotification("danger", "Failed to save data")
        })
    }

    handleDelete = (identifiers) => {
        this.handleOpenDialog({
            title:"Delete Data",
            text:"Are you sure want to delete selected item(s)?",
            handleYes:()=>this.confirmDelete(identifiers),
            handleNo:()=>this.handleDialogClose(),
            labelYes:"Yes, Delete",
            labelNo:"Cancel"
        })
    }

    handleSearch = (searchInput) => {
        if (searchInput) {
            if (this.state.records.length < 10) {
                //local search
                if (this.searchField) {
                    this.setState({
                        records:this.state._cachedRecords.filter((record)=>record[this.searchField].toLowerCase().includes(searchInput.toLowerCase()))
                    })
                }
                
            } else {
                //firestore search
                if (this.searchField) {
                    this.setState({
                        isLoading:true,
                    })
                    let docRef = this.db.collection(this.props.route.modelName)
                    docRef.get().then((response)=>{
                        let loaded = []
                        response.forEach((snap)=>{
                            loaded.push({
                                ...snap.data()
                            })
                        })
                        this.setState({
                            isLoading:false,
                            records:loaded.filter((record)=>record[this.searchField].toLowerCase().includes(searchInput.toLowerCase()))
                        })
                    })
                }
                
            }
        } else {
            this.setState({
                records:this.state._cachedRecords
            })
        }
        
    }

    handleClearSearch = () => {
        this.setState({
            records:this.state._cachedRecords
        })
    }

    handleCancel = () => {
        this.setState({
            mode:"create",
            activeId:null
        })
    }

    handleBack = () => {
        this.props.history.push(this.props.match.path.replace("/:id",""))
    }

    confirmDelete = (identifiers) => {
        if (identifiers.length > 0) {
            if (identifiers.length > 1) {
                let batch = this.db.batch()
                identifiers.map((id)=>{
                    batch.delete(this.db.collection(this.props.route.modelName).doc(id))
                    return null
                })
               batch.commit().then(()=>{
                   this.refreshData()
                   this.handleDialogClose()
                   this.browserRef.current.resetChecked()
               }).catch((error)=>{
                   console.error("Failed deleting data",error)
               })
            } else {
                let docRef = this.db.collection(this.props.route.modelName).doc(identifiers[0])
                docRef.delete().then(()=>{
                    this.refreshData()
                    this.pushNotification("success", "Data successfully deleted")
                    this.handleDialogClose()
                }).catch((error)=>{
                   console.error("Failed deleting data",error)
                   this.pushNotification("danger", "Failed to delete data")
                   
                })
            }
        } else {
            this.pushNotification("danger", "Please select one or more record to delete")
            console.log("no Selected")
        }
    }

    handleNavigation = (direction) => {
        const {records} = this.state
        let docRef = this.db.collection(this.props.route.modelName).limit(10)
        if (direction === "next" && !this.state.disableNext) {
            docRef.startAfter(records[records.length - 1].snapshot).get().then((response)=>{
                let newRecords = []
                response.forEach((snap)=>{
                    newRecords.push({
                        id:snap.id,
                        ...snap.data(),
                        snapshot:snap
                    })
                }).catch((error)=>{
                    this.pushNotification("danger", "Failed to load data")
                })
                if (newRecords.length === 0) {
                    this.setState({
                        disableNext:true
                    })
                } else {
                    this.setState({
                        page:this.state.page+1,
                        disableNext: records.length < 10,
                        records:newRecords
                    })
                }
                
            })
        } else if (direction === "prev" && this.state.page > 1) {
            docRef.endBefore(records[0].snapshot).get().then((response)=>{
                let newRecords = []
                response.forEach((snap)=>{
                    newRecords.push({
                        id:snap.id,
                        ...snap.data(),
                        snapshot:snap
                    })
                }).catch((error)=>{
                    this.pushNotification("danger", "Failed to load data")
                })
                this.setState({
                    disableNext: false,
                    page:this.state.page-1,
                    records:newRecords
                })
            })
        }
    }

    render() {
        const {classes, core} = this.props
        return (
            <div className={classes.container+` ${core.isSidebarOpen ? "sidebarOpen" :""}`}>
                <Navbar
                    route={this.props.route}
                    mode={this.state.viewIndex === 0 
                        ? "browse" 
                        : Object.keys(this.props.core.activeRecord).length > 0
                            ? "formEdit" 
                            : "formCreate"
                    }
                    record={this.props.core.activeRecord}
                    onBack={this.handleBack}
                    onSearch={this.handleSearch}
                    onClearSearch={this.handleClearSearch}
                    disableSearch={!this.searchField}
                />
                <SwipeableViews
                    index       = {this.state.viewIndex}
                    className   = {classes.swipeable}
                >
                    <div>
                        <Browser
                            route           = {this.props.route}
                            data            = {this.state.records}
                            mode            = {this.state.mode}
                            page            = {this.state.page}
                            theme           = {core.userConfig.darkMode?"dark":""}
                            isLoading       = {this.state.isLoading}
                            onRefresh       = {()=>this.refreshData()}
                            onCreate        = {this.handleClickCreate}
                            onDelete        = {this.handleDelete}
                            onDataSelected  = {this.handleClickRow}
                            onNext          = {()=>this.handleNavigation("next")}
                            onPrev          = {()=>this.handleNavigation("prev")}
                            disableNext     = {this.state.disableNext}
                            disablePrev     = {this.state.page === 1}
                            ref             = {this.browserRef}
                        />
                    </div>
                    <div>
                        <Form
                            record          = {this.props.core.activeRecord}
                            route           = {this.props.route}
                            isSaving        = {this.state.isSaving}
                            onBack          = {this.handleBack}
                            onSave          = {this.handleSaveRecord}
                            theme           = {core.userConfig.darkMode?"dark":""}
                        />
                    </div>
                </SwipeableViews>
                <Dialog
                    open={this.state.isDialogOpen}
                    onClose={(this.state.dialog && this.state.dialog.disableDismiss) ? ()=>{} :this.handleDialogClose}
                    fullWidth="xs"
                >
                    <div style={{padding:'15px'}}>
                        <div><b>{this.state.dialog && this.state.dialog.title}</b></div>
                        <p>{this.state.dialog && this.state.dialog.text}</p>
                        <div style={{display:'flex', justifyContent:'flex-end'}}>
                            {!(this.state.dialog && this.state.dialog.disableDismiss) && <Button
                                style={{marginRight:'10px'}}
                                onClick={()=>{
                                    if (this.state.dialog && this.state.dialog.handleNo) {
                                        this.state.dialog.handleNo()
                                    } else {
                                        this.handleDialogClose()
                                    }
                                }}
                            >
                                {(this.state.dialog && this.state.dialog.labelNo) 
                                    ? this.state.dialog.labelNo 
                                    :"Cancel"}
                            </Button>}
                            <Button
                                onClick={()=>{
                                    if (this.state.dialog && this.state.dialog.handleYes) {
                                        this.state.dialog.handleYes()
                                    }
                                }}
                            >{(this.state.dialog && this.state.dialog.labelYes)?this.state.dialog.labelYes:"Yes"}</Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
    withRouter,
    withSnackbar
)(CRUDEngine)