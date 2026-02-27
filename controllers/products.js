const Product = require("../models/products");

const getAllProduct = (req, res) => {
	return Product.find({})
	.then(result => {
		res.status(200).send({result});
	})
};

const getAllActiveProduct = (req, res) => {
	return Product.find({isActive: true})
	.then(product => {
		if(product.length > 0){
			return res.status(200).send({product});
		}
		else{
			return res.status(200).send({message: `No active products found.`})
		}

		})
	.catch(err => res.status(500).send({ error: `Error finding active products`}));

};

const addProduct = (req, res) => {
	const { name, description, price } = req.body;
  
	Product.findOne({ name })
	  .then(existingProduct => {
		if (existingProduct) {
		  return res.status(409).send({ error: "Product already exists" });
		}
  
		let newProduct = new Product({
		  name: req.body.name,
		  description: req.body.description,
		  price: req.body.price
		});
  
		return newProduct
		  .save()
		  .then(savedProduct => res.status(201).send({ savedProduct }))
		  .catch(err => {
			console.error("Error in saving the product", err);
			return res.status(500).send({ error: "Failed to save the product" });
		  });
	  })
	  .catch(err => {
		console.error("Error in checking for existing product", err);
		return res.status(500).send({ error: "Failed to check for existing product" });
	  });
  };

const getProduct = (req, res) => {
	Product.findById(req.params.productId)
	.then(product => {
		if (!product) {
			return res.status(404).send({error: "Product not found"})
		}
		else{
			return res.status(200).send({product})
		}
	})
	.catch(err => {
		 console.error("Error in retrieving the product", err);
		 return res.status(500).send({error: 'Failed to fetch product'});
	})
}


const archiveProduct = (req, res) => {
	let archivedProduct = {
		isActive: false
	}
	return Product.findByIdAndUpdate(req.params.productId, archivedProduct)
	.then(archiveProduct => {
		if(!archiveProduct){
			return res.status(404).send({ error: 'Product not found' });
		}
		else{
			return res.status(200).send(
				{ 
	        	message: 'Product archived successfully', 
	        	archivedProduct: archiveProduct 
	        	}
	        );
		}
	})
	.catch(err => {
		console.error("Error in updating a product: ", err)
		return res.status(500).send({ error: 'Error in updating a prodcut.' });
	});
}

const activateProduct = (req, res) => {
  let activatedProduct = {
  	isActive:true
  }
  return Product.findByIdAndUpdate(req.params.productId, activatedProduct)
	.then(activateProduct => {
		if(!activateProduct){
			return res.status(404).send({ error: 'Product not active' });
		}
		else{
			return res.status(200).send(
				{ 
	        	message: 'Product activate successfully', 
	        	activatedProduct: activateProduct
	        	}
	        );
		}
	}).catch(err => {
		console.error("Error in updating a product: ", err)
		return res.status(500).send({ error: 'Error in updating a product.' });
	});
}

const updateProduct = (req, res) => {
    let updatedProduct = {
        name: req.body.name, // new name
        description: req.body.description,  // new description
        price: req.body.price // new price
    }
    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(result => {
        if(!result){
            return res.status(404).send({ error: 'Product not found' });
        }
        else{
            return res.status(200).send(
                { 
                message: 'Product updated successfully', 
                updatedProduct: updatedProduct 
                }
            );
        }
    })
}

const searchByPrice = (req, res) => {
  const { minPrice, maxPrice } = req.body;

  // Validate input parameters
  if (minPrice === undefined || maxPrice === undefined) {
    return res.status(400).send({ error: 'minPrice and maxPrice are required in the request body' });
  }

  // Query the database for courses within the given price range
  Product.find({
    price: { $gte: minPrice, $lte: maxPrice },
  })
    .then(product => res.status(200).send({ product }))
    .catch(error => res.status(500).send({ error: 'Error searching products by price range' }));
};

const searchByName = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ error: 'Name parameter is required for search' });
  }

  // Using a regular expression to perform a case-insensitive search
  const searchRegex = new RegExp(name, 'i');

  Product.find({ name: searchRegex })
    .then((products) => {
      if (products.length === 0) {
        return res.status(404).send({ message: `No products found with name matching: ${name}` });
      }

      res.status(200).send({ products });
    })
    .catch((error) => {
      console.error('Error in searching products by name:', error);
      res.status(500).send({ error: 'Failed to search products by name' });
    });
};

module.exports = { 
  getAllProduct, 
  getAllActiveProduct, 
  addProduct, 
  getProduct, 
  archiveProduct, 
  activateProduct, 
  updateProduct, 
  searchByPrice, 
  searchByName 
};
