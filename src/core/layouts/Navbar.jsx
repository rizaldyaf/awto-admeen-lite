import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../redux/redux'
import MenuIcon from "@material-ui/icons/Menu"
import ArrowIcon from "@material-ui/icons/KeyboardArrowRight"
import SearchIcon from "@material-ui/icons/Search"
import CloseIcon from "@material-ui/icons/Close"
import Config from "application/appConfig"
import _ from "lodash"

const styles = {
    navbarContainer:{
        padding:"5px 20px"
    },
    navSearch:{
        borderRadius:"8px",
        display:"flex",
        width:"100%",
        height:"40px",
        alignItems:"center",
        backgroundColor:"white",
        boxShadow:"0px 5px 10px rgba(0,0,0,0.2)",
        overflow:"hidden",
        "&.dark":{
            backgroundColor:"rgba(0,0,0,0.6)",
            backdropFilter:Config.disableBlurEffects?"none":"blur(20px)",
        }
    },
    hamburgerContainer:{
        padding:"15px",
        cursor:"pointer",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        "&:hover":{
            backgroundColor:"#ddd"
        },
        "&.dark":{
            color:"#ccc",
            "&:hover":{
                backgroundColor:"rgba(255,255,255,0.3)"
            }
        }
    },
    searchContainer:{
        display:'flex',
        alignItems:"center",
        borderLeft:"1px solid #ccc",
        padding:"5px 10px",
        "&>.icon":{
            color:'#ccc',
            width:'20px',
            height:'auto',
            marginRight:'5px'
        },
        "&>.clearIcon":{
            borderRadius:"50%",
            width:'23px',
            height:'23px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            "&:hover":{
                backgroundColor:'#ddd',
                "&>.icon":{
                    color:"#888"
                }
            },
            "&>.icon":{
                color:'#ccc',
                width:'20px',
                height:'auto',
            },
        },
        "&.dark":{
            "& input":{
                color:"#f8f8f8"
            }
        }
    },
    searchInput:{
        outline:"none !important",
        backgroundColor:"transparent",
        border:"transparent",
        "&:focus":{
            border:"transparent",
        },
        "&:active":{
            border:"transparent",
        }
    },
    breadCrumbs:{
        display:'flex',
        alignItems: 'center',
        borderLeft:"1px solid #ccc",
        "& .bcItem":{
            height:"24px",
            paddingLeft:"10px",
            borderRadius:'5px',
            display:'flex',
            alignItems: 'center',
            lineHeight:"1",
            fontSize:"0.9em",
            cursor:'pointer',
            "&:last-child":{
                padding:"0px 10px",
                cursor:"default",
                "&:hover":{
                    backgroundColor:'transparent'
                },
            },
            "&:hover":{
                backgroundColor:'#ddd'
            },
            "& .arrow":{
                marginLeft:'10px',
                color:'#333'
            }
        },
        "&.dark":{
            borderLeft:"1px solid #aaa",
            "&>.bcItem":{
                color:"#ccc",
                "&:hover":{
                    backgroundColor:"rgba(255,255,255,0.3)"
                },
                "&>.arrow":{
                    color:"#ccc"
                }
            }
        }
    }
}

class Navbar extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchInput:""
        }

        this.delayedSearch = _.debounce(this.handleSearch, 500)
    }

    handleClickBack = () => {
        if (this.props.onBack) {
            this.props.onBack()
        }
    }

    handleSearchChange = (event) => {
        this.setState({
            searchInput:event.target.value
        })
        if (event.target.value) {
            event.persist()
            this.delayedSearch()
        } else {
            if (this.props.onClearSearch) {
                this.props.onClearSearch()
            }
        }
    }
        

    handleSearch = () => {
        if (this.props.onSearch) {
            this.props.onSearch(this.state.searchInput)
        }
    }

    handleClearSearch = () => {
        this.setState({
            searchInput:""
        },()=>{
            if (this.props.onClearSearch) {
                this.props.onClearSearch()
            }
        })
    }

    getRecordName = () => {
        if (this.props.route.mainField) {
            return this.props.record[this.props.route.mainField]
        } else if (this.props.record.name) {
            return this.props.record.name
        } else if (this.props.route.model[0]) {
            return this.props.record[this.props.route.model[0].field]
        } else {
            return this.props.record.id
        }
    }

    render() {
        const {classes, route, core} = this.props
        let isDarkMode = core.userConfig.darkMode?"dark":""
        return (
            <div className={classes.navbarContainer}>
                <div className={classes.navSearch+` ${isDarkMode}`}>
                    <div className={classes.hamburgerContainer+` ${isDarkMode}`} onClick={()=>this.props.toggleSidebar()}>
                        <MenuIcon/> 
                    </div>
                    {this.props.mode === "browse" 
                        ? !this.props.disableSearch 
                            ? <div className={classes.searchContainer+` ${isDarkMode}`}>
                                <SearchIcon className={`icon ${isDarkMode || ""}`}/>
                                <input
                                    type="text"
                                    value={this.state.searchInput}
                                    onChange={this.handleSearchChange}
                                    className={classes.searchInput}
                                    placeholder="Search Record"
                                />
                                {this.state.searchInput && <div className="clearIcon" onClick={()=>this.handleClearSearch()}>
                                    <CloseIcon className="icon"/>
                                </div>}
                            </div> 
                            : <></>
                        : <div className={classes.breadCrumbs+" "+isDarkMode}>
                        <div className="bcItem" onClick={()=>{this.handleClickBack()}}>
                            {route.label}
                            <ArrowIcon className="arrow"/>
                        </div>
                        {this.props.mode === "formCreate" 
                        ? <div className="bcItem">Create New</div>
                        : <div className="bcItem">{this.getRecordName()}</div>
                        }
                    </div>}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Navbar))
