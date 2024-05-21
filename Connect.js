const mongoose=require('mongoose')

const connect=()=>{
  
  return  mongoose.connect('mongodb+srv://root:1q2w3e4r5t@cluster0.u7ybibe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
)
  
}
module.exports=connect