const express=require('express');
const app=express();
const PORT=8000;

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