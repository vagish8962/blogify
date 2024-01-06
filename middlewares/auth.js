const { validateToken } = require("../service/auth");

const checkforAuthCookie = function(cookieName) {
    return (req, res, next)  => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            next();
        }
        try {
            const user  = validateToken(tokenCookieValue);
            req.user = user;

        } catch(err) {

        }
        next();
    }
}

module.exports = {
    checkforAuthCookie: checkforAuthCookie
}