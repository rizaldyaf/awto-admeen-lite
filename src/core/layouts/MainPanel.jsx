import React, { Component } from 'react'
import CRUDEngine from "../components/CRUDEngine"
import {Route, withRouter} from "react-router-dom"
import routes from 'application/routes';
import Sidebar from 'core/layouts/Sidebar'
import firebase from "firebase";
import appConfig from "application/appConfig"
import Helmet from "react-helmet"
import _ from "lodash"
import HomeComponent from '../components/HomeComponent';

class MainPanel extends Component {
    constructor(props){
        super(props)

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
                console.log("already logged in")
            } else {
                this.props.history.push("/login")
            }
            
        })
    }

    render() {
        const path = this.props.location.pathname.split("/")
        let currentRoute = path[2] === "home" ? {label:"Dashboard"} :_.find(routes,["path", "/"+path[2]])
        return (
            <>
                <Helmet title={appConfig.companyName+" | "+currentRoute.label}/>
                <Sidebar route={currentRoute}/>
                <div>
                    <Route component={HomeComponent} exact path={"/admin/home"}/>
                    {routes.filter((route)=>route.path !== "home").map((route, key)=>{
                        return <Route 
                            key={key}
                            exact  
                            component={()=>{
                                if (route.customComponent) {
                                    return React.createElement(route.customComponent, {route})
                                } else {
                                    return <CRUDEngine route={route}/>
                                }
                                
                            }} 
                            path={"/admin"+route.path+"/:id?"}
                        />
                    })}
                </div>
            </>
        )
    }
}

export default withRouter(MainPanel)
