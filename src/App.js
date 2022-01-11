import React, {Component} from 'react';
import MainPanel from './core/layouts/MainPanel'
import {
  HashRouter, 
  Route, 
  Switch,
  Redirect
} from "react-router-dom"
import {createBrowserHistory} from "history"
import Login from "core/pages/login";
import ThemeEngine from "core/components/ThemeEngine"
import firebase from "firebase";
import appConfig from "application/appConfig"

const hist = createBrowserHistory()

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isUserSignedIn:false
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
        } else {
            this.setState({
                isUserSignedIn:false
            })
        }
        
    })
  }

  render() {
    return (
      <ThemeEngine>
        <HashRouter history={hist}>
          <Switch>
            <Route component={MainPanel}  path="/admin"   />
            <Route component={Login}  path="/login"   />
            <Redirect from="/" to={this.state.isUserSignedIn?appConfig.defaultRoute:"/login"}/>

          </Switch>
        </HashRouter>
      </ThemeEngine>
    );
  }
}


export default App
