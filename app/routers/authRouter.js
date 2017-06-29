var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var events = require('events');
var eventEmitter = new events.EventEmitter();
//import database file
var config = require('../../config/database');
var User = require('../models/user');
var Session = require('../models/session');
var request = require('request');

/////////////////////////////Log in first//////////////////////////////////////
router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //to check the request before response to client 
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Failed to authenticate token' });
            }
            else {
                //if token verify the system will decoded and send the response back to client
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        res.json({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.post('/userinfo', function (req, res) {
    var response = {};
    Session.findOne({ 'token': req.body.token }, function (err, result) {
        if (err) {
            response = err;
            console.log(err);
            res.json(response);
        } else {
            if (result == null) {
                response = ({ success: false, message: 'Token already expired.' });
                res.json(response);
            }
            else {
                console.log(result);
                res.json(result);
            }
        }
    });
});

router.post('/updateUser/:birthday', function (req, res) {
    var token = req.body.token;
    var response = {};
    var birthday = req.params.birthday;
    birthday = birthday.split('-');
    var day = parseInt(birthday[2]);
    var month = parseInt(birthday[1]);
    var sign;
    if (month === 12 && day >= 15 || month === 1 && day <= 14) {
        sign = "sagittarius";
    }
    else if (month === 1 && day >= 15 || month === 2 && day <= 14) {
        sign = "capricorn";
    }
    else if (month === 2 && day >= 15 || month === 3 && day <= 14) {
        sign = "aquarius"
    }
    else if (month === 3 && day >= 15 || month === 4 && day <= 14) {
        sign = "pisces";
    }
    else if (month === 4 && day >= 15 || month === 5 && day <= 14) {
        sign = "aries";
    }
    else if (month === 5 && day >= 15 || month === 6 && day <= 14) {
        sign = "taurus";
    }
    else if (month === 6 && day >= 15 || month === 7 && day <= 14) {
        sign = "gemini";
    }
    else if (month === 7 && day >= 15 || month === 8 && day <= 14) {
        sign = "cancer";
    }
    else if (month === 8 && day >= 15 || month === 9 && day <= 14) {
        sign = "leo";
    }
    else if (month === 9 && day >= 15 || month === 10 && day <= 14) {
        sign = "virgo";
    }
    else if (month === 10 && day >= 15 || month === 11 && day <= 14) {
        sign = "libra";
    }
    else if (month === 11 && day >= 15 || month === 12 && day <= 14) {
        sign = "scorpio";
    }
    Session.findOne({ 'token': token }, function (err, result) {
        if (err) {
            console.log(err);
            response = err;
            res.json(response);
        } else {
            if (result == null) {
                console.log("Session is not found");
                response = { success: false, message: "Session time out!" }
                res.json(response);
            } else {
                result.update({
                    "birthday": req.params.birthday,
                    "sign": sign
                },function(err,result){
                    if(err){
                        console.log(err);
                        res.json(err);
                    }else{
                        console.log("update sessions !");
                    }
                });
                if (result.type == 'email') {
                    User.findOne({ 'local.email': result.email }, function (err, user) {
                        if (err) {
                            response = err;
                        } else {
                            if (user == null) {
                                console.log("Not found");
                                response = { success: false, message: "Not found" };
                                res.json(response);
                            } else {
                                user.update({
                                    "birthday": req.params.birthday,
                                    "sign": sign
                                }, function (err, result) {
                                    if (err) {
                                        response = err;
                                        res.json(response);
                                    } else {
                                        console.log("update profile successfull");
                                        console.log(result);
                                        response = { success: true, message: "Update successfully" };

                                        res.json(response);
                                    }
                                });
                            }
                        }
                    })
                } else if (result.type == 'facebook') {
                    User.findOne({ 'facebook.email': result.email }, function (err, user) {
                        if (err) {
                            response = err;
                        } else {
                            if (user == null) {
                                console.log("Not found");
                                response = { success: false, message: "Not found" };
                                res.json(response);
                            } else {
                                user.update({
                                    "birthday": req.params.birthday,
                                    "sign":sign
                                }, function (err, result) {
                                    if (err) {
                                        response = err;
                                        res.json(response);
                                    } else {
                                        console.log("update profile successfull");
                                        console.log(result);
                                        response = { success: true, message: "Update successfully" };
                                        res.json(response);
                                    }
                                });
                            }
                        }
                    })
                }
            }
        }
    })
});
/////////////////////////////////////////// Horoscope Zodiac //////////////////////////////////////////////
router.post("/horoscope/:sign", function (req, res) {
    var resp = {};
    var id;
    if (req.params.sign == 'aries') {
        id = 18286;
    }
    else if (req.params.sign == 'taurus') {
        id = 18288;
    }
    else if (req.params.sign == 'gemini') {
        id = 18289;
    }
    else if (req.params.sign == 'cancer') {
        id = 18290;
    }
    else if (req.params.sign == 'leo') {
        id = 18291;
    }
    else if (req.params.sign == 'virgo') {
        id = 18292;
    }
    else if (req.params.sign == 'libra') {
        id = 18293;
    }
    else if (req.params.sign == 'scorpio') {
        id = 18294;
    }
    else if (req.params.sign == 'sagittarius') {
        id = 18295;
    }
    else if (req.params.sign == 'capricorn') {
        id = 18297;
    }
    else if (req.params.sign == 'aquarius') {
        id = 18298;
    }
    else if (req.params.sign == 'pisces') {
        id = 18299;
    }

    request.get('https://lisaguru.com/api/get_post/?id=' + id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body); //parse string to json 
            var wholecontent = info.post['content'];
            var temp = wholecontent.split('</aside>'); //remove share content 
            var content = temp[1].split('-->'); // remove comment tags
            var content = content[1]; //content
            var content = content.split('\n'); // separate each cat by enter
            if(content.length == 13){
                var title = content[0].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from title
                var work = content[2].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from work
                var finance = content[4].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from finance
                var love = content[6].replace(/<\/?[^>]+(>|$)/g, "");// remove html tag from love
                var healthy = content[9].replace(/<\/?[^>]+(>|$)/g, ""); //remove html tag from healthy
                var luck = content[11].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from luck
            }else {
                var title = content[0].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from title
                var work = content[3].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from work
                var finance = content[5].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from finance
                var love = content[7].replace(/<\/?[^>]+(>|$)/g, "");// remove html tag from love
                var healthy = content[10].replace(/<\/?[^>]+(>|$)/g, ""); //remove html tag from healthy
                var luck = content[12].replace(/<\/?[^>]+(>|$)/g, ""); // remove html tag from luck
            }
            resp = {
                "title": title,
                "work": work,
                "finance": finance,
                "love": love,
                "healthy": healthy,
                "luck": luck
            }
            res.json(resp);
        } else {
            res.json({ error: true, message: 'Something went wrong, Please try again' });
        }
    });
});

module.exports = router;