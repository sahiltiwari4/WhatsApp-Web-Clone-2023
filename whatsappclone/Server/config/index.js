import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';

module.exports = function (app) {
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    // parse application/json
    app.use(bodyParser.json());
    // compression of data
    app.use(compression(9));

    // Define your custom CORS options
    const corsOptions = {
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow cookies, if applicable
        optionsSuccessStatus: 204, // No Content response for preflight requests
    };

    // Use CORS middleware with custom options
    app.use(cors(corsOptions));
};
