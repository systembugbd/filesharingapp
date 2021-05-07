import React, {Component} from 'react'
import {history} from './../history'

class Header extends Component{
    render(){
        return(
            <div className={'app-header'}>

                <div className={'app-site-info'}>
                    <h1 onClick={()=>{
                        history.push('/')
                    }} className={'heading'}><i className={'icon-paper-plane'} /> SHARE</h1>
                    <div className={'site-title'}>SHARE YOUR FILE</div>
                    <div className={'site-moto'}>Share. Safe. Free</div>
                </div>

            </div>
        )
    }
}

export default Header