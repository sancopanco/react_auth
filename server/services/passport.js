const passport = require('passport')
const User = require('../models/user')
const config = require('../config')

// Token based Auth'd requests
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
//Sign up and Sign in
const LocalStrategy = require('passport-local')

// Create local Strategy
const localOptions = {userNameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done){

    User.findOne({email: email}, function(err, user){
      if(err){ return done(err) }
      if(!user){ return done(null, false)}

      user.comparePassword(password, function(err, isMatch){
        if(err){ return done(err) }
        if(!isMatch){ return done(null, false) }

        return done(null, user)   
      })  
    })
})


// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  User.finfById(payload.sub, function(err, user){
    if(err){ return done(err, false)}

    if(user){
      done(null, user)
    }else{
      done(null, false)
    }  
  })
})

// Tell passport to use this strategy 
passport.use(jwtLogin)
passport.use(localLogin)