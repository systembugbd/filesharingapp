export const createSMTPServer = {
  auth: {
    apiKey: "key-946e3e73276e9f68395c2c801782a453",
    domain: "sandboxd521c86cc909429fb93d964e6efe7f52.mailgun.org"
  }
};

const production = true;

export const URL = production ? 'https://sendingfiles.herokuapp.com/' : 'http://localhost:3001/';



  // export const URL = "http://localhost:3001"


//   const mailgun = require("mailgun-js");
// const DOMAIN = "sandboxd521c86cc909429fb93d964e6efe7f52.mailgun.org";
// const mg = mailgun({apiKey: "175bdd3496b5fdbd81552a7195cf15e3-b6190e87-66f91a88", domain: DOMAIN});
// const data = {
// 	from: "Mailgun Sandbox <postmaster@sandboxd521c86cc909429fb93d964e6efe7f52.mailgun.org> PASS: b98b09f2336ea69a9c1940807f5ce2ad-3d0809fb-0645488c | new PASS :f9aac809d052cbe90b8dcfaeaf592604-3d0809fb-18ca1e41",
// 	to: "wwwdonus@gmail.com",
// 	subject: "Hello",
// 	text: "Testing some Mailgun awesomness!"
// };
// mg.messages().send(data, function (error, body) {
// 	console.log(body);
// });

// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.