const express = require('express')
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
var bodyParser = require('body-parser');
const app = express()
const http = require('http')
const { connect } = require('http2')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)
const port = 8000
const path = require('path');
const userList = {}


const seaBattle = require('./sea-battle')
console.log(seaBattle.gameBoard)

app.use('/js', express.static('./public/js/'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '/public')));

const RedisStore = connectRedis(session)


//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

//Configure session middleware
const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
})

app.use(sessionMiddleware)

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
})

app.get("/", (req, res) => {
    sess = req.session;
    if (sess.username && sess.password) {
        sess = req.session;
        if (sess.username) {
            res.sendFile(__dirname + '/public/index.html')
            //res.write(`<h1>Welcome ${sess.username} </h1><br>`)

            //res.write(
            //   `<h3>This is the Home page</h3>`
            //);
            //res.end('<a href=' + '/logout' + '>Click here to log out</a >')
        }
    } else {
        res.sendFile(__dirname + "/public/js/login.html")
    }
});

app.post("/login", (req, res) => {
    sess = req.session;
    sess.username = req.body.username
    sess.password = req.body.password
    // add username and password validation logic here if you want. If user is authenticated send the response as success
    res.end("success")
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect("/")
    });
});




io.on('connection', (socket) => {

    const sess = socket.request.session
    userList[socket.id] = sess.username
    userList[sess.username] = socket.id;
    io.emit('updateUserList', userList);


    socket.on('joinRequest', res => {
        console.log(res)
    })

    socket.on('chatMessage', msg => {
        // console.log(socket.id + ': ' + msg)
        io.emit('chatMessage', { 'userid': userList[socket.id], 'message': msg })
    })

    io.emit('newUserConnected', { userList })
    //io.emit('initGameBoard', { 'humanGameBoard': seaBattle.gameBoard.human, 'userid': userList[socket.id] })

    console.log('user connected ' + socket.id)
    socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected');
        //io.emit('removeData', { 'userid': socket.id })
        delete userList[socket.id]
    });

    console.log(userList)
})


server.listen(port, () => {
    console.log(`listening on port ${port}!`)

});

app.use('/js', express.static('./public/js/'))
