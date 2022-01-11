import React, { Component } from 'react'
import Select from "react-select"
import firebase from "firebase"
import {withStyles} from "@material-ui/core"
import _ from "lodash"

class Reference extends Component {
    constructor(props){
        super(props)
        this.state = {
            suggestions:[],
            searchResult:[],
            value:null,
            defaultValue:null,
            isLoading:false
        }
        this.db = firebase.firestore()
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.value) {
            if (this.props.preload) {
                this.setState({
                    value:nextProps.value,
                    defaultValue:nextProps.value
                })
            } else {
              nextProps.value.get().then((res)=>{
                    this.setState({
                        value:res.data(),
                        defaultValue:res.data()
                    })
                })  
            }
            
        } else {
            this.setState({
                value:null,
                defaultValue:null
            })
        }
        if (nextProps.model !== this.props.model) {
            this.setState({

            },()=>{
                this.getSuggestion()
            })
            
        }
        
    }

    componentDidMount(){
        if (this.props.value) {
            this.setState({
                isLoading:true
            })
            if (this.props.preload) {
                this.setState({
                    value:this.props.value,
                    defaultValue:this.props.value,
                    isLoading:false
                })
            } else {
                this.props.value.get().then((res)=>{
                    this.setState({
                        value:res.data(),
                        defaultValue:res.data(),
                        isLoading:false
                    })
                })
            }
            
        }
        if (this.state.suggestions.length === 0) {
            this.getSuggestion()
        }
        
    }

    getSuggestion() {
        let docRef = this.db.collection(this.props.model) 
        docRef.get().then((snapshots)=>{
            let newSuggestions = []
            snapshots.forEach((snap)=>{
                newSuggestions.push({
                    id: snap.id,
                    ...snap.data()
                })
            })
            this.setState({
                suggestions:newSuggestions
            })
        })
    }

    handleChange = ({value}) => {
        if (this.props.onChange && this.props.field) {
            let data = _.find(this.state.suggestions,["id", value])
            let doc = this.db.doc(this.props.model+"/"+value)
            this.props.onChange(this.props.field, this.props.preload?data:doc)
            if (this.props.hasEffect) {
                this.props.onEffect(data)
            }
        }
        
    }

    render() {
        const {classes, disableLabel, theme, editable} = this.props
        return (
            <div className={classes.container}>
                {!disableLabel && <label className={classes.label}>{this.props.label}</label>}
                <Select
                    isDisabled={editable === false}
                    value={this.state.value 
                        ? {
                            value:this.state.value,
                            label:this.state.value[this.props.getter]
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
                    }:{
                        control:provided=>({
                            ...provided,
                            backgroundColor:"#f8f8f8",
                        })
                    }}
                    isLoading={this.state.isLoading}
                    onChange={this.handleChange}
                    placeholder={this.state.isLoading
                        ?"Loading..."
                        :editable === false?"Empty":"Search..."}
                    options={this.state.suggestions.map(list => {
                        return {
                            value:list["id"],
                            label:list[this.props.getter]
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

export default withStyles(styles)(Reference)