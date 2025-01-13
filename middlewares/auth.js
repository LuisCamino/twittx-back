const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../services/jwt");
const KEY = libjwt.KEY;

//auth
exports.auth = (req, res, next) => {

    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "request doesnt have auth header"
        }); 
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        let payload = jwt.decode(token, KEY);

        // Validación de la expiración del token
        console.log("Fecha de expiración:", payload.exp, "Fecha actual:", moment().unix());
        if(payload.exp <= moment().unix()){
            console.log("Expired token"); // Log si el token ya expiró
            return res.status(401).send({
                status: "Error",
                message: "Expired token"
            });
        }
        
        req.user = payload;
    } catch (error) {

        return res.status(404).send({
            status: "Error",
            message: "Invalid token"
        });
    }

    next();
}