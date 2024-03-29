const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtSecret = require("./secretAndUrl").jwtSecret;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSecret;
module.exports = (passport) => {
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			if (jwt_payload) {
				return done(null, jwt_payload);
			} else {
				return done(null, false);
			}
		}),
	);
};
