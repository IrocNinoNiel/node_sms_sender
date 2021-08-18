const express = require('express');
const ejs = require('ejs');
// const Vonage = require('@vonage/server-sdk');
const socketio = require('socket.io');

// ClickSend API //
var api = require('./node_modules/clicksend/api.js');
var smsMessage = new api.SmsMessage();
// ClickSend API //

// const vonage = new Vonage({
//     apiKey: "fee6ed49",
//     apiSecret: "Yp6OORMFuZRs1wJs"
// }, {debug: true});


const app = express();

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname+ '/public'));

app.use(express.urlencoded({extended: true})); 
app.use(express.json());


app.get('/', (req,res) => {
    res.render('index');
});

// // Catch Form submit (vonage)
// app.post('/',(req,res) => {
//     res.send(req.body);
//     console.log(req.body);

//     const from = 'vexmo';
//     const to = req.body.number;
//     const text = req.body.text;

//     vonage.message.sendSms(from, to, text, (err, responseData) => {
//         if (err) {
//             console.log(err);
//         } else {
//             if(responseData.messages[0]['status'] === "0") {
//                 console.log("Message sent successfully.");
//                 // Get data from response to the client
//                 const data = {
//                     id: responseData.messages[0]['message-id'],
//                     number: responseData.messages[0]['to']
//                 }
//                 // Emit to the client
//                 io.emit('smsStatus', data);

//             } else {
//                 console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//             }
//         }
//     })
// })


// Catch Form submit (ClickSend)
app.post('/',(req,res) => {
    // res.send(req.body);
    // const text = req.body.text;
    

    smsMessage.from = "myNumber";
    smsMessage.to = "+639953856593";
    smsMessage.body = "test message";

    var smsApi = new api.SMSApi("useriroc123", "EA7F77EE-D258-EBA0-5B61-C374180BE13E");

    var smsCollection = new api.SmsMessageCollection();

    smsCollection.messages = [smsMessage];

    smsApi.smsSendPost(smsCollection).then(function(response) {
        console.log(response.body);
    }).catch(function(err){
        console.error(err.body);
    });


    // // User Info
    // var accountApi = new api.AccountApi("useriroc123", "EA7F77EE-D258-EBA0-5B61-C374180BE13E");
    // accountApi.accountGet().then(function(response) {
    //     console.log(response.body);
    //   }).catch(function(err){
    //     console.error(err.body);
    //   });
})


const PORT = 5000;

const server = app.listen(PORT, ()=> console.log(`Server started on PORT : ${PORT}`))



// Connect to socket.io
const io = socketio(server);
io.on('connection',(socket) => {
    console.log('Socket Connected');
    io.on('disconnect', () => {
        console.log('Socket Disconnected')
    })
});