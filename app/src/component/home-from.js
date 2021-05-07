import React, { Component } from "react";
import _ from "lodash";
import Home from "../pages/home";
import upload from './../helpers/upload'
import PropTypes from 'prop-types'
const classNames = require('classnames')

class Homeform extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        files: [],
        to: "",
        from: "",
        message: "",
      },
      errors: {
        to: null,
        from: null,
        message: null,
        files:null
      },
    };

    //binding this to _onTextChange Method
    this._onTextChange = this._onTextChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._formValidation = this._formValidation.bind(this);
    this._onFileUploaded = this._onFileUploaded.bind(this);
    this._onFileRemove = this._onFileRemove.bind(this);
  }

  //On File Removed
  _onFileRemove(key) {
    const { files } = this.state.form;
    files.splice(key, 1);

    this.setState({
      form: {
        ...this.state.form,
        files: files,
      },
    });
  }

  
  //Email validations
  _isValidEmail(email) {
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return regex.test(email);
  }

  //From Validation
  _formValidation(fields = [], callback = () => {}) {
    let { form, errors } = this.state;

    const validations = {
      from: [
        {
          errorMessage: "From Email is required.",
          isValid: () => {
            return form.from.length;
          },
        },
        {
          errorMessage: "Email is not valid",
          isValid: () => {
            return this._isValidEmail(form.from);
          },
        },
      ],
      to: [
        {
          errorMessage: "To Email is required",
          isValid: () => {
            return form.to.length;
          },
        },
        {
          errorMessage: "Email is not valid",
          isValid: () => {
            return this._isValidEmail(form.to);
          },
        },
      ],
      files:[
        {
          errorMessage: "File is required",
          isValid:() =>{
            return  form.files.length
          },
        },
      ],
    }; //validation array Object END

    //Looping with all field for validation
    _.each(fields, (field) => {
      let fieldValidations = _.get(validations, field, []); //validations[field]

      errors[field] = null;

      _.each(fieldValidations, (fieldValidation) => {
        let isValid = fieldValidation.isValid();

        if (!isValid || isValid == 0) {
          errors[field] = fieldValidation.errorMessage;
        }
      });
    });

    this.setState(
      {
        errors: errors,
      },
      () => {
        let isValid = true;
        _.each(errors, (err) => {
          if (err != null) {
            isValid = false;
          }
        });
        return callback(isValid);
      }
    );
  }

  //On File Uploaded
  _onFileUploaded(event) {
    let files = _.get(this.state, "form.files", []);

    _.each(_.get(event, "target.files", []), (file, index) => {
      files.push(file);
    });

    this.setState({
      form: {
        ...this.state.form,
        files: files,
      },
    }, ()=>{
      this._formValidation(["files"], (isValid) =>{
        if(isValid ==0){
          console.log(this.state.errors)
        }
      })
    });
  }
  

  //On From Submit
  _onSubmit(e) {
    e.preventDefault();
    const { form } = this.state;
    this._formValidation(["from", "to", "files"],  (isValid) =>{
    
     
        // console.log("Is form Valid ? ", isValid);
     
        if(isValid){
          let data = this.state.form
          if(this.props.onUploadBegin){

              this.props.onUploadBegin(data)

          }

          upload(data, (event)=>{
           
            if(this.props.onUploadEvent){
              this.props.onUploadEvent(event)
            }
          })
        }
     
    });
  }

  _onTextChange(e) {
    let { form } = this.state;
    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    form[fieldName] = fieldValue;

    this.setState({
      form: form,
    });
  }

  render() {
    const { form, errors } = this.state;
    const { files } = form;

    return (
      <div className={"app-card"}>
        <form onSubmit={this._onSubmit}>
          <div className={"app-card-header"}>
            <div className={"app-card-header-inner"}>
              {files.length ? (
                <div className={"app-files-selected"}>
                  {files.map((file, index) => {
                    return (
                      <div key={index} className={"app-files-selected-item"}>
                        <div className={"filename"}>{file.name}</div>
                        <div className={"file-action"}>
                          <button
                            onClick={() => this._onFileRemove(index)}
                            className={"file-action-btn"}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className={classNames("app-file-select-zone", {'error':_.get(errors, 'files')})}>
                <label htmlFor={"input-file"}>
                  <input
                    onChange={this._onFileUploaded}
                    id={"input-file"}
                    type="file"
                    multiple={true}
                  />

                  {
                    files.length ? (
                      
                    <span className={"app-upload-description text-uppercase"}>
                    <span className={"app-upload-icon icon-picture-streamline-multi"} />
                    Add More Files 
                    <div className={"total-files-count"}> Total Files : {files.length}</div></span>
                  ) : (
                    <span>
                      <span className={"app-upload-icon icon-picture-streamline"} />
                      <span className={"app-upload-description"}>
                        Files Drag and Drop here
                      </span>
                     
                    </span>
                  )
                }
                </label>
              </div>
            </div>
          </div>
          <div className={"app-card-content"}>
            <div className={"app-card-content-inner"}>
              <div className={classNames("app-form-item", {'error':_.get(errors, 'to')})}>
                <label htmlFor={"to"}>
                  <span className={"label-title"}> SEND TO </span>
                  <input
                    onChange={this._onTextChange}
                    value={form.to}
                    id={"to"}
                    name={"to"}
                    type={"text"}
                    placeholder={_.get(errors, 'to') ? _.get(errors, 'to'): "Email Address To"}
                  />
                </label>
              </div>

              <div className={classNames("app-form-item", {'error':_.get(errors, 'from')})}>
                <label htmlFor={"from"}>
                  <span className={"label-title"}> SENT FORM </span>
                  <input
                    onChange={this._onTextChange}
                    value={form.from}
                    id={"from"}
                    name={"from"}
                    type={"text"}
                    placeholder={_.get(errors, 'from') ? _.get(errors, 'from'): "Email Address From"}
                  />
                </label>
              </div>

              <div className={"app-form-item"}>
                <label htmlFor={"message"}>
                  <span className={"label-title"}> NOTE(Optional) </span>
                  <textarea
                    onChange={this._onTextChange}
                    value={form.message}
                    id={"message"}
                    name={"message"}
                    placeholder={"Note, if any (Optional)"}
                  ></textarea>
                </label>
              </div>

              <div className={"app-form-item"}>
                <button type={"submit"} id={"sendBtn"} className={"submit"}>
                  SEND
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Homeform.propTypes = {
  onUploadBegin: PropTypes.func,
  onUploadEvent: PropTypes.func
}

export default Homeform;
