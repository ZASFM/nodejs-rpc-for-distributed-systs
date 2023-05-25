const express=require('express');
const { RPCObserver } = require('./rpc');
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
app.get('/wishlist',(req,res)=>{
   return res.json('Customer service');
})
app.get('/',()=>{
   return res.json('Customer service');
})

app.listen(PORT,()=>{
   console.log('Cust_rpc LTP 9000');
})