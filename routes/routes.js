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
    WaitTimeSeconds: 4
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
}

module.exports = appRouter;
