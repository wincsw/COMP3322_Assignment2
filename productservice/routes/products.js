var express = require('express');
var monk = require('monk');
var router = express.Router();
var cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/loadpage', function (req, res) {
    var db = req.db;
    var col = db.get('productCollection');

    var product_category = req.query.category;
    var product_searchstring = req.query.searchstring;
    var selector;

    if (product_category.length > 0 && product_searchstring.length > 0) {
        selector = {
            category: product_category,
            name: { $regex: '.*' + product_searchstring + '.*', $options: "i" } // contains
        };
    }
    else if (product_category.length > 0) {
        selector = {
            category: product_category,
        };
    }
    else if (product_searchstring.length > 0) {
        selector = {
            name: { $regex: '.*' + product_searchstring + '.*', $options: "i" } // contains
        };
    }
    else {
        selector = {};
    }

    col.find(selector, { sort: 'name' }).then((docs) => {
        res.json({
            products: docs
        });
    }).catch((err) => {
        res.send(err);
    })

})

router.get('/loadproduct/:productid', function (req, res) {
    var db = req.db;
    var col = db.get('productCollection');

    var product_id = req.params.productid;
    var selector = {
        _id: product_id,
    };
    col.find(selector).then((docs) => {
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
    }).catch((err) => {
        res.send(err);
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
    col.find(selector).then((docs) => {
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
    }).catch((err) => {
        res.send(err);
    })
})

router.get('/signout', function (req, res) {
    res.clearCookie('userID');
    res.send('');
})

router.get('/getsessioninfo', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var userId = req.cookies.userId;
    console.log(userId.type)

    if (req.cookies.userId) {
        col.find({ _id: monk.id(req.cookies.userId) }).then((docs) => {
            if (docs.length > 0) {
                var response = {
                    username: docs[0].username,
                    totalnum: docs[0].totalnum,
                    signin: true
                }

                res.json(response);
            }
            else {
                var response = {
                    username: '',
                    totalnum: 0,
                    signin: false
                }

                res.json(response);
            }
        }).catch((err) => res.send(err))
    }
    else {
        var response = {
            username: '',
            totalnum: 0,
            signin: false
        }

        req.json(response);
    }
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
    ).then((result) => { }).catch((err) => res.send(err))


    col.update(
        { _id: monk.id(userId), 'cart.productId': { $ne: productId } },
        {
            $addToSet: { 'cart': { 'productId': productId, 'quantity': quantity } },
            $inc: { totalnum: quantity, }
        },
        false,
        true
    ).then(result => { }).catch((err) => {
        res.send(err);
    })

    col.find({ _id: monk.id(userId) }).then((docs) => {
        if (docs.length > 0) {
            var response = {
                totalnum: docs[0].totalnum
            }
            res.json(response);
        }
        else {
            var response = {
                totalnum: 0
            }
            res.json(response);
        }

    }).catch((err) => {
        res.send(err);
    })
})

router.get('/loadcart', function (req, res) {
    var db = req.db;
    var user_col = db.get('userCollection');
    var product_col = db.get('productCollection');

    var userId = req.cookies.userId;
    var user_selector = { _id: monk.id(userId) };

    user_col.find(user_selector).then((docs) => {
        if (docs.length > 0) {
            var cart = [];
            for (let i; docs[0].cart.length; i++) {
                var name;
                var price;
                var productImage;
                product_col.find({ _id: monk.id(docs[0].cart[i].productId) }).then((esult) => {
                    if (result.length > 0) {
                        name = result[0].name;
                        price = result[0].price;
                        productImage = result[0].productImage;
                    }
                    else {
                        res.json({
                            message: err.message,
                            error: err
                        });
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


    }).catch((err) => {
        res.send(err);
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
    ).then((result) => { }).catch((err) => res.send(err));

    col.find({ _id: monk.id(userId) }).then((docs) => {
        if (docs.length > 0) {
            var response = {
                totalnum: docs[0].totalnum
            }
            res.json(response);
        }
        else {
            var response = {
                totalnum: 0
            }
            res.json(response);
        }

    }).catch((err) => res.send(err))

})

router.delete('/deletefromcart/:productid', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var productId = req.params.productId;
    var userId = req.cookies.userId;

    col.find({ _id: monk.id(userId) }).then((docs) => {
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
                            res.json({
                                message: err.message,
                                error: err
                            });
                        }
                    });

                    var response = {
                        totalnum: docs[0].totalnum
                    }

                    res.json(response);
                }
            }

        }

    }).catch((err) => {
        res.send(err);
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
    ).then((result) => { }).catch((err) => {
        res.send(err);
    })

    res.send('');
})

module.exports = router;
