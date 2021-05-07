import { URL } from "./config";
import nodemailer from "nodemailer";
import _ from "lodash";
 


export class EmailFileDownload {
  constructor(app) {
    this.app = app;
  }

  sendDownloadLink(post, callback = () => {}) {
    const app = this.app;
    const email = app.email;
    const from = _.get(post, "from");
    const to = _.get(post, "to");
    const message = _.get(post, "message");

    let fromName = from.split("@");
    let toName =to.split('@')
    const files = _.get(post, "files", []);

    const postId = _.get(post, "_id");
    const downloadLink = `${URL}/share/${postId}`;
    // const fakeEmail ="287576deaf-5196ba@inbox.mailtrap.io"
    const mailOption = {
      from: `<${from}>`, // sender address
      to: `${toName[0]} ${to}`, // list of receivers
      subject: `${fromName[0]} is Sharing a ${
        files.length ? files.length : ""
      } ${files.length > 1 ? "files" : "file"} with You, It is Safe and Secure ✔`, // Subject line
      text: message, // plain text body
      html: `<p>Hi ${toName[0]},<br /><br /><b>${message}, <br /><br /> ${fromName[0]}</b> is Sharing a
            <b>${files.length ? files.length : ""}</b> 
            <b>${files.length > 1 ? "files" : "file"} with you.</b>, <br /><br />
            It is Safe and Secure ✔ Please download your ${files.length > 1 ? "files" : "file"} 
            <b><a href="${downloadLink}">Click Here</a></b>, <br><br><br><br>
            <b>Note:</b> It will expire after 30days</p><br><br>
            
            --Thanks in Advanced<br><br>
            ${fromName[0]}
            
            <h5>FileSharing App - powered by <a href="https://remote.com/profile/shaheb">Shaheb</a></h5>
            `, // html body
    };

    // send mail with defined transport object
    let info = email.sendMail(mailOption, (err, info) => {
      return callback(err, info);
    });
  }
}
