import _ from 'lodash'

const KB = 1024
const MB = KB * KB
const TB = KB * KB * KB

 const betterNumber =(input, round = true)=>{

    if(input > KB){
        return round ? `${_.round(input/KB)} KB` :  `${(input/KB)} KB`
    }else if(input >MB){
        return round ? `${_.round(input/MB)} MB` : `${(input/MB)} MB`
    }else if(input >TB){
        return round ? `${_.round(input/TB)} TB` : `${(input/TB)} TB`
    }else{
        return round ? `${_.round(input)} Byte` : `${(input)} Byte`
    }
}

export default betterNumber;