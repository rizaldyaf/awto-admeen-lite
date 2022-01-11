import React, { Component } from 'react'
import {withStyles, ButtonBase} from "@material-ui/core"
import Text from "core/components/inputs/Text"
import firebase from "firebase"
import appConfig from "application/appConfig"
import Cookies from "js-cookie"
import {withRouter} from "react-router-dom"
import GithubIcon from "assets/github.png"

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            record:{
                email:"",
                password:""
            },
            errors:{},
            isUserSignedIn:false,
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(appConfig.firebase)
        }
        this.auth = firebase.auth()

    }

    componentDidMount(){
        this.checkUser()
    }

    checkUser = () => {
        this.auth.onAuthStateChanged((user)=>{
            if (user) {
                this.setState({
                    isUserSignedIn:true
                })
                this.props.history.push(appConfig.defaultRoute)
            } else {
                this.setState({
                    isUserSignedIn:false
                })
            }
            
        })
    }

    handleInputChange = (field, value) => {
        this.setState({
            record:{
                ...this.state.record,
                [field]:value
            }
        })
    }

    handleLogin = () => {
        const {email, password} = this.state.record
        Cookies.set("accessToken","true")
        this.auth.signInWithEmailAndPassword(email, password).then((response)=>{
            console.log("response",response)
            this.props.history.push(appConfig.defaultRoute || "/admin/home")
        }).catch((error)=>{
            if (error.code === "auth/wrong-password") {
                this.setState({
                    errors:{
                        login:"Wrong password"
                    }
                })
            } else {
                this.setState({
                    errors:{
                        login:"Email is not registered"
                    }
                })
            }
            console.error(error)
        })
    }

    handleLogout = () => {
        this.auth.signOut()
        this.setState({
            isUserSignedIn:false
        })
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.container}>
                <div className={classes.loginBox}>
                    <div className="left">
                        <div className={classes.logoContainer}>
                            <img src={appConfig.companyLogo} className={classes.companyLogo} alt="company logo" />
                        </div>
                        <div className={classes.copyright}>
                            <div style={{flexGrow:'1', paddingBottom:"5px"}}>
                                Powered By Awto Admeen Framework<br/>
                                &copy; Copyright rizaldyaf_ 2021
                            </div>
                            <ButtonBase style={{marginLeft:"10px", padding:'5px', borderRadius:"3px"}} onClick={()=>window.open("https://github.com/rizaldyaf/awto-admeen-lite")}>
                                <img src={GithubIcon} style={{width:"30px", height:'30px'}} alt="visit github"/>
                            </ButtonBase>
                            
                        </div>
                        
                    </div>
                    <div className="right">
                        <div className={classes.loginTitle}>
                            Login
                        </div>
                        {!this.state.isUserSignedIn && <><Text
                            label="E-mail"
                            field="email"
                            value={this.state.record.email}
                            onChange={this.handleInputChange}
                        />
                        <Text
                            obscureText
                            label="Password"
                            field="password"
                            value={this.state.record.password}
                            onChange={this.handleInputChange}
                        />
                        {this.state.errors.login && <div className={classes.errorNotes}>{this.state.errors.login}</div>}
                        <ButtonBase className={classes.loginButton} onClick={()=>this.handleLogin()}>
                            Login
                        </ButtonBase></>}
                        {this.state.isUserSignedIn && <ButtonBase className={classes.loginButton} onClick={()=>this.handleLogout()}>
                            Logout
                        </ButtonBase>}
                    </div>
                    
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
        width:"100%",
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    },
    loginBox:{
        width:"650px",
        minHeight:"200px",
        boxShadow:"0px 15px 20px rgba(0,0,0,0.2)",
        backdropFilter:"blur(10px)",
        overflow:"hidden",
        borderRadius:"10px",
        display:"flex",
        "&>.left":{
            width:'50%',
            backgroundColor:"rgba(255,255,255,0.5)",
            padding:"20px",
            display: 'flex',
            flexDirection: 'column',
        },
        "&>.right":{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor:"rgba(255,255,255,0.7)",
            padding:"20px",
            width:'50%'
        },
        "@media(max-width:560px)":{
            width:'100%',
            flexDirection:'column',
            margin:"0px 20px",
            "&>.left":{
                width:'calc(100% - 40px)'
            },
            "&>.right":{
                width:'calc(100% - 40px)'
            }
        },
    },
    loginTitle:{
        fontWeight:"800",
        fontSize:'1.5em',
        marginBottom:'15px',    
        color:"#333",
    },
    loginButton:{
        marginTop:'15px',
        width:"100%",
        padding:"7px 0px",
        backgroundColor:"blue",
        color:"#fff",
        border:"none",
        borderRadius:"10px",
        fontSize:"1.1em"
    },
    errorNotes:{
        marginBottom:"15px",
        color:"red"
    },
    logoContainer:{
        width:'100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop:"20px",
    },
    companyLogo:{
        width:"150px",
        height:"auto"
    },
    copyright:{
        width:'100%',
        display:'flex',
        alignItems:'flex-end',
        marginTop:"auto",
        fontSize:"0.8em",
        "@media(max-width:560px)":{
            marginTop:"20px"
        }
    }
}

export default withStyles(styles)(withRouter(Login))