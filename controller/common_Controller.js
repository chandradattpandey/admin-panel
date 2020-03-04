const userSchema = require('../model/user');
const generator = require('generate-password');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

module.exports = {
    register,
    login,
    adminRegister_save,
    adminLogin,
    user_page,
    subadmin_page,
    user_save,
    subadmin_save,
    viewsubadmin,
    viewuser,
    deletedata,
    modify,
    modify_save,
    forgotpass,
    forgot,
    forgotpage
}


function register(req, res) {
    res.render('register.html');
}


function adminRegister_save(req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;
    let pass = req.body.password;
    console.log(name);
    console.log(age);
    console.log(email);
    console.log(pass);

    let user = new userSchema({ 'name': name, 'age': age, 'email': email, 'password': pass })
    user.save((err) => {
        if (err) {
            res.json(err);
        } else {
            res.render('login.html');
        }
    });
}

function login(req, res) {
    res.render('index.html');
}

function adminLogin(req, res) {
    let email = req.body.email;
    let pass = req.body.password;
    console.log(email);
    console.log(pass);
    userSchema.findOne({ 'email': email, }, function (err, data) {
        if (err) {
            console.log(err);
        } else if (data == null) {
            console.log('wrong password');
            res.render('login.html');
        } else {
            let role = data.role;
            if ((role == 'admin') || (role == 'subadmin')) {
                data.comparePassword(pass, function (err, isMatch) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Password', isMatch);
                        if (isMatch == 'false') {
                            res.render('login.html');
                        } else {
                            let token = tokenGenerate(data.id, data.role);

                            res.cookie('name', token).render('index.html')

                        }
                    }
                });
            } else {
                res.render('login.html');
            }
        }

    });
}


function tokenGenerate(id, role, res) {
    let token = jwt.sign({ 'id': id, 'role': role }, "chandra", { expiresIn: '60m' })
    console.log(token)
    return token;

}
function user_page(req, res) {
    res.render('user_page.html')
}

function user_save(req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;

    console.log(name);
    console.log(age);
    console.log(email);

    let password = generator.generate({
        length: 10,
    });
    console.log(password);
    let user = new userSchema({ 'name': name, 'age': age, 'email': email, 'password': password, 'role': 'user' })
    user.save((err) => {
        if (err) {
            res.json(err);
        } else {
            sendmail(email, password)
            res.render('index.html');
        }

    })
}

function subadmin_page(req, res) {
    res.render('subadmin_page.html');
}


function subadmin_save(req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;

    console.log(name);
    console.log(age);
    console.log(email);

    let password = generator.generate({
        length: 10
    });
    console.log(password);
    let user = new userSchema({ 'name': name, 'age': age, 'email': email, 'password': password, 'role': 'subadmin' })
    user.save((err) => {
        if (err) {
            console.log(err);
        } else {
            sendmail(email, password)
            res.render('index.html');

        }
    })
}


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'munjal.chirag.test@gmail.com',
        pass: '7500598665'
    }
});

console.log('created');

function sendmail(email, password, req, res) {
    let mailOptions = {
        from: 'munjal.chirag.test@gmail.com',
        to: email,
        subject: 'register',
        html: 'thanku for your registration !!' + email + 'password  :'+ password
    };
    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            console.log(error);

        } else {
            console.log('Email sent: ' + info.response);

        }

    });


}

function viewsubadmin(req, res) {
    userSchema.find({ 'role': 'subadmin' }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            juser = data;
            console.log(data);
            res.render('action.html', { juser })
        }
    })
}

function viewuser(req, res) {
    userSchema.find({ 'role': 'user' }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            juser = data;
            console.log(data);
            res.render('action.html', { juser })
        }
    })
}


function deletedata(req, res) {
    let id = req.params.id;
    console.log(id);
    userSchema.findOneAndUpdate({ '_id': id }, { $set: { 'is_deleted': 'true' } }, (err, data) => {
        if (err) {

        }
        else {
            res.redirect('/viewsubAdmin');
        }
    })
}

function modify(req, res) {
    let id = req.params.id;
    console.log(id);
    userSchema.findOne({ '_id': id }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let name = data.name;
            let age = data.age;
            let email = data.email;
            let is_deleted = data.is_deleted;
            let id = data.id;
            res.render('modify.html', { name, age, email, is_deleted, id });
        }
    })
}

function modify_save(req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let age = req.body.age;
    let is_deleted = req.body.is_deleted;
    console.log(id);
    userSchema.findByIdAndUpdate({ '_id': id }, { $set: { 'name': name, 'age': age, 'is_deleted': is_deleted } }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/viewsubAdmin');
        }
    })
}

function forgotpage(req,res){
    res.render('forgot.html');
}

function forgotpass(req,res){
    let email = req.body.email;
    console.log(email);
    let newpass = req.newpass;
    console.log(newpass);
    let pass = req.pass;
    console.log(pass);
    userSchema.findOneAndUpdate({'email':email }, { $set: { 'password': newpass} },(err)=>{
        if(err){
            console.log(err);
        }else{
            sendmail(email,pass)
            res.render('login.html');
        }
    })
}







function forgot(req, res, next) {
    let password = generator.generate({
        length: 10
    })
    console.log(password);
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);


        bcrypt.hash(password, salt, function (err, hash) {
            if (err) return next(err);
            newpass = hash;
            req.newpass =newpass;
            
            req.pass = password;
            next()
        })
    })
}