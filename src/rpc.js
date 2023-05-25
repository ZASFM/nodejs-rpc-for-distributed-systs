const amqplib = require('amqplib');
const { v4: uuid4 } = require('uuid');

let amqplibConnection = null;

const getChannel = async () => {
   if (amqplibConnection === null) {
      amqplibConnection = await amqplib.connect('amqps://jjqauhnh:2aDEB5UjTd8WcDVQIn9JHL7ViGdw10hK@rat.rmq2.cloudamqp.com/jjqauhnh');
   }
   return await amqplibConnection.createChannel();
}

//if we recieved any rpc call it will monitor it and send back some data
const RPCObserver = async (RPC_QUEUE_NAME, fakeResponse) => {
   const channel = await getChannel();
   //once its delivered it will go away
   await channel.assertQueue(RPC_QUEUE_NAME, {
      durable: false
   });
   //number of unawknowledged messages
   channel.prefetch(1);
   //any message that comes by the queue name, it will trigger the async function
   channel.consume(RPC_QUEUE_NAME, async (msg) => {
      if (msg.content) {
         //DB operation
         const payload = JSON.parse(msg.content.toString());
         const response = { fakeResponse, payload }//call fake db operation
         //sending back some response, to a specific call and queue that gets defined by the correlation id
         channel.sendToQueue(
            msg.properties.replayTo,
            Buffer.from(JSON.stringify(response)),
            {
               correlation: msg.properties.correlationId
            }
         )
      }
   },
      {
         noAck: false
      }
   )
}

const requestData=async(queue_name,payload,id)=>{
   const channel=getChannel();
   //I want exclusivly this channel to recieve the incoming data:
   const q=await channel.assertQueue('',{exclusive:false});
   
   //sending it to the queue name
   channel.sentToQueue(queue_name,JSON.stringify(payload),{
      replayTo:q.queue,
      correlationId:id
   });

   //checking if we are able to reviebe the response
   return new Promise((resolve,reject)=>{
      //we have already sent to request, now we are waiting for the response with .consume
      channel.consume(q.queue,(msg)=>{
         if(msg.correlationId===id){
            resolve(JSON.parse(msg.content.toString()));
         }else{
            reject('Message not found');
         }
      },{
         noAck:true
      })
   })
}

//send request to other services:
const RPCRequest = async (RPC_QUEUE_NAME,payload) => { 
   const uuid=uuid4()//correlationId, every request has a unique one
   return requestData(RPC_QUEUE_NAME, payload, uuid)
}

module.exports={
   getChannel,
   RPCObserver,
   RPCRequest
}