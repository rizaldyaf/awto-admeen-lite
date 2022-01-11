import {createStore, combineReducers} from 'redux'
import core from "./reducers/core"

export default createStore(combineReducers({core}),{})