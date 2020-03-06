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
    forgotpage,
    logout,
    changepass,
    subadminchange,
    subadminpass,
    adminchangepass,
    resetpass,saveresetpass,submitresetpass
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
                        if (!isMatch) {
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

function sendmail(email, password) {
    let mailOptions = {
        from: 'munjal.chirag.test@gmail.com',
        to: email,
        subject: 'register',
        html: 'thanku for your registration !!' + email + 'password  :' + password
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
            let role = data.role;
            if (role == 'subadmin') {
                res.redirect('/viewsubAdmin');
            } else {
                res.redirect('/viewuser')
            }
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

            let role = data.role;
            if (role == 'subadmin') {
                res.redirect('/viewsubAdmin');
            } else {
                res.redirect('/viewuser');
            }
        }
    })
}

function forgotpage(req, res) {
    res.render('forgot.html');
}

function forgot(req, res, next) {
    let password = generator.generate({
        length: 10
    })
            req.pass = password;
            next()
}
function forgotpass(req, res) {
    let email = req.body.email;
    let newpass = req.pass;
    console.log(email);
    userSchema.findOne({ 'email': email }, (err,result) => {
        console.log(result);
        let role = result.role;
        console.log(role);
        if (err) {
            console.log(err);
        }
         else if(role == 'admin' || role =='user') {
             result.password=newpass;
             sendmail(email, newpass);
             result.save((err)=>{
                 if(err){
                     console.log(err);
                 }
                 else{
                    
                    res.render('login.html');
                 }
             })
        }else{
            res.render('auth.html');
        }
    })
}









function logout(req, res) {
    res.clearCookie('name').redirect('/');
}




function changepass(req, res) {
    res.render('adminchangepass.html');
}


function adminchangepass(req, res) {
    
    let email = req.body.email;
    console.log(email);
    let oldpass = req.body.oldpass;
    console.log(oldpass);
    let cryppass = req.hashpass;
    console.log(cryppass);
    let newpass = req.body.newpass;
    console.log(newpass);

    userSchema.findOne({'email':email},function(err,result){
        if(err){
            console.log(err)
        }
        else{
            result.comparePassword(oldpass,function(err,isMatch){
                if(err){
                    console.log(err)
                }
               else if(isMatch){
                    result.password=newpass;
                    result.save(function(err){
                        if(err){
                            console.log(err)
                        }
                        else{
                            res.redirect('/')
                        }
                    })
                }
                else{
                    res.json("Wrong Old Password")
                }
            })
        }
    })
}

function subadminchange(req, res,) {
    let id=req.params.id;
    res.render('subadminpass.html',{id})
}



function subadminpass(req,res){
    let id = req.body.id;
    let pass = req.body.newpass;
    console.log("find",id,pass)
    userSchema.findOne({'_id':id},(err,data)=>{
        if(err){
            console.log(err);
        }else {
            data.password=pass;
            data.save(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/')
                }
            })
        }
    })
}

function resetpass(req, res){
    let email = req.body.email;
    console.log(email);

    userSchema.findOne({'email':email},(err,result)=>{
        if(err){
            console.log(err);
        }
        else if(result == null){
            res.json("please enter register email");

        }
        else if(result.role == 'subadmin'){
            res.json('request admin to change the password');
        }else{
            let id= result.id;
            let role="resetpass";
            jwt.sign({ 'id': id, 'role': role }, "chandra", { expiresIn: '60m' },function(err,token){
                if(err){}
                else{
                    var mailOptions={
                        from : 'munjal.chirag.test@gmail.com',
                        to : email,
                        subject : 'register',
                        html :'<p>Click <a href = "https://sdirect-chandra.herokuapp.com/recover/'+token+'">clickhear</a>to reset your password </p>'

                    }
                    transporter.sendMail(mailOptions,function(err,info){
                            if(err){
                                res.json("Internal Error")
                            }
                            else{
                                result.resetCheck=token;
                                result.save((err)=>{
                                    if(err){
                                        res.json("Error")
                                    }
                                    else{
                                        res.redirect('/');
                                    }
                                })
                            }
                    })
                }
            });
            
        }
    })
}






function saveresetpass(req,res){
    let token=req.params.id;
    jwt.verify(token,"chandra",(err,decode)=>{
        if(err){
            res.json("Invalid Token");
        }
        else{
            let id =decode.id;
            let role=decode.role;
            
            if(role == 'resetpass'){
                    
                    userSchema.findOne({'_id':id,'resetCheck':token},(err,data)=>{
                        if(err){
                            res.json("Error")
                        }
                        else if(data == null){
                            res.redirect('/')

                        }
                        else{
                            let email=data.email;
                            res.render('resetpass.html',{id,email,token});
                        }

                    })
            }
            else{
                res.json("Invalid")
            }
        }
    })
}


function submitresetpass(req,res){
    let id=req.body.id;
    let pass=req.body.password;
    let token=req.body.token;
    userSchema.findOne({'_id':id},function(err,user){
        if(err){}
        else if(user == null){}
        else{
            user.password=pass;
            user.resetLink=undefined;
            user.save((err)=>{
                if(err){}
                else{
                    res.redirect('/');
                }
            })
        }
    })
}



