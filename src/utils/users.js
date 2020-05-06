const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
      return  {
            error: 'Username and room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username == username
    })

    //Validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    } 
    // Store user

        const user = {id, username, room}
        users.push(user) // it pushes the object to the arrey
        return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]// that is gonna return an array of all the items we removed - with that we access the first item [0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
    
}

const getUsersInRoom = (room) => {
return users.filter((user) => user.room === room)
}

addUser({
    id: 11, 
    username: "Manue", 
    room: 'ciao'
})


console.log(removeUser(11))
console.log(users)


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}