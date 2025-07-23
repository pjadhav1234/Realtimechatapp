import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredusers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredusers);
  } 
  catch (error) {
    console.log("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
       try{
        const {id:userToChatId} = req.params;//The part after the colon (userToChatId) is the variable name you want to put that value in.
        //The part before the colon (id) tells JavaScript which property to pull from the object (req.params.id).
        //object‑destructuring with renaming

        const myId=req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId}  ,

                {senderId:userToChatId,receiverId:myId}
            ]
        })
         res.status(200).json(messages);
       }catch(error){
        console.log("Error in getMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });
       }

}

export const sendMessage = async (req, res) => {
  try{
 const  {text,image} =req.body;
 const {id:receiverId}=req.params;
 const senderId=req.user._id;

 let imageurl;
 if(image){
    const uploadResp=await cloudinary.uploader.upload(image);
    imageurl=uploadResp.secure_url;

 }

 const newMessage=new Message({
    senderId,
    receiverId,
    text,
    image:imageurl,
 });

 await newMessage.save();
 
///realtime functionallity with the help of socket,io
   res.status(201).json(newMessage);
  }
  catch (error) {
console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
