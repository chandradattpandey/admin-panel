const jwt = require('jsonwebtoken');

function aut(req, res, next) {
    let token = req.cookies.name;

    jwt.verify(token, "chandra", (err, data) => {
        if (err) {
            res.render('login.html');
        }
        else {
            console.log(data);
            req.id = data.id;
            role = data.role;
            req.role = role;

            next();
        }
    })
}

function checkauth(req, res, next) {
    let role = req.role;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>:' + role);
    if (role == 'admin') {
        next()
    } else {
        res.render('auth.html');
    }
}


module.exports = {
    aut, checkauth
}