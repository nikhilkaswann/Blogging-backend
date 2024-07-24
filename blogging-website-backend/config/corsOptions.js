const allowedOrigins = require('./allowedOrigins');


const corsOptions = {
    origin: (origin, callback) => {

        if(allowedOrigins.indexOf(origin) !== -1 || !origin ){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }

    },
    credentials:true, //cookies, http authentication with cross origin requests
    optionsSuccessStatus:200 //(CORS preflight checks)
};

module.exports = corsOptions;