const setDatabase = require('../Modals/user.modal')
const productTable = require('../Modals/product.modal')
const commentContent = require('../Modals/productCOM.modal')
const cartTable = require('../Modals/addtocart.modal')
const productlike = require('../Modals/productlike.modal')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2
const multer = require('multer');
const otpmodal = require('../Modals/otp.modal')
require('dotenv').config();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const SECRET = process.env.SECRET
const backendSignup = (req, res) => {
  console.log('Begin backend for signup');
  console.log(req.body);
  setDatabase.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.send({ message: "Email already exist" })
    }
    else {
      let saveUser = new setDatabase(req.body)
      saveUser.save().then(() => {
        console.log(req.body);
        res.send({ status: true, message: "Sucessfully sign up" })
      }).catch((err) => {
        res.send({ status: false, message: "Business name already exist", error: err })
        console.log('Error occur', err);
      })
    }
  })
}

const sendMessageToEmail = (content, mail, otpcode, title) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    }
  });

  var mailOptions = {
    from: process.env.USER_EMAIL,
    to: mail,
    subject: 'iMARKET ' + title,
    html: content
  };
  // transport
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      return true
    }
  });
}
const saveOpt = async (req, res) => {
  console.log(req.body);

  let user = await setDatabase.findOne({ email: req.body.mail })
  if (user) {
    let username = user.username
    const html = '<div style="padding: 20px;"><p style="font-size:18px">' + req.body.title + '</p><div style="border: .2px solid gray; padding: 10px 10px; border-radius: 10px; margin: auto;"><p style="font-size:20px">Hey ' + username + '</p><div><p style="font-size: 15px;">' + req.body.title == "Verify Email" ? 'Your email have to be verify before completing your registration. Please enter this verification code to confirm your email.' : 'Reset your password with this code ' + '</p><p style="font-size: 25px; font-weight: 550;">' + req.body.digit + '</p><p style="font-size: 20px;">Verification codes expire after 30 minutes. </p></div></div></div>'

    let otpobj = {
      user: req.body.mail,
      type: req.body.type,
      otpcode: req.body.digit
    }
    console.log(otpobj);

    let findOtp = await otpmodal.findOne({ user: req.body.mail, type: req.body.type })
    if (findOtp) {
      let deletotp = await otpmodal.findOneAndDelete({ user: req.body.mail, type: req.body.type })
      console.log('otp found');
      if (deletotp) {
        console.log('deleted');
      }
    }
    let saveOtp = new otpmodal(otpobj)
    saveOtp.save()
      .then((result) => {
        if (result) {
          console.log(result);
          console.log('Code sent to database');
          sendMessageToEmail(html, req.body.mail, req.body.userdigit, req.body.title)
          res.send({ result: result.code });
        }
      })
      .catch((err) => {
        console.log('Error occurred:', err);
        res.status(500).send('Internal Server Error');
      });
  } else {
    res.send({ message: "Invalid Email" });
  }

}


const verifyEmail = (req, res) => {
  console.log(req.body);
  setDatabase.findOne({ email: req.body.mail }).then((user) => {
    if (user) {
      if (user.emailverify == true) {
        res.send({ status: true, message: "Your email has been verified before " })
      }
      else {
        otpmodal.findOne({ user: req.body.mail }).then(async (otp) => {
          if (otp) {
            console.log(otp);
            console.log(req.body.digit)
            try {
              const isCodeValid = await otp.compareOtp(req.body.digit);
              console.log(isCodeValid);
              if (isCodeValid) {
                setDatabase.findOneAndUpdate(
                  { email: req.body.mail },
                  { $set: { emailverify: true } },
                  { new: true }
                )
                  .then(async (result) => {
                    if (result) {
                      console.log('Your email have been verify');
                      let detleteotp = await otpmodal.findOneAndDelete({ user: req.body.mail, type: "Verify Email" })
                      res.send({ message: "Your email have been verify", result: result.code })
                    }
                  })
                  .catch((err) => {
                    console.log('Error occurred:', err);
                    res.status(500).send('Internal Server Error');
                  });
              }
              else {
                res.send({ message: "Invalid code" })
              }
            } catch (error) {
              console.log(error);
            }
          }
        })
      }
    }
    else {
      res.send({ message: "Email not found" })
    }
  })
}

const backendLogin = (req, res) => {
  console.log('Begin backend for login');
  const { email, password, username } = req.body
  setDatabase.findOne({ email: email }).then(async (user) => {
    console.log(user);
    if (user) {
      try {
        const result = await user.compareUser(password);
        if (result) {
          console.log('User found');
          console.log(user);
          let token = jwt.sign({ email }, SECRET, { expiresIn: "1h" })
          res.send({ status: true, message: "User found", user: user._id, token });
        } else {
          res.send({ status: false, message: "Password does not match" });
        }
      } catch (err) {
        console.log('Error occurred during password comparison:', err);
        res.send({ status: false, message: "Error occurred" });
      }
    } else {
      console.log("User not found");
      res.send({ status: false, message: "User not found" });
    }
  }).catch((err) => {
    console.log('error occur', err);
  })
}



const resetPassword = async (req, res) => {

  if (req.body.verifycode) {
    console.log(req.body);
    let findotp = await otpmodal.findOne({ user: req.body.mail, type: "Reset password" })
    if (findotp) {
      const isCodeValid = await findotp.compareOtp(req.body.otpcode);
      if (isCodeValid) {
        res.send({ message: "Access granted" })
      } else {
        res.send({ message: "Access denied" })
      }
    } else {
      console.log('Otp not found');
    }
  } else {
    let usermail = req.body.mail
    let password = req.body.password
    setDatabase.findOne({ email: usermail }).then((user) => {
      if (user) {
        user.password = password
        console.log(user);
        let saveuser = new setDatabase(user)
        saveuser.save().then(async (result) => {
          console.log(result);
          console.log('code new password set');
          res.send({ status: true, message: "You have successfully change password" })
          let deletOtp = await otpmodal.findOneAndDelete({ user: req.body.mail, type: "Reset password" })

        }).catch((err) => {
          console.log('Error occur: ', err);
        })
      }
      else {
        console.log('cannot find user setting password');
      }
    }).catch((err) => {
      console.log(err);
    })
  }
}


const verifyToken = (req, res) => {
  let token = req.headers.authorization.split(" ")[1]
  // console.log(token);
  jwt.verify(token, SECRET, ((err, result) => {
    if (err) {
      console.log(err);
      res.send({ tokstatus: false })
    }
    else {
      res.send({ tokstatus: true, result })
    }
  }))
}

const like = async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.allLike && req.body.user) {
      const likeObj = {
        user: req.body.user,
        product: req.body.allLike,
      };
      const existingLike = await productlike.findOne(likeObj);

      if (!existingLike) {
        const newLike = new productlike(likeObj);
        await newLike.save();

        const getPro = await productTable.findOne({ _id: req.body.allLike });

        if (getPro) {
          getPro.hot += 1;
          const saveProduct = new productTable(getPro);
          await saveProduct.save();
          res.send({ message: "added" })
        } else {
          console.log('Product not found');
        }
      }
      else {
        await productlike.findOneAndDelete(likeObj);

        const getPro = await productTable.findOne({ _id: req.body.allLike });

        if (getPro) {
          getPro.hot -= 1;
          const saveProduct = new productTable(getPro);
          await saveProduct.save();
          res.send({ message: "remove" })
        } else {
          console.log('Product not found');
        }
      }

    } else {
      console.log('Nothing is coming from front end');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};


const pimgsave = async (req, res) => {
  try {
    if (req.body.imagename) {
      const uploadedfile = req.body.imagename;

      const result = await duplicateAndSaveToCloudinary(uploadedfile)

      console.log('Files Uploaded Successfully');
      console.log('Original Image URL:', result.originalImageUrl);

      res.send({
        status: true,
        message: 'Upload successful',
        myimage: result.originalImageUrl,
        duplicateImageUrl: result.duplicateImageUrl
      });
      if (req.body.userid) {
        setDatabase.findOneAndUpdate(
          { _id: req.body.userid },
          { $set: { userImg: result.originalImageUrl } },
          { new: true }
        ).then((result1) => {

          productTable.find({ owner: req.body.userid }).then((owner) => {
            if (owner) {
              console.log(owner, 'owenenenenuej');
              owner.map((item, i) => {
                item.userImg = result.originalImageUrl
                console.log(item.userImg);
                let saveProduct = new productTable(item)
                saveProduct.save().then((result) => {
                  console.log("Product updated successfully")
                  console.log(result);
                }).catch((err) => {
                  // res.send({ errmessage: "Product updated  failed" })
                  console.log(err);
                })
              })
            }
          })

          commentContent.find({ user: req.body.userid }).then((commentowner) => {
            if (commentowner) {
              commentowner.map((item, i) => {
                item.userImg = result.originalImageUrl
                let updatecomment = new commentContent(item)
                updatecomment.save().then((commentresult) => {
                  console.log('comment updated');
                }).catch((err) => {
                  console.log('Erorr while updating comment', err);
                })
              })
            }
          })


        }).catch((err) => {
          console.log(err);
        })
      }
    } else {
      res.send({
        status: false,
        message: 'Something went wrong, upload the image again'
      });
    }
  } catch (error) {
    console.error(error);
    res.send({
      status: false,
      message: 'Upload failed'
    });
  }
};

// const duplicateAndSaveToCloudinary = async (uploadedfile) => {
//   try {
//     // Upload the original image to Cloudinary
//     const originalResult = await cloudinary.uploader.upload(uploadedfile);

//     // Generate a unique public ID for the duplicate image  
//     const duplicatePublicId = `${originalResult.public_id}_duplicate`;

//     // Upload the duplicate image to Cloudinary
//     const duplicateResult = await cloudinary.uploader.upload(uploadedfile, {
//       public_id: duplicatePublicId
//     });

//     return {
//       originalImageUrl: originalResult.secure_url,
//       duplicateImageUrl: duplicateResult.secure_url
//     };
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

const duplicateAndSaveToCloudinary = async (uploadedfile) => {
  try {
    // Upload the original image to Cloudinary
    const originalResult = await cloudinary.uploader.upload(uploadedfile);

    // Generate a unique public ID for the duplicate image
    const duplicatePublicId = `${originalResult.public_id}_duplicate`;

    // Duplicate the image using Cloudinary's rename function
    await cloudinary.uploader.rename(originalResult.public_id, duplicatePublicId);

    return {
      originalImageUrl: originalResult.secure_url,
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const deleteImg = (req, res) => {
  console.log(req.body);
  const imageUrl = req.body.img;

  const getPublicId = (url) => {
    const parts = url.split('/upload/')[1]; // "v1744641995/kn7hhgbruutjt0qkh91n.jpg"
    const publicIdWithVersion = parts.split('/'); // ["v1744641995", "kn7hhgbruutjt0qkh91n.jpg"]
    const filename = publicIdWithVersion.slice(1).join('/'); // Skip the version part
    return filename.split('.')[0]; // Remove the .jpg or .png
  };
  const publicId = getPublicId(imageUrl);

  cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      console.error("Delete failed:", error);
      return res.send({ success: false, message: "Delete failed, try again" });
    } else {
      console.log("Delete success:", result);
      return res.send({ success: true, message: "Deleted Successfully" });
    }
  });
};

const uploadproduct = async (req, res) => {
  try {
    const { owner } = req.body;

    if (!owner) {
      return res.status(200).send({ success: false, message: "Owner ID is required." });
    }

    const seller = await User.findById(owner);
    if (!seller) {
      return res.status(200).send({ success: false, message: "Seller not found." });
    }

    if (seller.businessName == "empty") {
      return res.status(200).send({
        success: false,
        message: "You have to upgrade your account to a Vendor Account."
      });
    }

    const saveProduct = new productTable(req.body);
    await saveProduct.save();

    console.log("Product uploaded:", saveProduct);
    return res.status(200).send({ success: true, message: "Product uploaded successfully." });

  } catch (err) {
    console.error("Error uploading product:", err);
    return res.status(500).send({ success: false, message: "Product upload failed.", error: err.message });
  }
};


const getuserimg = (req, res) => {
  console.log(req.body, 'userimg');
  setDatabase.findOne({ _id: req.body.id }).then((result) => {
    console.log(result);
    res.send({ userimg: result.userImg, userStore: result.storename })
  })
}

const advert = async (req, res) => {
  console.log(req);
  try {
    // Perform Cloudinary upload
    // // const cloudinaryResponse = await cloudinary.uploader.upload_stream(
    // //   { resource_type: 'video' },
    // //   (error, result) => {
    // //     if (error) {
    // //       console.error('Error uploading to Cloudinary:', error);
    // //       return res.status(500).json({ error: 'Error uploading to Cloudinary' });
    // //     }
    // //     // Respond with Cloudinary URL or any relevant information
    // //     res.status(200).json({ cloudinaryUrl: result.secure_url });
    // //   }
    // ).end(req.file.buffer);
  } catch (error) {
    // console.error('Error processing upload:', error);
    // res.status(500).json({ error: 'Error processing upload' });
  }
}

const storenmUpd = async (req, res) => {
  console.log(req.body);

  if (req.body) {
    try {
      await setDatabase.findOneAndUpdate(
        { _id: req.body.username },
        { $set: { storename: req.body.newName } },
        { new: true }
      ).then((result) => {
        console.log(result, "storename updated");
        productTable.find({ owner: result._id }).then((owner) => {
          if (owner) {
            console.log(owner, 'owenenenenuej');
            owner.map((item, i) => {
              item.username = result.storename
              let saveProduct = new productTable(item)
              saveProduct.save().then((result) => {
                console.log("Product updated successfully")
              }).catch((err) => {
                console.log(err);
              })
            })
          }
        })
        res.send({ message: "Storename updated", storename: result.storename })
      }).catch((err) => {
        console.log("error in storename", err);
      })
    } catch (err) {
      console.log(err);
    }
  }
}


const getUserProduct = (req, res) => {
  console.log(req.body)
  productTable.find({ owner: req.body.userId }).then((products) => {
    if (products) {
      console.log(products, 'owenenenenuej');

      res.send({ success: products.length > 0 ? true : false, products })
    }
  })
}

const storeAddress = async (req, res) => {
  const { owner } = req.body
  try {
    const seller = await setDatabase.findOne({ _id: owner })
    // console.log(owner, seller)
    res.status(200).json({ vendor: seller, status: true })
  } catch (error) {
    console.log(error)
    res.status(400).json({ address: "Not found, relaod the page", status: false })
  }

}


const userFullname = async (req, res) => {
  // console.log(req.body)
  const user = await setDatabase.findOne({ _id: req.body.user })
  res.status(200).json({ address: "Your full name", name: user.fullName })
}

const mySeller = async (req, res) => {
  // console.log(req.body);
  const userCart = await cartTable.find({ buyer: req.body.user });
  const mySeller = [];

  if (userCart.length > 0) {
    for (const product of userCart) {
      if (!mySeller.includes(product.product)) {
        const prd = await productTable.findOne({ _id: product.product });
        if (prd) {
          const seller = await setDatabase.findOne({ _id: prd.owner });
          if (seller && !mySeller.includes(seller.businessName)) {
            mySeller.push(seller.businessName);
          }
        }
      }
    }

    console.log("mySeller:", mySeller);
    res.status(200).json({ address: "Your seller", status: true, seller: mySeller });
  } else {
    res.status(200).json({
      address: "You can't chat with any seller for now. Start adding product to your cart",
      status: false
    });
  }
};

module.exports = { backendSignup, backendLogin, uploadproduct, verifyToken, like, pimgsave, deleteImg, saveOpt, verifyEmail, resetPassword, getuserimg, advert, storenmUpd, getUserProduct, storeAddress, mySeller, userFullname }
// addcustomer,
// 65df0856d84971fa4066e4e3
// 65df0856d84971fa4066e4e3
// 65df0856d84971fa4066e4e3