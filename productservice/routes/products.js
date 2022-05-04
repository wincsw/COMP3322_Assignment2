var express = require('express');
var monk = require('monk'); // for convert id to monk.id
var router = express.Router();

router.get('/loadpage', function (req, res) {
    var db = req.db;
    var col = db.get('productCollection');

    var product_category = req.query.category;
    var product_searchstring = req.query.searchstring;
    var selector;

    // category and search string
    if (product_category.length > 0 && product_searchstring.length > 0) {
        selector = {
            category: product_category,
            name: { $regex: '.*' + product_searchstring + '.*', $options: "i" } // contains
        };
    }
    // only category
    else if (product_category.length > 0) {
        selector = {
            category: product_category,
        };
    }
    // only search string
    else if (product_searchstring.length > 0) {
        selector = {
            name: { $regex: '.*' + product_searchstring + '.*', $options: "i" } // contains
        };
    }
    // when all category and empty search string
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
            // send null if not found
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

            var response = {
                _id: docs[0]._id,
                totalnum: docs[0].totalnum,
                message: '' // empty string
            }
            // set cookie
            res.cookie('userId', docs[0]._id, { maxAge: 86400 * 1000 });

            res.json(response);
        }
        else {
            // send null for _id & totalnum if not find
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
    res.clearCookie('userId');
    res.send('');
})

router.get('/getsessioninfo', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var userId = req.cookies.userId;
    if (userId) {
        col.find({ _id: monk.id(userId) }).then((docs) => {
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

        res.json(response);
    }
})

router.put('/addtocart', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var productId = req.body.productId;
    var quantity = parseInt(req.body.quantity);
    var userId = req.cookies.userId;

    col.find({ _id: monk.id(userId) }).then((docs) => {
        if (docs.length > 0) {
            col.find({ cart: { $elemMatch: { productId: productId } } }).then((result) => {
                if (result.length > 0) {
                    col.update(
                        { _id: monk.id(userId), 'cart.productId': productId },
                        { $inc: { totalnum: quantity, 'cart.$.quantity': quantity } },
                        false,
                        true
                    ).then(result => {
                        var response = {
                            totalnum: docs[0].totalnum + quantity
                        }
                        res.json(response);
                    })
                }
                else {
                    col.update(
                        { _id: monk.id(userId), 'cart.productId': { $ne: productId } },
                        {
                            $addToSet: { 'cart': { 'productId': productId, 'quantity': quantity } },
                            $inc: { totalnum: quantity, }
                        },
                        false,
                        true
                    ).then(result => {
                        var response = {
                            totalnum: docs[0].totalnum + quantity
                        }
                        res.json(response);
                    })
                }

            })

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
            for (let i = 0; i < docs[0].cart.length; i++) {
                var name = '';
                var price = 0;
                var productImage = '';
                product_col.find({ _id: monk.id(docs[0].cart[i].productId) }).then((result) => {
                    if (result.length > 0) {
                        name = result[0].name;
                        price = result[0].price;
                        productImage = result[0].productImage;
                        var product = {
                            productId: docs[0].cart[i].productId,
                            quantity: docs[0].cart[i].quantity,
                            name: name,
                            price: price,
                            productImage: productImage
                        }
                        cart.push(product);
                        if (i >= docs[0].cart.length - 1) {
                            var response = {
                                cart: cart
                            }
                            res.json(response);
                        }

                    }
                })

            }

        }


    }).catch((err) => {
        res.send(err);
    })

})

router.put('/updatecart', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var productId = req.body.productId;
    var quantity = parseInt(req.body.quantity);
    var userId = req.cookies.userId;

    col.find({ _id: monk.id(userId) }).then((docs) => {
        if (docs.length > 0) {
            var diff = 0;
            for (let i = 0; i < docs[0].cart.length; i++) {
                if (docs[0].cart[i].productId === productId) {
                    diff = quantity - docs[0].cart[i].quantity;
                    col.update(
                        { _id: monk.id(userId), 'cart.productId': productId },
                        { $inc: { totalnum: diff, 'cart.$.quantity': diff } },
                        false,
                        true
                    ).then(result => {
                        var response = {
                            totalnum: docs[0].totalnum + diff
                        }

                        res.json(response);
                    })
                }
            }


        }
        else {
            var response = {
                totalnum: 0
            }
            res.json(response);
        }

    }).catch((err) => res.send(err))

})

router.delete('/deletefromcart/:productId', function (req, res) {
    var db = req.db;
    var col = db.get('userCollection');

    var productId = req.params.productId;
    var userId = req.cookies.userId;


    col.find({ _id: monk.id(userId) }).then((docs) => {
        if (docs.length > 0) {
            for (let i = 0; i < docs[0].cart.length; i++) {
                if (docs[0].cart[i].productId === productId) {
                    col.update(
                        { _id: monk.id(userId) },
                        {
                            $pull: { cart: { productId: productId } },
                            $inc: { totalnum: 0 - docs[0].cart[i].quantity }

                        },
                        false,
                        true
                    ).then(result => {
                        var response = {
                            totalnum: docs[0].totalnum - docs[0].cart[i].quantity
                        }

                        res.json(response);
                    });
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
