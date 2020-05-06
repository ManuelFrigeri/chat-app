const socket = io() // io function we can call to connect

// Elements

const $messageForm = document.querySelector('#message-form') // dolar sign so we that what we have is a variable from an element
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Get the height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMesssageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMesssageMargin // otherwise it doesn't take into consideration the margin
    // Visible height

    const visibleHeight = $messages.offsetHeight

    // Height of messages container

    const containerHeight = $messages.scrollHeight

    // How far down have I scroll

    const scrollOffset = $messages.scrollTop + visibleHeight // scrollTop ist the distance from the top

    if (containerHeight - newMessageHeight <= scrollOffset +1) {
        $messages.scrollTop = $messages.scrollHeight // if you would like to always scroll them to the bottom you would just need that
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text, // you could use the short sintax
        createdAt: moment(message.createdAt).format('k:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html) // it adds the html before the end
    autoscroll()
})

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('k:mm')
    })

    $messages.insertAdjacentHTML('beforebegin', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
const html = Mustache.render(sidebarTemplate, {
    room,
    users
})
document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault() //to present the default behaviour where the browser goes through a page refresh
   // here we desable the form
   $messageFormButton.setAttribute('disabled', 'disabled')
 
    const submittedText = e.target.elements.message.value // e.target is the object we are targeting - e its for event I am listening
       
    socket.emit('submitMessage', submittedText, (error) => {
        // here we reenable it again
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
            if (error) {
                return console.log(error)
            }
            console.log('The message was delivered')
        }) // is to acknowledge the event
})

$sendLocationButton.addEventListener('click', () => {
    
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((location) => {
       
    socket.emit('sendLocation', latitude = location.coords.latitude, longitude= location.coords.longitude, () => {
        $sendLocationButton.removeAttribute('disabled')
        console.log('the location was delivered')
    })
    })
})



socket.emit('join', { username, room}, (error) => {
    if (error) {
        alert(error)
        location.href= '/'
    }
})