import React, { Component } from 'react'
import {withStyles, ButtonBase} from '@material-ui/core'
import firebase from "firebase"
import {connect} from "react-redux"
import {mapStateToProps, mapDispatchToProps} from "../redux/redux"
import {withRouter} from "react-router-dom"
import routes from "application/routes.js"
import {Link} from "react-router-dom"
import Cookies from "js-cookie"
import _ from "lodash" 
import appConfig from "application/appConfig"
import users from "application/users"
import Config from "application/appConfig"

import UserIcon from "@material-ui/icons/Person"
import LightModeIcon from "@material-ui/icons/Brightness5Outlined"
import DarkModeIcon from "@material-ui/icons/NightsStayOutlined"
import CloseIcon from "@material-ui/icons/Close"
import LogoutIcon from "@material-ui/icons/PowerSettingsNewOutlined"
import SearchIcon from "@material-ui/icons/Search"
import HomeIcon from "@material-ui/icons/HomeOutlined"
import MenuItemIcon from "@material-ui/icons/CloudOutlined"
// import SettingsIcon from "@material-ui/icons/SettingsOutlined"


const styles = {
    sidebar:{
        top:0,
        left:0,
        position:"fixed",
        height:"100%",
        width:"250px",
        zIndex:"1000",
        backgroundColor:"rgba(255,255,255,0.5)",
        backdropFilter:Config.disableBlurEffects?"none":"blur(10px)",
        boxShadow:"5px 0px 10px rgba(0,0,0,0.2) ",
        transition:"0.3s ease-in-out",
        overflowX:"hidden",
        "&.closed" :{
            left:"-250px",
            transition:"0.3s ease-in-out",
        },
        "&.dark":{
            backgroundColor:"rgba(0,0,0,0.5)",
            color:"#ccc"
        }
    },
    closeButton:{
        position:"absolute",
        display:'none',
        right:"0px",
        top:"0px",
        padding:'5px',
        margin:'5px',
        borderRadius:'5px',
        "@media(max-width:560px)":{
            display:"block"
        },
        "&.dark":{
            color:"#ccc"
        }
    },
    companyLogo:{
        width:'100%',
        height:"60px",
        margin:'10px 0px',
        display: 'flex',
        justifyContent: 'center',
        "& img":{
            height:'60px',
            width:'auto',
        },
        "&.dark":{
            "& img":{
                filter:"invert(1)"
            }
        }
    },
    userMenu:{
        width:'100%',
        display: 'flex',
        "&>.profile":{
            width:'100%',
            display: 'flex',
            margin:'0px 10px',
            flexGrow:"1",
            justifyContent: 'center',
            alignItems: 'center',
            "& img":{
                width:'40px',
                height:'40px',
                objectFit:"cover",
                borderRadius:"50%",
                marginRight:"10px"
            },
            "&>.placeholder":{
                width:'40px',
                height:'40px',
                display: 'flex',
                borderRadius:"50%",
                marginRight:"10px",
                alignItems: 'center',
                justifyContent: 'center',
                color:'#eee',
                backgroundColor:"#ccc"
            },
            "&>.name":{
                flexGrow:"1",
                maxWidth:"90px",
                fontWeight:"bold",
                whiteSpace:"nowrap",
                textOverflow:'ellipsis',
                overflow:"hidden"
            }
        },
        "&>.userOptions":{
            display: 'flex',
            margin:'0px 10px 0px 0px',
            alignItems: 'center',
            height:"40px",
            "&>.button":{
                marginLeft:"10px",
                borderRadius:'5px',
                fontSize:'0.8rem',
                width:"30px",
                height:'30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }
        }
    },
    searchBar:{
        margin:'10px 0px',
        "&>.searchContainer":{
            margin:'0px 10px',
            padding:"3px 10px",
            display: 'flex',
            alignItems: 'center',
            backgroundColor:"rgba(0,0,0,0.3)",
            borderRadius:"5px",
            "&>input":{
                flexGrow:"1",
                outline:"none !important",
                backgroundColor:"transparent",
                border:"transparent",
                color:'#fff',
                "&::placeholder":{
                    color:"rgba(255,255,255,0.5)"
                },
                "&:focus":{
                    border:"transparent",

                },
                "&:active":{
                    border:"transparent",
                }
            },
            
            "&>.icon":{
                color:'#fff',
                opacity:"0.6"
            }
        },
        "&.dark":{
            "&>.searchContainer":{
                backgroundColor:"rgba(255,255,255,0.2)",
                "&>.input":{
                    color:"#ddd",
                    "&::placeholder":{
                        color:"rgba(255,255,255,0.7)"
                    },
                }
            }
        }
    },
    scrolledMenu:{
        height:"calc(100vh - 170px)",
        overflowY:"auto",
        overflowX:'hidden',
        transition:"0.3s ease-out",
        "&:hover":{
            "&::-webkit-scrollbar":{
                width:"10px",
                transition:"width 0.3s ease-out",
            },
        },
        "&::-webkit-scrollbar"  :{
            width:"5px",
            transition:"width 0.3s ease-out",
        },
        "&::-webkit-scrollbar-thumb":{
            background:"rgba(0,0,0,0.5)",
            borderRadius:"3px",
        },
        "&.dark":{
            "&::-webkit-scrollbar-thumb":{
                background:"rgba(255,255,255,0.5)",
            }
        }
    },
    menu:{
        width:"100%",
        height:"40px",
        display:"flex",
        lineHeight:'1',
        textDecoration:"none !important",
        alignItems:"center",
        padding:"0px 10px",
        color:"#000",
        userSelect:"none",
        "&.isActive":{
            color:Config.accentColor,
            pointerEvents:"none"
        },
        "&:hover":{
            backgroundColor:"rgba(0,0,0,0.2)"
        },
        "&>.icon":{
            marginRight:"10px"
        },
        "&.dark":{
            color:"#aaa",
            "&.isActive":{
                color:Config.accentColorDark
            },
            "&:hover":{
                backgroundColor:"rgba(255,255,255,0.1)"
            },
        }
    }
}

class Sidebar extends Component {
    constructor(props){
        super(props)
        this.state = {
            isOpen : false,
            username: "",
            role:"",
            allow:[],
            filter:"",
            darkMode:false,
        }

        if (firebase.apps.length === 0) {
            firebase.initializeApp(appConfig.firebase)
        }
        this.auth = firebase.auth()

        this.filtererRef = React.createRef()
        this.handleDelayedChange = _.debounce(this.applyFilter, 300)
    }

    componentDidMount(){
        this.checkUser()
    }
    
    checkUser = () => {
        this.auth.onAuthStateChanged((user)=>{
            if (user) {
                let role = null 
                let allow = []
                if (users) {
                    users.map((u)=>{
                        if (u.email === user.email){
                            role = u.role
                            allow = u.allow
                        }
                        return null
                    })
                }
                this.setState({
                    username:user.email.split("@")[0],
                    role,
                    allow
                })
                this.props.setUserConfig(user.email.split("@")[0])
            } else {
                this.props.history.push("/login")
            }
            
        })
    }

    toggleSidebar = () => {
        this.setState({
            isOpen : !this.state.isOpen
        })
    }

    handleLogout = () => {
        this.auth.signOut().then(()=>{
            Cookies.remove("accessToken")
            this.props.history.push("/login")
        }).catch((error)=>{
            console.error(error)
        })
        
    }

    handleChange = (e) => {
        this.handleDelayedChange()
        e.persist()
    }

    applyFilter = () => {
        if (this.filtererRef) {
            this.setState({
                filter:this.filtererRef.current.value
            })
        }
        
    }

    toggleDarkMode = () => {
        this.props.toggleDarkMode()
        Cookies.set("darkMode",this.props.core.userConfig.darkMode?"false":"true", {path:"/"})
    }

    render() {
        const {classes, core} = this.props
        let isDarkMode = core.userConfig.darkMode
        let allowedRoutes = []
        if (this.state.role && this.state.role === "#admin") {
            allowedRoutes = routes
        } else {
            routes.map((route)=>{
                if (this.state.allow.includes(route.modelName)) {
                    allowedRoutes.push(route)
                }
                return null
            })
        }
        if (this.state.filter) {
            allowedRoutes = allowedRoutes.filter((route)=>{
                let matches = route.label.toLowerCase().match(this.state.filter.toLowerCase())
                if (matches && matches.length > 0) {
                    return true
                }
                return false
            })
        }
        return (<>
            <div className={classes.sidebar+` ${core.isSidebarOpen ? "" : "closed"} ${isDarkMode?"dark":""}`}>
                <ButtonBase className={classes.closeButton} onClick={()=>this.props.toggleSidebar()}>
                    <CloseIcon/>
                </ButtonBase>
                <div className={classes.companyLogo+` ${isDarkMode?"dark":""}`}>
                    <img src={Config.companyLogo} alt="company logo"/>
                </div>
                <div className={classes.userMenu}>
                    <div className="profile">
                        <div className="placeholder"><UserIcon/></div>
                        {/* <img src={UserImg} alt="avatar"/> */}
                        <div className="name">
                            {this.state.username}
                        </div>
                    </div>
                    <div className="userOptions">
                        <ButtonBase className="button" onClick={()=>this.toggleDarkMode()}>{isDarkMode?<DarkModeIcon/>:<LightModeIcon/>}</ButtonBase>
                        <ButtonBase className="button" onClick={()=>this.handleLogout()}><LogoutIcon/></ButtonBase>
                    </div>
                </div>
                <div className={classes.searchBar+` ${isDarkMode?"dark":""}`}>
                    <div className="searchContainer">
                        <input
                            ref={this.filtererRef}
                            placeholder="Search Menu"
                            onChange={this.handleChange}
                        />
                        <SearchIcon className="icon"/>
                    </div>
                </div>
                <div className={classes.scrolledMenu+` ${isDarkMode?"dark":""}`}>
                    <Link className={classes.menu+` ${isDarkMode?"dark":""}`} to="/" key="home">
                        <HomeIcon className="icon"/>
                        <div>Home</div>
                    </Link>
                    {allowedRoutes.map((route, index)=>{
                        return <Link 
                                    className={classes.menu+` ${isDarkMode?"dark":""} ${this.props.route.path === route.path?"isActive":""}`} 
                                    to={"/admin"+route.path} 
                                    key={index}
                                >
                            {route.icon?React.createElement(route.icon,{className:"icon"}):<MenuItemIcon className="icon"/>}
                            <div>{route.label}</div>
                        </Link>
                    })}
                </div>
                
                
            </div>
        </>)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Sidebar)))