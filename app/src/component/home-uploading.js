import React, {Component} from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import betterNumber from './../helpers'
let totalTime = 0
class Uploading extends Component{

    constructor(props){
      super(props)
     
      this.state=({
        startTime: new Date(),
        lastLoadedTime:0,
        data:null,        
        loaded:0,
        total:0,
        speedPerSecond: 0,
        totalTimeToUploadSec:0, 
        percentage:0,  
       
       
            
      })

    }

    componentDidMount(){
      const {data} = this.props

      this.setState({
        data:data
      })
    }
  
    componentWillReceiveProps(nextProps){
      const {event} = nextProps
      console.log('Get an Event from of Uploading...', event)

      switch(_.get(event, 'type')){

        case "onUploadProgress":

          let loaded = _.get(event, 'payload.loaded')
          let total = _.get(event, 'payload.total')
          let timeStamp = _.get(event, 'payload.timeStamp')
          let percentage = total !== 0 ? (loaded / total) * 100 : 0
         
          const currentTime = new Date()
          let diffBetStartAndCurrentTime = currentTime - this.state.startTime  //this is milisecond 
          totalTime += diffBetStartAndCurrentTime 

          if(diffBetStartAndCurrentTime === 0 ){
            diffBetStartAndCurrentTime = 1
          }

          const speedPerOneMilisecond = ((loaded-this.state.lastLoadedTime) / diffBetStartAndCurrentTime)
          const speedPerSecond = speedPerOneMilisecond * 1000



          this.setState({
            startTime:currentTime,
            lastLoadedTime:loaded,
            loaded:loaded,
            total:total,
            percentage: percentage,
            speedPerSecond: speedPerSecond,
            totalTimeToUploadSec : totalTime  / 1000

          })

          break;

        default:

          break;  
      }
       

    }

    render(){
      const {percentage, data, total, loaded, speedPerSecond, totalTimeToUploadSec} = this.state
      const uploadingTotalFile =_.get(data, 'files', []).length

       
    

        return(
            <div className={"app-card"}>
        
              <div className={"app-card-content uploading"}>
                <div className={"app-card-content-inner"}>
               
                  <div className={"app-home-uploading-icon"}><i className={"icon-upload"}/><h2>Uploading...</h2></div>
                  <div className={"app-home-uploading-total"}>Total {uploadingTotalFile>1 ? `${uploadingTotalFile} files are`:`${uploadingTotalFile} file is`} uploading...</div>
                  <div className={"app-home-uploading-progress"}>
                      <span style={{width: `${percentage}%`}} className={"app-home-progress-bar"}></span>
                  </div>
                  <div className={"app-home-uploading-state"}>
                    <span className={"app-home-uploading-state-size"}>{betterNumber(loaded)} / {betterNumber(total)} </span>
                    <span className={"app-home-uploading-state-time"}>{betterNumber(speedPerSecond)}/s in {totalTimeToUploadSec}s</span>
                  
                  </div>
                  <div className={"app-home-uploading-action"}>
                  <button onClick={()=>{
                    if(this.props.onCancellUpload){
                      this.props.onCancellUpload(true)
                    }
                  }} type={"button"} id={"cancelBtn"} className={"cancel"}>
                  Cancel
                </button>
                  </div>
                </div>
              </div>
        
            </div>
        )
    }
    
}

Uploading.propTypes = {
  
    data : PropTypes.object,
    onCancellUpload: PropTypes.func
  
}
export default Uploading