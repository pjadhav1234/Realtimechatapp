import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const login =async (req, res) => {
     const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout controller exported for use in route definitions
export const logout = (req, res) => {          // ← Arrow‑function handler receives Express’s req & res objects
  try {                                        // ← Enter protected block to catch unexpected errors
    /* 
       Tell the browser to overwrite the “jwt” cookie with an empty string.
       Setting maxAge to 0 instructs the browser to delete the cookie immediately.
       (You could also use { expires: new Date(0) } with the same effect.)
    */
    res.cookie("jwt", "", {                    // ← Name: "jwt", Value: empty, Options:
      maxAge: 0,                              //    • 0 ms lifetime ⇒ delete the cookie right away
    });

    // Send an HTTP 200 OK response with a friendly JSON confirmation message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {                           // ← If anything above throws, execution jumps here
    console.log("Error in logout controller", error.message);  // ← Log details for the server admin
    // Respond with a generic 500 Internal Server Error and short message for the client
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateProfile = async (req, res) => {              // ← Async so we can `await` DB I/O
  try {
    /*--------------------------------------------------------------
      1️⃣  Extract basic fields that the client sent in the request body
          (e.g. via a `<form>` or JSON payload)
    ----------------------------------------------------------------*/
    const { fullName, email, profilePic } = req.body;            // ← Destructure name, e‑mail, and a Base‑64 / URL / file ID for the avatar

    /*--------------------------------------------------------------
      2️⃣  Get the user’s MongoDB ID that the auth middleware injected
    ----------------------------------------------------------------*/
    const userId = req.user._id;                                 // ← `protectRoute` (or similar) put the decoded JWT payload on req.user

    /*--------------------------------------------------------------
      3️⃣  Basic validation of required text fields
    ----------------------------------------------------------------*/
    if (!fullName || !email) {                                   // ← Either value missing?
      return res                                                  //   ↳ Immediately send a *400 Bad Request* ...
        .status(400)
        .json({ message: "Full name and email are required" });   //   ... and stop the function (`return`)
    }

    /*--------------------------------------------------------------
      4️⃣  Make sure the user actually exists in the database
    ----------------------------------------------------------------*/
    const user = await User.findById(userId);                    // ← Query once to be safe (and to reuse doc if you like)

    if (!user) {                                                 // ← No match? 99 % of the time this won’t happen if
      return res                                                  //   your auth middleware was correct—but let’s be safe
        .status(404)
        .json({ message: "User not found" });
    }

    /*--------------------------------------------------------------
      5️⃣  Optional validation: avatar must be present
    ----------------------------------------------------------------*/
    if (!profilePic) {                                           // ← They forgot to attach/choose an image?
      return res                                                  //   ↳ Same pattern: reply & exit
        .status(400)
        .json({ message: "Profile picture is required" });
    }

    /*--------------------------------------------------------------
      6️⃣  Upload the raw image / URL to Cloudinary (external CDN)
          cloudinary.uploader.upload() returns metadata including
          `secure_url`, a HTTPS link that is publicly accessible.
    ----------------------------------------------------------------*/
    const uploadResp = await cloudinary.uploader.upload(profilePic);
    //                          ▲──────────── cloudinary SDK call

    /*--------------------------------------------------------------
      7️⃣  Persist the new data in MongoDB
          • findByIdAndUpdate lets us update in one round‑trip
          • `{ new:true }` tells Mongoose to return **the updated doc**
    ----------------------------------------------------------------*/
    const updatedProfile = await User.findByIdAndUpdate(         // ← Static model method, NOT the `user` doc instance
      userId,                                                    //   ← Query filter
      {                                                          //   ← Update payload
        fullName,                                                //       Update name
        email,                                                   //       Update e‑mail
        profilePic: uploadResp.secure_url,                       //       Save Cloudinary URL
      },
      { new: true }                                              //   ← Return the doc *after* modification
    );

    /*--------------------------------------------------------------
      8️⃣  All good – reply with the fresh user object
    ----------------------------------------------------------------*/
    res.status(200).json(updatedProfile);                        // ← Send the new doc back to the client
  } catch (error) {
    /*--------------------------------------------------------------
      9️⃣  Unexpected errors (DB offline, Cloudinary failure, etc.)
    ----------------------------------------------------------------*/
    console.log("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const checkAuth=(req,res)=>{
  try { 
    res.status(200).json(req.user); // Send the user object back to the client
    
  } catch (error) {
    console.log("Error in checkAuth controller",error,message);
    res.status(500).json({message:"Internal server Error"});
  }
}