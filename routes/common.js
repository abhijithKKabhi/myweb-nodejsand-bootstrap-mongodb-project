var express = require('express');
const { Code } = require('mongodb');
const { Verification } = require('twilio/lib/rest/verify/v2/verificationAttemptsSummary');
const { Client } = require('twilio/lib/twiml/VoiceResponse');
var router = express.Router();
var dbExport = require('../HELPER/user-helper')
var servuceId = 'VA0248659fd227b316f8938712c7db4f97'
var accountSSID = 'ACa1beb63cc63c8db5f08be14416893d59'
var authToken = '24315f89a48f19628c0b3e3176e73921'
var twilio = require('twilio')(accountSSID, authToken)
var dbuser = require('../HELPER/user-helper')

// ################joy##################

const Joi = require('joi');

let inputValidation = ((req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    password: Joi.string()
      .min(3).max(10).required()
    // repeat_password: Joi.ref('password'),
  })
  var { error } = schema.validate(req.body)
  if (error) {
    s = error.details.message = 'invalid password or email'
    console.log('dddddddddddd', s);
    res.redirect('/')
  } else {
    next()
  }
})
//######################################




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { common: true,'loginError': req.session.logInError,});
  req.session.logInError = false
  s = " "

});
router.post('/', inputValidation, (req, res) => {

  dbExport.userLoginData(req.body).then((responsee) => {

    if (responsee.status) {
      req.session.user = responsee.user
      req.session.loggedInn = true
      console.log(req.session.user);

      res.redirect('user/user-home')

    } else {
      req.session.logInError = "loginError"
      res.redirect('/')
    }

  })

});
router.get('/logout', (req, res) => {

  req.session.destroy()
  res.redirect('/')
})
router.get('/reset-Password/otp-check', (req, res) => {
  //console.log('hiiiiiiiiiiiiiiiiiiiiiiiii');
  res.render('reset-Password/otp-check')
})

router.get('/reset-Password/password-reset', (req, res) => {
  //console.log('hiiiiiiiiiiiiiiiiiiiiiiiii');
  res.render('reset-Password/password-reset')
})

router.get('/reset-Password/otp-verify', (req, res) => {
  //console.log('hiiiiiiiiiiiiiiiiiiiiiiiii');
  res.render('reset-Password/otp-verify')
})
router.get('/reset-Password/success', (req, res) => {
  //console.log('hiiiiiiiiiiiiiiiiiiiiiiiii');
  res.render('reset-Password/success')
})
router.post('/reset-Password/otp-verify', (req, res) => {
  //var num=req.body.number
  twilio.verify
    .services(servuceId)
    .verifications.create({
      to: `+91${req.body.number}`,
      channel: "sms"
    }).then((resp) => {
      console.log('otp', resp);
      res.redirect('/reset-Password/otp-check')
    })
})
router.post('/reset-Password/otp-check', (req, res) => {
  console.log(req.body);
  //const {userNum,otp}=req.body
  twilio.verify.services(servuceId)
    .verificationChecks.create({
      to: `+91${req.body.userNum}`,
      code: req.body.otp
    }).then((resp) => {
      if (resp.valid) {
        console.log('welcome');
        res.redirect('/reset-Password/password-reset')
      } else {
        res.redirect('/reset-Password/otp-verify')
        console.log('expire');
      }
    })
})
router.post('/reset-Password/password-reset', (req, res) => {
  dbuser.updatePassword(req.body).then((resp) => {
    if (resp) {

      res.redirect('/reset-Password/success')
    }
  })

})


module.exports = router;
