import archiver from 'archiver'
import path from 'path'
import _ from 'lodash'


export default class FilesArchiver{

    constructor(app, id, files=[], response){
        this.app = app
        this.files = files
        this.response = response
        this.id= id
    }

    download(){
        const app = this.app
        const id= this.id
        const files = this.files
        const response = this.response
        const uploadDir = app.get('storageDir')
        const zip = archiver('zip')
        
        response.attachment(`S_A_Download_${id}.zip`)
        zip.pipe(response)

        _.each(files, (file)=>{
            const filePath = path.join(uploadDir, _.get(file, 'name'))
            zip.file(filePath, {name: _.get(file, 'name')})
        })

        zip.finalize()

        return this
    }
}