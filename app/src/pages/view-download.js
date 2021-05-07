import React, {Component} from 'react'
import Header from './../component/header'
import {getDownloadInfo} from './../helpers/download'
import {apiUrl} from './../config'
import betterNumber from './../helpers'
import _ from 'lodash'

class ViewDownload extends Component{

constructor(props){
super(props)
this.state = {
    post:null
}
this.getTotalDownloadSize = this.getTotalDownloadSize.bind(this)
}

componentWillMount(){
const {match} = this.props
const postId = _.get(match, 'params.id')

getDownloadInfo(postId).then((response)=>{
    console.log('Geting data from server as per id', response)
    this.setState({
        post: _.get(response, 'data')
    })
    
}).catch((err)=>{
    console.log('An error occored during fatching data', err.mesage) // we will redirect when it sready to 404 not found page
})
}
getTotalDownloadSize(){
const { post } = this.state
let total = 0
let files = _.get(post, 'files', [])

_.each(files, (file)=>{
    total += _.get(file, 'size', 0)
})
return betterNumber(total)
}
render(){
const { post } = this.state
const files = _.get(post, 'files', [])
const totalSize = this.getTotalDownloadSize()
const postId = _.get(post, '_id')
    
return(
    <div className={'app-container'}>
    <Header />
        <div className={'app-content'}>
        
                <div className={"app-card"}>
                
                <div className={"app-card-content downloading"}>
                <div className={"app-card-content-inner"}>

                <div className={"app-home-download-icon"}>
                        <i className={"icon-download"}/>
                        <h2>Ready to dwonload...</h2>
                    
                    </div>
                    <div className={"app-home-download-message"}>
                        <div className={"app-download-file-info"}>
                            <ul>
                                <li>{
                                    files.length> 1 ? `${files.length} Files` : `${files.length} File`
                                }</li>
                                <li>{ totalSize }</li>
                                <li>Expire in 30Days</li>
                            </ul>
                        </div>
                    </div>

                    <div className={"app-home-download-file-list"}>
                    {
                        files.map((file, index) =>{
                            return (
                                <div key={index} className={"app-download-file-item"}>
                                    <span className={"item-name"}>{_.get(file, 'originalName')}</span>
                                    <span className={"download-action"}><a href={`${apiUrl}/download/${_.get(file, '_id')}`}><i className={"icon-download item-download"}/></a></span>
                                </div>
                            )
                        })
                    }
                        
                            

                    </div>

                    
                    
                    <div className={"app-home-download-action"}>
                    <button type={"button"} id={"viewFiles"} className={"viewFiles"}>
                            <a href={`${apiUrl}/posts/${postId}/download`}>Download All Files in ZIP</a>
                    </button>

                    <button type={"button"} id={"sentBtn"} className={"sentBtn"}>
                        Share
                    </button>
                    </div>

                    </div>
                    </div>
                    
                    
            </div>
        </div>

    </div>
)
}
}

export default ViewDownload