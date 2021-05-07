import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {history} from './../history'
import _ from 'lodash'

class HomeUploadSent extends Component{
    constructor(props){
        super(props)
    }

    render() {
        const {data } = this.props
        const postId = _.get(data, '_id')
        const to = _.get(data, 'to')
     
        return(
            <div className={"app-card"}>
        
              <div className={"app-card-content app-card-upload-sent"}>
                <div className={"app-card-content-inner"}>
               
                  <div className={"app-home-uploading-sent-icon"}>
                    <i className={"icon-paper-plane"}/>
                    <h2>File Sent...</h2>
                   
                  </div>
                  <div className={"app-home-upload-sent-message"}><p>We have sent en email to {to}, with the download link, This will expire after 30days</p></div>
                
                 
                  <div className={"app-home-sent-action"}>
                  <button onClick={() =>{
                    history.push(`/share/${postId}`)
                  }} type={"button"} id={"viewFiles"} className={"viewFiles"}>
                   View Files
                  </button>

                  <button onClick={(event)=>{
                    if(this.props.onSentAnotherFile){
                        this.props.onSentAnotherFile(true)
                    }
                  }} type={"button"} id={"sentBtn"} className={"sentBtn"}>
                    Sent Another File
                </button>
                  </div>
                </div>
              </div>
        
            </div>
        )
    }
}
HomeUploadSent.propType = {
    data: PropTypes.object,
    onSentAnotherFile: PropTypes.func
}
export default HomeUploadSent