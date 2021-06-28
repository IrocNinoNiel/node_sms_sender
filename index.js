const express = require('express');
const ejs = require('ejs');
const Vonage = require('@vonage/server-sdk');
const socketio = require('socket.io');

const vonage = new Vonage({
    apiKey: "fee6ed49",
    apiSecret: "Yp6OORMFuZRs1wJs"
}, {debug: true});


const app = express();

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname+ '/public'));

app.use(express.urlencoded({extended: true})); 
app.use(express.json());


app.get('/', (req,res) => {
    res.render('index');
});

// Catch Form submit
app.post('/',(req,res) => {
    res.send(req.body);
    console.log(req.body);

    const from = 'vexmo';
    const to = req.body.number;
    const text = req.body.text;

    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
                // Get data from response to the client
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }
                // Emit to the client
                io.emit('smsStatus', data);

            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
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