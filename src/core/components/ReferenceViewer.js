import React, { Component } from 'react'
import Skeleton from 'react-loading-skeleton'
import {Tooltip, withStyles} from "@material-ui/core"
import WarningIcon from "@material-ui/icons/Warning"

class ReferenceViewer extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            value : "",
            error : false,
        }
    }

    componentDidMount(){
        if (this.props.value) {
            this.setState({
                isLoading:true
            })
            this.props.value.get().then((result)=>{
                let data = result.data()
                this.setState({
                    value : data[this.props.getter],
                    isLoading: false
                })
            }).catch(()=>{
                this.setState({
                    error:true,
                    isLoading:false
                })
            })
        }
    }

    render() {
        const {classes} = this.props
        return (
            <>
                {this.state.isLoading
                ? <Skeleton/>
                : 
                    this.state.error
                    ? <Tooltip title="Data Not Found, Probably deleted. Make sure the corresponding data available in your database">
                        <div className={classes.warning}><WarningIcon className="icon"/>Not Found</div>
                    </Tooltip>
                    : this.state.value || "-"
                }
            </>
        )
    }
}

const styles = {
    warning:{
        display:'flex',
        alignItems:"center",
        color:"#aaa",
        "&.icon":{
            color:"#c62828",
            marginLeft:"10px"
        }
    }
}

export default withStyles(styles)(ReferenceViewer)
