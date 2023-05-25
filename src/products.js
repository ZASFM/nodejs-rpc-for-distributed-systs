const express=require('express');
const { RPCObserver } = require('./rpc');
const app=express();
const PORT=8000;

const fakeCustomerResponse={
   id:'123',
   product:'product',
   price:000
}

//listening fot rpc call, handling a function that resturns fake data, sending it back to the queue:
RPCObserver('PRODUCTS_RPC',fakeCustomerResponse);

app.use(express.json());
app.get('/product',(req,res)=>{
   return res.json('Products service');
})
app.get('/',()=>{
   return res.json('Products service');
})

app.listen(PORT,()=>{
   console.log('Cust_rpc LTP 8000');
})