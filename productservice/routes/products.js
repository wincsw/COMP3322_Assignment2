var express = require('express');
var monk = require('monk');
var router = express.Router();
var cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/loadpage', function (req, res) {
    var db = req.db;
    var col = db.get('productCollection');

    var product_category = req.query.category;
    var product_name = req.query.name;
    var selector = {
        category: product_category,
        name: { $regex: '.*' + product_name + '.*', $options: "i" } // contains
    };
    col.find(selector).then((err, docs) => {
        if (err === null) {
            var product_list = [];
            var product_count = 0;
            if (docs.length > 0) {
                for (let i; i < docs.length; i++) {
                    var product = {
                        _id: docs[i]._id,
                        name: docs[i].name,
                        price: docs[i].price,
                        productImage: docs[i].productImage
                    }
                    product_list.push(JSON.stringify(product));
                    product++;
                }

                var response = {
                    category: product_category,
                    productnum: product_count,
                    products: product_list
                };
                res.json(response);

            }
            else {
                var response = {
                    category: product_category,
                    productnum: product_count,
                    products: product_list
                };
                res.json(response);
            }
        }
        else {
            res.send(err);
        }

    })
})

router.get('/loadproduct/:productid', function (req, res) {
    var db = req.db;
    var col = db.get('productCollection');

    var product_id = req.params.productid;
    var selector = {
        _id: product_id,
    };
    col.find(selector).then((err, docs) => {
        if (err === null) {
            if (docs.length > 0) {
                var response = {
                    manufacturer: docs[0].manufacturer,
                    description: docs[0].description,
                };

                res.json(response);

            }
            else {
                var response = {
                    manufacturer: null,
                    description: null,
                };
                res.json(response);
            }
        }
        else {
            res.send(err);
        }
    })
})

router.post('/signin', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var username = req.body.username;
    var password = req.body.password;

    var selector = {
        username: username,
        password: password
    };
    col.find(selector).then((err, docs) => {
        if (err === null) {
            if (docs.length > 0) {
                res.cookie('userId', docs[0]._id, { maxAge: 900000 });
                var response = {
                    _id: docs[0]._id,
                    totalnum: docs[0].totalnum,
                    message: 'Login sucessful'
                }
                res.json(response);
            }
            else {
                var response = {
                    _id: null,
                    totalnum: null,
                    message: 'Login failure'
                }
                res.json(response);
            }
        }
        else {
            res.send(err);
        }
    })
})

router.get('/signout', function (req, res) {
    res.clearCookie('userID');
    res.send('');
})

router.put('/addtocart', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var productId = req.body.productId;
    var quantity = req.body.quantity;
    var userId = req.cookies.userId;

    col.update(
        { _id: monk.id(userId), 'cart.productId': productId },
        { $inc: { totalnum: quantity, 'cart.$.quantity': quantity } },
        false,
        true
    ).then((err, result) => {
        if (err !== null) {
            res.send(err);
        }
    });;

    col.update(
        { _id: monk.id(userId), 'cart.productId': { $ne: productId } },
        {
            $addToSet: { 'cart': { 'productId': productId, 'quantity': quantity } },
            $inc: { totalnum: quantity, }
        },
        false,
        true
    ).then((err, result) => {
        if (err !== null) {
            res.send(err);
        }
    });;

    col.find({ _id: monk.id(userId) }).then((err, docs) => {
        if (err === null) {
            if (docs.length > 0) {
                var response = {
                    totalnum: docs[0].totalnum
                }
                res.json(response);
            }

        }
        else {
            res.send(err);
        }
    })
})

router.get('/loadcart', function (req, res) {
    var db = req.db;
    var user_col = db.get('userCollection');
    var product_col = db.get('productCollection');

    var userId = req.cookies.userId;
    var user_selector = { _id: monk.id(userId) };

    col.find(user_selector).then((err, docs) => {
        if (err === null) {
            if (docs.length > 0) {
                var cart = [];
                for (let i; docs[0].cart.length; i++) {
                    var name;
                    var price;
                    var productImage;
                    col.find({ _id: monk.id(docs[0].cart[i].productId) }).then((err, result) => {
                        if (err === null) {
                            if (result.length > 0) {
                                name = result[0].name;
                                price = result[0].price;
                                productImage = result[0].productImage;
                            }
                        }
                        else {
                            res.send(err);
                        }
                    })
                    var product = {
                        productId: docs[0].cart[i].productId,
                        quantity: docs[0].cart[i].quantity,
                        name: name,
                        price: price,
                        productImage: productImage
                    }
                    cart.push(JSON.stringify(product));
                }

                var response = {
                    cart: cart
                }
                res.json(response);
            }


        }
        else {
            res.send(err);
        }
    })
})

router.put('/updatecart', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var productId = req.body.productId;
    var quantity = req.body.quantity;
    var userId = req.cookies.userId;

    col.update(
        { _id: monk.id(userId), 'cart.productId': productId },
        { $inc: { totalnum: quantity, 'cart.$.quantity': quantity } },
        false,
        true
    ).then((err, result) => {
        if (err !== null) {
            res.send(err);
        }
    });;

    col.find({ _id: monk.id(userId) }).then((err, docs) => {
        if (err === null) {
            if (docs.length > 0) {
                var response = {
                    totalnum: docs[0].totalnum
                }
                res.json(response);
            }

        }
        else {
            res.send(err);
        }
    })
})

router.delete('/deletefromcart/:productid', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var productId = req.params.productId;
    var userId = req.cookies.userId;

    col.find({ _id: monk.id(userId) }).then((err, docs) => {
        if (err === null) {
            if (docs.length > 0) {
                for (let i; i < docs[0].cart.length; i++) {
                    if (docs[0].cart[i].productId === productId) {
                        col.update(
                            { _id: monk.id(userId) },
                            {
                                $pull: { cart: { productId: productId, quantity: docs[0].cart[i].quantity } },
                                $inc: { totalnum: 0 - quantity }

                            },
                            false,
                            true
                        ).then((err, result) => {
                            if (err !== null) {
                                res.send(err);
                            }
                        });

                        var response = {
                            totalnum: docs[0].totalnum
                        }

                        res.json(response);
                    }
                }

            }

        }
        else {
            res.send(err);
        }
    })
})

router.get('/checkout', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var userId = req.cookies.userId;

    col.update(
        { _id: monk.id(userId) },
        { $set: { cart: [], totalnum: 0 } },
        false,
        true
    ).then((err, result) => {
        if (err !== null) {
            res.send(err);
        }
    });

    res.send('');
})

module.exports = router;
