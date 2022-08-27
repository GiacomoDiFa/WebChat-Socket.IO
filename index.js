const express  = require('express');
const path = require("path");
const fs = require("fs");
const app = express();
const htpp = require('http');
const server = htpp.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.get('/',(req,res) => {
    res.sendFile(__dirname+'/index.html');
});

io.on('connection', (socket,room) => {
    socket.join(room);
    socket.on('new user',(arg,room) =>{
        socket.join(room);
        socket.to(room).emit('new user', "L'utente "+arg+" si è appena registrato alla chat: "+room);
        console.log("L'utente "+arg+" si è appena registrato alla chat: "+room);
    });
    socket.on('chat message', (msg,name,room) => {
        socket.join(room);
        socket.emit('chat message',name+": "+msg);
        socket.to(room).emit('chat message',name+": "+msg);
        console.log(name+": "+msg+room);
    });
    socket.on("upload", (room,file, name,callback) => {
        socket.join(room);
        console.log(file.toString('base64')); // <Buffer 25 50 44 ...>
        fs.writeFile("/tmp/upload", file.toString('base64'), (err) => {
            callback({ message: err ? "failure" : "success" });
        socket.emit('text-image',"L'utente "+name+" ha appena inviato un file");
        socket.emit('upload',file.toString('base64'));
        socket.to(room).emit('text-image',"L'utente "+name+" ha appena inviato un file");
        socket.to(room).emit('upload',file.toString('base64'));
        console.log(name+": "+room);
    });
    socket.on("text-image",(text)=>{
        socket.emit("text-image",text);
    })
  });
    });

server.listen(3000,() =>{
    console.log('In ascolto su *:3000');
});