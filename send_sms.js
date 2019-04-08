// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC523650b69d58e42965099ad0082127cf';
const authToken = '2ad9793f2d94cea3d2318af5f2374901';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Hi Maria!  Hope you\'re having an awesome morning!  Isn\'t it cool to get a text from the VMC app??? or what!!',
     from: '+14084146081',
     to: '+19256399902'
   })
  .then(message => console.log("000 send_sms.js client.msgs.  msg.sid = ",message.sid));