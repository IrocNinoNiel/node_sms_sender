const express = require('express');
const ejs = require('ejs');
// const Vonage = require('@vonage/server-sdk');
const socketio = require('socket.io');

// ClickSend API //
var api = require('./node_modules/clicksend/api.js');
var smsMessage = new api.SmsMessage();

// Serial port gsm
const serialportgsm = require('serialport-gsm')
const modem = serialportgsm.Modem()

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


// Catch Form submit (ClickSend) Send using gsm module

const options = {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    rtscts: false,
    xon: false,
    xoff: false,
    xany: false,
    autoDeleteOnReceive: false,
    enableConcatenation: true,
    incomingCallIndication: true,
    incomingSMSIndication: true,
    pin: '',
    customInitCommand: '',
    logger: console
}

modem.open('COM4', options, (data)=>{console.log(data)});
modem.on('open', data => {	
    console.log(data);

    // Initialize the modem
// 639546282971
})


app.post('/',(req,res) => {
    modem.initializeModem((data)=>{
        console.log('Modem is Initialized');
        
        const to = req.body.number;
        const text = req.body.text;
        // Send Messages
        modem.sendSMS(to, text, false, (data)=>{
            console.log(data);
        })

    })
    // const to = req.body.number;
    // const text = req.body.text;
    // // Send Messages
    // modem.sendSMS(to, text, false, (data)=>{
    //     console.log(data);
    // })
	

    modem.on('onSendingMessage', result => { 
        console.log(result);
     })

    
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

// // On Recieving new Message
// modem.open('COM4', options, (data)=>{console.log('aa')});
modem.on('onNewMessage', messageDetails => {
    console.log(messageDetails)
    console.log(messageDetails.sender);

    // Replying to message when recieve a new message
    modem.initializeModem((data)=>{
        console.log('Modem is Initialized');
    
        modem.sendSMS(messageDetails.sender, `Is this your message? ${messageDetails.message}`, false, (data)=>{
            console.log(data);
        })

    })
})