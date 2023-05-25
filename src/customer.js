const express=require('express');
const app=express();
const PORT=9000;

app.use(express.json());
app.get('/profile',(req,res)=>{
   return res.json('Customer service');
})
app.get('/',()=>{
   return res.json('Customer service');
})

app.listen(PORT,()=>{
   console.log('Cust_rpc LTP 9000');
})