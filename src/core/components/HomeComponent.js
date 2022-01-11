import React, { Component } from 'react'
import {withStyles, Grid} from "@material-ui/core"
import UserIcon from "@material-ui/icons/Person"
import MenuIcon from "@material-ui/icons/Menu"
import {connect} from "react-redux"
import {mapStateToProps, mapDispatchToProps} from "../redux/redux"

class HomeComponent extends Component {
    render() {
        const {classes} = this.props
        let theme = this.props.core.userConfig.darkMode ? "dark" : ""
        return (
            <div className={classes.container+` ${theme} ${this.props.core.isSidebarOpen?"":"closed"}`}>
                <div className="heading">
                    <div className="hamburger" onClick={()=>this.props.toggleSidebar()}>
                        <MenuIcon/>
                    </div>
                </div>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className={classes.box+` ${theme}`}>
                            <div className="avatar">
                                <UserIcon className="icon"/>
                            </div>
                            <div className="welcomeScreen">
                               <h3>Welcome, {this.props.core.userConfig.username}</h3> 
                               <p>Please select a menu from sidebar to start</p>
                            </div>
                            
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const styles = {
    container:{
        position:"relative",
        width:"calc(100% - 300px)",
        height:"calc(100vh - 50px)",
        paddingTop:"100px",
        marginLeft:'250px',
        transition:"0.3s ease-out",
        "&>.heading":{
            position:'absolute',
            top:"0",
            left:"0px",
            width:"calc(100% - 300px)",
            "&>.hamburger":{
                backgroundColor:"rgba(255,255,255,0.6)",
                backdropFilter:"blur(20px)",
                width:'fit-content',
                margin:"20px",
                padding:'10px', 
                boxShadow:'0px 5px 10px rgba(0,0,0,0.2)',
                borderRadius:"10px",
                cursor:"pointer"
            }
        },
        "&.dark":{
            "&>.heading":{
                "&>.hamburger":{
                    backgroundColor:"rgba(0,0,0,0.5)",
                    color:"#fff"
                }
            }
        },
        "&.closed":{
            width:"calc(100% - 20px)",
            marginLeft:"0px"
        },
        "@media(max-width:560px)":{
            width:"calc(100% - 20px)",
            marginLeft:"0px"
        }
    },
    box:{
        backgroundColor:"rgba(255,255,255,0.6)",
        backdropFilter:"blur(20px)",
        boxShadow:'0px 5px 10px rgba(0,0,0,0.2)',
        margin:"0px 20px",
        minHeight:"100px",
        borderRadius:"20px",
        padding:'20px',
        display: 'flex',
        alignItems: 'center',
        "&>.avatar":{
            width:'50px',
            height:"50px",
            borderRadius:"50%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:"#ccc",
            marginRight:"20px",
            "&>.icon":{
                color:"#eee"
            }
        },
        "&>.welcomeScreen":{
            "&>h3":{
                margin:"0px"
            },
            "&>p":{
                margin:"0px"
            }
        },
        "&.dark":{
            backgroundColor:"rgba(0,0,0,0.5)",
            color:"#fff"
        }
    },
    
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomeComponent))