import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/CheckCircle'

class Snackbar extends Component {
    render() {
        const {classes} = this.props
        return (
            <div className={classes.container}>
                <CheckIcon className="successIcon"/>
                <div className="text">
                    <b>{this.props.title}</b>
                    {this.props.desc && <p>{this.props.desc}</p>}
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
        display:'flex',
        width:"250px",
        padding:'15px',
        borderRadius:'10px',
        backgroundColor:"rgba(255,255,255,0.6)",
        backdropFilter:"blur(10px)",
        boxShadow:"0px 3px 10px rgba(0,0,0,0.5)",
        "& .text":{
            flexGrow:"1",
            fontSize:"0.9em"
        },
        "& .successIcon":{
            color:'#7cb342',
            marginRight:"10px"
        }
    }
}

export default withStyles(styles)(Snackbar)