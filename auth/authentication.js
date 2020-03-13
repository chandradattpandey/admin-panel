const jwt = require('jsonwebtoken');
const userSchema = require('../model/user');


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
            userSchema.findOne({'_id':data.id},function(err,result){
                if(err){
                    console.log(err);
                }else{
                    console.log(result)
                    req.pro = result.profilepic;
                    req.name = result.name;
                    next();
                }
            })
           
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