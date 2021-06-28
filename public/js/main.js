const numberInput = document.getElementById('number');
const textInput = document.getElementById('message');
const buttonInput = document.getElementById('button');
const response = document.querySelector('.response');

buttonInput.addEventListener('click', send);

const socket  = io();
socket.on('smsStatus', function(data) {
    response.innerHTML = `<h5>Text Message Send to ${data.number} </h5>`
});


function send(e) {
    e.preventDefault();
    const number = numberInput.value.replace(/\D/g, '');
    const text = textInput.value;

    fetch('/', {
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({number:number,text:text})
    }).then(function (res) {
        console.log(res);

    }).catch(err => console.log(err));
}