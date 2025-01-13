const jwt = require('jwt-simple')
const moment = require('moment')    

const KEY = "S39wasddasd43AS$sx234saxcbgrtf234"


const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()  
    };
    return jwt.encode(payload, KEY)
}

module.exports = {
    KEY,
    createToken
}