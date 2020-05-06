const generateMessage = (username , text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}


const generateLocationMessage = (username, message) => {
    return {
        username,
        url: message,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}