import { generateChat } from "../services/geminiServices.js";

const chat = async(req,res)=>{
   try {
     const {message} = req.body;
     const response = await generateChat(message)
     res.status(200).json({
        success:true,
        answer:response
     })
 
   } catch (error) {
    console.error("Chat error",error.message);
    res.status(200).json({
        success:false,
        message:'Something went wrong'
    })
   }
}
export {chat}