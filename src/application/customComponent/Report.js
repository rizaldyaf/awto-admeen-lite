import React, { Component } from 'react'
import {withStyles} from "@material-ui/core"
import DateTime from 'core/components/inputs/DateTime'
import Number from 'core/components/inputs/Number'
import Button from "core/components/Button"
import DownloadIcon from "@material-ui/icons/CloudDownloadOutlined"
import companyLogo from "assets/dsp_icon.png"
import {exportComponentAsPDF} from "react-component-export-image"
import firebase from "firebase"
import appConfig from "firebase"
import moment from "moment"

class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            records:[],
            filters:{},
            shadow:true
        }
        if (firebase.apps.length === 0) {
            firebase.initializeApp(appConfig.firebase)
        }
        this.paper = React.createRef()
        this.db = firebase.firestore()
    }


    componentDidMount(){
        this.refreshData()
    }

    refreshData = () => {
        let query = this.db.collection(this.props.route.model)

        query.get().then((response)=>{
            let newRecords = []
            response.forEach((doc) => {
                let data = doc.data()
                data.id = doc.id
                data.snapshot = doc
                newRecords.push(data)
            })

            if (this.state.filters.dateStart && this.state.filters.dateEnd) {
                newRecords = newRecords.filter((record)=>{
                    if (record.tanggal) {
                        if (moment(record.tanggal).unix() >= moment(this.state.filters.dateStart).unix() && moment(record.tanggal).unix() <= moment(this.state.filters.dateEnd).unix()) {
                            return true
                        }
                    }
                    return false
                })
            }

            if (this.state.filters.limit) {
                newRecords = newRecords.slice(0, this.state.filters.limit)
            }

            this.setState({
                isLoading:false,
                records:newRecords,
            })
        }).catch((error)=>{
            this.setState({
                isLoading:false,
                isError:true
            })
            console.error(error)
        })
    }

    handleExport = () => {
        this.toggleShadow()
        exportComponentAsPDF(this.paper, {
			fileName:"Lap Keuangan",
			pdfOptions:{
                w: 21,
                h:29.7,
                unit:"cm",
            },
		}).then(()=>{
            console.log("PDF download complete")
            this.toggleShadow()
        }).catch(error=>{   
            console.error("Failed to download PDF", error)
        })
    }

    toggleShadow = () => {
        this.setState({
            shadow:!this.state.shadow
        })
    }

    handleInputChange = (field, value) => {
        this.setState({
            filters:{
                ...this.state.filters,
                [field]:value
            }
        },()=>{
            this.refreshData()
        })
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.container}>
                <div className={classes.paper} ref={this.paper} style={{
                    boxShadow:this.state.shadow?"5px 5px 20px rgba(0,0,0,0.2)":"0px 0px 0px rgba(0,0,0,0)"
                }}>
                    <div className="heading">
                        <img src={companyLogo} alt="company" style={{width:'100px', height:'auto'}}/>
                        <div style={{flexGrow:"1"}}>
                            <span style={{fontSize:"14pt", fontWeight:'bold'}}><b>Your Company</b></span>
                            <div>
                            Baker Street, 101-B, London, England, United Kingdom
                            </div>
                        </div>
                    </div>
                    <div style={{fontWeight:"bold", textDecoration:"underline", textAlign:'center', width:'100%', margin:'10px 0px'}}>
                        Laporan Keuangan
                    </div>
                    <div>
                        <div>Dari Tanggal : {this.state.filters.dateStart?moment(this.state.filters.dateStart).format("d/M/Y h:m:s"):"-"}</div>
                        <div>Sampai Tanggal : {this.state.filters.dateEnd?moment(this.state.filters.dateEnd).format("d/M/Y h:m:s"):"-"}</div>
                    </div>
                    <table border="1px" classname="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Tanggal</th>
                                <th>Nomor Pembayaran</th>
                                <th>Tipe</th>
                                <th>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.records.map((record, index)=><tr key={index}>
                                <td>{index+1}</td>
                                <td>{moment(record.tanggal).format("d-MM-yyyy hh:mm")}</td>
                                <td>{record.nomor}</td>
                                <td>{record.tipe}</td>
                                <td>Rp. {record.total?record.total.toLocaleString("en-US"):0}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className={classes.toolbar}>
                    <div className="inputContainer">
                        <DateTime
                            field="dateStart"
                            label="From"
                            value={this.state.filters.dateStart}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="inputContainer">
                        <DateTime
                            field="dateEnd"
                            label="To"
                            value={this.state.filters.dateEnd}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="inputContainer">
                        <Number
                            field="limit"
                            label="Record Limit"
                            value={this.state.filters.limit}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="buttonContainer">
                        <Button color="primary" onClick={()=>this.handleExport()}>
                            <DownloadIcon style={{marginRight:'10px'}}/>Save PDF
                        </Button>
                    </div>
                    
                </div>
            </div>
        )
    }
}

const styles = {
    container:{
        paddingLeft:"300px",
        paddingTop:"50px",
        maxHeight:"calc(100vh - 50px)",
        overflowY:"auto",
        overflowX:"hidden",
        display:'flex',
        justifyContent:"center"
    },
    paper:{
        width:"21cm",
        height:"29.7cm",
        backgroundColor:"#fff",
        padding:"2cm",
        marginBottom:"50px",
        fontFamily:"serif",
        "&>.heading":{
            position:"relative",
            display:'flex',
            alignItems:"center",
            justifyContent:"center",
            textAlign:'center',
            padding:"10px 0px",
            width:'100%',
            borderBottom:"1px solid #000",
            "&:after":{
                position:"absolute",
                bottom:"1px",
                content:"''",
                width:'100%',
                borderBottom:'2px solid #000'
            }
        },
        "&>table":{
            marginTop:'20px',
            borderCollapse:"collapse",
            width:"100%"
        }
    },
    toolbar:{
        boxSizing:"borderBox",
        position:"fixed",
        display:'flex',
        alignItems:"flex-end",
        marginLeft:"300px",
        marginBottom:"20px",
        width:'calc(100% - 380px)',
        zIndex:'50',
        backgroundColor:"rgba(255,255,255,0.7)",
        boxShadow:"5px 5px 20px rgba(0,0,0,0.2)",
        borderRadius:"10px",
        backdropFilter:"blur(20px)",
        bottom:"0px",
        padding:"10px",
        left:"0",
        "&>.inputContainer":{
            marginRight:"10px",
            maxWidth:"200px"
        },
        "&>.buttonContainer":{
            flexGrow:'1',
            display:'flex',
            justifyContent:'flex-end',
            paddingBottom:'16px',
        }
    }
}

export default withStyles(styles)(Report)