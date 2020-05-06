const express = require('express')
const http = require('http') // we need it to create a server
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app) // to use socket - we created the server outside the express library
const socketio = require('socket.io')
const io = socketio(server) // we configure websocket to work with out server
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public') // è una scorciatoia ma avresti potuto scrivere tutto il path senza la funzione path

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => { // connect and disconect are alredy in the socket.io library
        console.log('New websocket connection')
        socket.on('join', ({ username, room}, callback) => {
        const {error, user } = addUser({id: socket.id, username, room}) 


            if (error) {
                return callback(error)
            }
        socket.join(user.room)

        socket.emit('message', generateMessage('admin','Welcome'))
            console.log(user)
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', user.username + ' has joined')) 
           
        io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInRoom(user.room)
            })

        callback() // calling the callback without arguments means calling it without an error
    })
    socket.on('submitMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })



    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin',user.username + ' has left'))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInRoom(user.room)
        })      
        }
    })

    socket.on('sendLocation', (latitude, longitude, callback ) => {
        const user = getUser(socket.id)
       io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,'https://www.google.com/maps/?q=' +latitude+','+longitude))  
       callback()   
    })
}) // we are listening for a given event  to occur



server.listen(port, () => {
    console.log('server is up and running on port: ' +port)
})

























// to send messages we have:
//socket.emit, io.emit, socket.broadcast.emit
// io.to.emit, socket.broadcast.to.emit















    // socket.emit('countUpdated', count) // we are sending and receiving event - count is like a result of a callback function
    // socket.on('increment', () => {
    //     count++
    //    io.emit('countUpdated', count) //io emits the event to every single connection
    // }) // socket.on is to listen and socket.emit is to send it