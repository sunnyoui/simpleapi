var faker = require("faker");
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS(options = {
  apiVersion: '2012-11-05',
  accessKeyId: 'AKIAQLZ2UZDI6RCP4VJD', 
  secretAccessKey: 'fdxctrSnP+m7r2+3CUjUCraZvl8lthPFGIwv3zCG'
})

var queueURL = "https://sqs.us-east-1.amazonaws.com/025355929809/sampleRTSV";


var appRouter = function (app) {

  var params = {
    AttributeNames: [ 
       "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
       "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
   };
   
   sqs.receiveMessage(params, function(err, data) {
     if (err) {
       console.log("Receive Error", err);
     } else if (data.Messages) {
      console.log(data);
       var deleteParams = {
         QueueUrl: queueURL,
         ReceiptHandle: data.Messages[0].ReceiptHandle    
       };
       sqs.deleteMessage(deleteParams, function(err, data) {
         if (err) {
           console.log("Delete Error", err);
         } else {
           console.log("Message Deleted", data);
         }
       });
     }
    });

  app.get("/", function (req, res) {
    res.status(200).send({ message: 'Welcome to our restful API' });
  });

  app.get("/user", function (req, res) {
    var data = ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
    res.status(200).send(data);
  });

 app.get("/users/:num", function (req, res) {
   var users = [];
   var num = req.params.num;

   if (isFinite(num) && num  > 0 ) {
     for (i = 0; i <= num-1; i++) {
       users.push({
           firstName: faker.name.firstName(),
           lastName: faker.name.lastName(),
           username: faker.internet.userName(),
           email: faker.internet.email()
        });
     }

     res.status(200).send(users);

   } else {
     res.status(400).send({ message: 'invalid number supplied' });
   }

 });

 app.get("/errormapping/9999", function (req, res) {
   var data = ({
     9999: "Please call the 1800 number for validation for the error",
   });
   res.status(200).send(data);
 });

 app.get("/errormapping/fr", function (req, res) {
   var data = ({
     1001: "Le nom d'utilisateur que vous avez entré est invalide, veuillez appeler le numéro 1800 pour réinitialiser ",
     1002: "S'il vous plaît appelez votre numéro 1800",
     1003: "Votre session a été interrompue pour cause d'inactivité, veuillez vous reconnecter"
   });
   res.status(200).send(data);
 });


 app.get("/errormapping/en", function (req, res) {
   var data = ({
     1001: "The username you have entered is invalid, please call the 1800 number to reset ",
     1002: "Please call your 1800 number",
     1003: "Your session has been terminated due to inactivity, please login again"
   });
   res.status(200).send(data);
 });


}

module.exports = appRouter;
