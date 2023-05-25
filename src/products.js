const express=require('express');
const { RPCObserver } = require('./rpc');
const app=express();
const PORT=8000;

const fakeCustomerResponse={
   id:'1234',
   product:'product',
   price:000
}

//listening fot rpc call, handling a function that resturns fake data, sending it back to the queue:
RPCObserver('PRODUCTS_RPC',fakeCustomerResponse);

app.use(express.json());
app.get('/customer',async(req,res)=>{
   const requestPayload={
      customerId:'123'
   }
   try{
      const responseData=await RPCRequest('CUSTOMER_RPC',requestPayload);
      console.log(responseData);
      res.status(200).json(responseData);
   }catch(err){
      console.log(err);
      res.status(400).json(responseData);
   }
})
app.get('/',()=>{
   return res.json('Products service');
})

app.listen(PORT,()=>{
   console.log('Cust_rpc LTP 8000');
})