const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../../../middleware/auth')

const prodType = require('../../../models/shopManager/prodType')

// //product_type  
// router.post("/admin/shopManager/prodType", function(req, res){
//   var prod_type = new prodType({
//       title: req.body.txtTitle,
//       trademark: req.body.txtTrademark,
//       sex: req.body.txtSex,
//       ordering: "",
//       addProdType_id: []
//   });
//   prod_type.save(function(err){
//       if(err){
//           console.log("Save product_type error :" + err);
//           res.render("indexAdmin", {page: "addProdType", message: "Save product error!"});
//       } else{
//           console.log("Save product_type successfull " + prod_type._id);
//           prodType.find(function(err, items){
//               if(err){
//                   console.log(err);
//                   res.render("indexAdmin", {page: "prodType", addProdTypeM:[]});
//               } else{
//                   console.log(items);
//                   res.render("indexAdmin", {page: "prodType", addProdTypeM:items, message: "Save product_type successfully!"});
//               }
//           })
//       }
//   });
// });

router.get("/admin/shopManager/prodType", function(req, res){
  prodType.find(function(err, items){
      if(err){
          console.log(err);
          res.render("indexAdmin", {page: "prodType", addProdTypeM:[]});
      } else{
          console.log(items);
          res.render("indexAdmin", {page: "prodType", addProdTypeM:items});
      }
  })
});

// @route GET api/prodType
// @desc Get prodType
// @access Private
router.get('/', async (req, res) => {
	try {
		const prodT = await prodType.find()
		res.json({ success: true, prodT })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/admin/shopManager/prodType/', async (req, res) => {
	const { title, trademark, sex, ordering } = req.body

	// Simple validation
	if (title)
		return res
			.status(400)
			.json({ success: false, message: 'Title is required' })

	try {
        const prodT = await prodType.findOne({ title, trademark, sex })

		if (prodT)
			return res
				.status(400)
				.json({ success: false, message: 'ProdType already taken' })

		const prod_type = new prodType({
			title,
			trademark,
			sex: sex || 'UNISEX',
            ordering: 0
		})

		await prod_type.save(function(err){
			if(err){
				console.log("Save product_type error :" + err);
				res.render("indexAdmin", {page: "addProdType", message: "Save product error!"});
			} else{
				console.log("Save product_type successfull " + prod_type._id);
				prodType.find(function(err, items){
					if(err){
						console.log(err);
						res.render("indexAdmin", {page: "prodType", addProdTypeM:[]});
					} else{
						console.log(items);
						res.render("indexAdmin", {page: "prodType", addProdTypeM:items, message: "Save product_type successfully!"});
					}
				})
			}
		});

		res.json({ success: true, message: 'Happy!', post: prod_type })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		const prodTDeleteCondition = { _id: req.params.id, ordering:"0" }
		const deletedProdT = await prodType.findOneAndDelete(prodTDeleteCondition)

		// User not authorised or post not found
		if (!deletedProdT)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({ success: true, post: deletedProdT })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
module.exports = router