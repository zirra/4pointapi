const   http					= require('http'),
        express				    = require('express'),
        path					= require('path'),
        fourpoint               = require('4point'),
        bodyParser				= require('body-parser');

const   AWS                     = require('aws-sdk');


AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: "us-west-2",
});


let db                          = new AWS.DynamoDB.DocumentClient();
let	app					        = express();

let xPolicy			            = function (req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
};

app.use(xPolicy);

app.set('port', process.env.PORT || 4000);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.all('*', function(req, res, next){ req.db 		= db; next();});

app.use('/api/v1', fourpoint);

app.use('/', express.static(path.join(__dirname, 'node_modules/4point/www')));

http.createServer(app).listen(app.get('port'), function(){
    console.log('Event Management Services Started.  Running on port: ' + app.get('port'));
});