import React, {Component} from 'react'
import Header from '../component/header'
import Homeform from './../component/home-from'
import HomeUploading from './../component/home-uploading'
import HomeUploadSent from './../component/home-upload-sent'
import _ from 'lodash'

class Home extends Component{

    constructor(props){

        super(props);

        this.state = {
            componentName: 'Homeform',
            data:null,
            uploadEvent:null,
        }
        
        this._renderComponent = this._renderComponent.bind(this)
    }
    
    _renderComponent(){
        const {componentName, data, uploadEvent} = this.state

        switch(componentName){

            case 'HomeUploading':

                return <HomeUploading onCancellUpload={()=>{
                    this.setState({
                        data:null,
                        componentName:"HomeForm",
                        uploadEvent:null
                    })
                }} event={uploadEvent} data={data} />

            case 'HomeUploadSent':

                return (
                    <HomeUploadSent data={data} onSentAnotherFile={() => {
                        this.setState({
                            componentName: 'Homeform'
                        })
                    }} />
                )
            break;
            default:
                return  <Homeform 
                    onUploadEvent={(event) => {

                        let data = this.state.data
                        if(_.get(event, 'type') === 'success'){
                            data = _.get(event, 'payload')
                        }
                      
                        this.setState({
                            data:data,
                            uploadEvent: event,
                            componentName: (_.get(event, 'type')) === 'success' ? 'HomeUploadSent' : this.state.componentName
                        })
                    }}
                    onUploadBegin={(data) => {
                        this.setState({
                            data:data,
                            componentName:'HomeUploading'
                        })
                    // console.log('Event pass from Parent component', data)
                }} />
        }
    }


    render(){
        return (
            <div className={'app-container'}>
                <Header />
            <div className={'app-content'}>
               {
                   this._renderComponent()
               }
            </div>
       </div>
        )
    }
}   
export default Home