const express=require('express');
const { RPCObserver, RPCRequest } = require('./rpc');
const app=express();
const PORT=9000;

const fakeCustomerResponse={
   id:'123',
   name:'name',
   country:'country'
}

//listening fot rpc call, handling a function that resturns fake data, sending it back to the queue:
RPCObserver('CUSTOMER_RPC',fakeCustomerResponse);

app.use(express.json());
app.get('/wishlist',async(req,res)=>{
   const requestPayload={
      productId:'1234',
      customerId:'123'
   }
   try{
      const responseData=await RPCRequest('PRODUCT_RPC',requestPayload);
      console.log(responseData);
      res.status(200).json(responseData);
   }catch(err){
      console.log(err);
      res.status(400).json(responseData);
   }
})
app.get('/',()=>{
   return res.json('Customer service');
})

app.listen(PORT,()=>{
   console.log('Cust_rpc LTP 9000');
})