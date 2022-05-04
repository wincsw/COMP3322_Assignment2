import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import React from 'react';

// Navegation bar component
function NavBar(props) {
    return (
        <nav>
            {/* category buttons */}
            <div className='navbar category'>
                <button onClick={(e) => props.fetchProduct('Phones', '')}>
                    Phones
                </button>
                <button onClick={(e) => props.fetchProduct('Tablets', '')}>
                    Tablets
                </button>
                <button onClick={(e) => props.fetchProduct('Laptops', '')}>
                    Laptops
                </button>
            </div>
            {/* search box */}
            <div className='navbar searchbox'>
                <SearchBox
                    fetchProduct={props.fetchProduct}
                    products={props.products}
                />
            </div>
            {/* sign in/out & cart */}
            <div className='navbar signinout'>
                <SignInOut
                    signin={props.signin}
                    username={props.username}
                    totalnum={props.totalnum}
                    fetchProduct={props.fetchProduct}
                    getSignout={props.getSignout}
                    setPageContent={props.setPageContent}
                />
            </div>
        </nav>
    );
}

// Search box component
class SearchBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: '', // for the drop down menu
            searchstring: '', // for seach box
        }

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSearchstringChange = this.handleSearchstringChange.bind(this);
    }

    handleCategoryChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({ category: value });
    }

    handleSearchstringChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({ searchstring: value });
    }

    render() {
        var icon = '🔍'
        return (
            <div className='searchbox'>
                <select
                    id='category'
                    value={this.state.category}
                    name='category'
                    onChange={this.handleCategoryChange}
                >
                    <option value=''>All</option>
                    <option value='Phones'>Phones</option>
                    <option value='Tablets'>Tablets</option>
                    <option value='Laptops'>Laptops</option>
                </select>
                <input
                    type='text'
                    id='searchstring'
                    name='searchstring'
                    value={this.state.searchstring}
                    onChange={this.handleSearchstringChange}
                />
                <button onClick={(e) => this.props.fetchProduct(this.state.category, this.state.searchstring, e)}>{icon}</button>
            </div >
        )


    }
}

// Sign in/out + Cart component
class SignInOut extends React.Component {
    constructor(props) {
        super(props);

        this.signout = this.signout.bind(this)
    }

    // signin out
    signout() {
        // sign out to the server
        this.props.getSignout();
        // fetch all products to reload the initial page
        this.props.fetchProduct('', '');
    }

    render() {
        var cart = "🛒";
        if (this.props.signin) {
            return (
                <div>
                    <div className='carticon' onClick={(e) => this.props.setPageContent(3, e)}>
                        <p> {cart} {this.props.totalnum} in Cart</p>
                    </div>
                    <div className='person'>
                        <p>Hello, {this.props.username}
                            <a href='#' onClick={this.signout}>Sign out</a>
                        </p>
                    </div>

                </div>
            )
        }
        else {
            return (
                <div>
                    <a href='#' onClick={(e) => this.props.setPageContent(5, e)}>Sign In</a>
                </div>
            )
        }
    }


}

// Component of each product shown in initial/searched page
function ProductBox(props) {
    const image = require('../../productservice/public/' + props.image)
    return (
        <div className='productBox'>
            <img src={image} alt={image} onClick={(e) => props.select(props.id, e)} />
            <br />
            <a href='#' onClick={(e) => props.select(props.id, e)}>{props.name}</a>
            <p>${props.price}</p>
        </div>
    )

}

// Component that display products for initial/searched page
class DisplayProduct extends React.Component {
    constructor(props) {
        super(props);

        this.select = this.select.bind(this);
    }

    // determine whether a producted is select & which product is selected
    select(id) {
        for (let i = 0; i < this.props.products.length; i++) {
            if (this.props.products[i]._id === id) {
                // set product detail in root component for render product detail page
                this.props.setProductDetail(
                    id,
                    require('../../productservice/public/' + this.props.products[i].productImage),
                    this.props.products[i].name,
                    this.props.products[i].price
                )
            }
        }
        // set page to product detail page
        this.props.setPageContent(1);
    }


    render() {
        return (
            <div className='content display'>
                {
                    this.props.products.map((product => {
                        return <ProductBox
                            image={product.productImage}
                            name={product.name}
                            price={product.price}
                            id={product._id}
                            select={this.select}
                        />
                    }))
                }
            </div>
        )
    }

}

// Component for product detail page
class ProductDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            manufacturer: '',
            description: ''
        }

        this.addToCart = this.addToCart.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.getDetail = this.getDetail.bind(this)
    }

    // get manufacturer & description
    getDetail() {
        $.ajax({
            xhrFields: { withCredentials: true },
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/loadproduct/' + this.props.id,
            success: function (result) {
                this.setState({
                    manufacturer: result.manufacturer,
                    description: result.description
                })
            }.bind(this)
        })
    }

    // for addtocart button
    addToCart() {
        // already signin --> add to cart page
        // not signin --> signin page
        if (this.props.signin) {
            this.props.setPageContent(2);
        }
        else {
            this.props.setInCart(true);
            this.props.setPageContent(5);
        }

    }

    handleQuantityChange(event) {
        const target = event.target;
        const value = target.value;
        this.props.setQuantity(value);
    }

    // get details automatically when component is mouted
    componentDidMount() {
        this.getDetail();
    }

    render() {
        return (
            <div className='content product'>
                <div className='product detail'>
                    <img src={this.props.image} alt={this.props.image} className='detail image' />
                    {/* product info */}
                    <div className='detail info'>
                        <h2 className='info name'>{this.props.name}</h2>
                        <h3 className='info price'>${this.props.price}</h3>
                        <p className='info manufacturer'>{this.state.manufacturer}</p>
                        <p className='info description'>{this.state.description}</p>
                    </div>
                    {/* add to cart part */}
                    <div className='detail addtocartbox'>
                        <label>Quantity: </label>
                        <input type='number' id='product_quantity' name='quantity' value={this.props.quantity} onChange={this.handleQuantityChange} min="1" max="5" />
                        <br />
                        <button onClick={this.addToCart}>Add to Cart</button>
                    </div>
                </div>

                <a className='back' href='#' onClick={(e) => this.props.setPageContent(0, e)}>{'< go back'}</a>
                {/* fetch all product to reload initial page */}

            </div>
        )
    }

}

// Component for add to cart page
class AddToCart extends React.Component {
    constructor(props) {
        super(props);

        this.putAddToCart = this.putAddToCart.bind(this);
    }

    // call server for 'PUT' request for add products to cart
    putAddToCart() {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'PUT',
            dataType: 'json',
            url: 'http://localhost:3001/addtocart',
            data: {
                productId: this.props.productId,
                quantity: this.props.quantity
            },
            success: function (result) {
                // set new total num of product in cart
                this.props.setTotalnum(result.totalnum)
            }.bind(this)
        })
    }

    // add to cart automatically when component is mouted
    componentDidMount() {
        this.putAddToCart()
    }


    render() {
        var tick = '✓'
        return (
            <div className='content addtocart'>
                <div>
                    <img className='addtocart image' src={this.props.image} alt={this.props.image} />
                    <h2 className='addtocart success'>{tick} Added to Cart</h2>
                </div>
                <a href='#' className='back' onClick={(e) => this.props.fetchProduct('', '', e)}>{'continue browsing>'}</a>
            </div>
        )
    }
}

// Component for each product in cart in show cart page
class CartItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: this.props.quantity,
            delete: false
        }

        this.handleQuantityChange = this.handleQuantityChange.bind(this)
    }



    handleQuantityChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
            quantity: value
        });
        // quantity == 0 --> delete
        // quantity > 0 --> change quantity
        if (value > 0) {
            this.props.putUpdateCart(this.props.id, value, this.props.price)
        }
        else {
            this.props.deleteFromCart(this.props.id, this.props.price)
            this.setState({
                delete: true
            })
        }
    }


    render() {
        const image = require('../../productservice/public/' + this.props.image)
        if (this.state.delete) {
            // if item deleted --> render nothing
            return (null)
        }
        else {
            return (
                <tr className='cart item'>
                    <td><img src={image} alt={image} className='item image' /></td>
                    <td><p className='item name'>{this.props.name}</p></td>
                    <td><p className='item price'>${this.props.price}</p></td>
                    <td><input type='number' id='item quantity' name='quantity' value={this.state.quantity} onChange={this.handleQuantityChange} min="0" max="5" /></td>
                </tr>
            )
        }
    }
}

// Component to show cart
class ShowCart extends React.Component {
    // loadcart & updarecart
    constructor(props) {
        super(props);

        this.getLoadCart = this.getLoadCart.bind(this);
        this.putUpdateCart = this.putUpdateCart.bind(this);
        this.deleteFromCart = this.deleteFromCart.bind(this);
        this.checkOut = this.checkOut.bind(this);
    }

    // get cart item by 'GET' request to server
    getLoadCart() {
        $.ajax({
            xhrFields: { withCredentials: true },
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/loadcart',
            success: function (result) {
                this.props.setCart(result.cart)
                var temp = 0;
                for (let i = 0; i < result.cart.length; i++) {
                    temp += result.cart[i].price * result.cart[i].quantity
                }
                this.props.setPrice(temp)
            }.bind(this)
        })
    }

    // update cart items with 'PUT' request
    putUpdateCart(productId, quantity, price) {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'PUT',
            dataType: 'json',
            url: 'http://localhost:3001/updatecart',
            data: {
                productId: productId,
                quantity: quantity
            },
            success: function (result) {

                var temp = this.props.price + price * (result.totalnum - this.props.totalnum);
                this.props.setPrice(temp);
                this.props.setTotalnum(result.totalnum)
            }.bind(this)
        })
    }

    // delet item from cart with 'DELETE' request
    deleteFromCart(productId, price) {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'DELETE',
            dataType: 'json',
            url: 'http://localhost:3001/deletefromcart/' + productId,
            data: {
                productId: productId
            },
            success: function (result) {
                var temp = this.props.price + price * (result.totalnum - this.props.totalnum);
                this.props.setPrice(temp);
                this.props.setTotalnum(result.totalnum)
            }.bind(this)
        })
    }

    // for checkout button
    checkOut() {
        if (this.props.totalnum > 0) {
            this.props.setPageContent(4)
            this.props.setTotalnum(0);
        }
    }

    // automaticall load cart when mounted
    componentDidMount() {
        this.getLoadCart();
    }


    render() {
        return (
            <div className='content cart'>
                <h2>Shopping Cart</h2>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th><h3>Price:</h3></th>
                            <th><h4>Quantity:</h4></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.cart.map((product => {
                                return <CartItem
                                    image={product.productImage}
                                    name={product.name}
                                    price={product.price}
                                    id={product.productId}
                                    quantity={product.quantity}
                                    putUpdateCart={this.putUpdateCart}
                                    deleteFromCart={this.deleteFromCart}
                                />
                            }))
                        }
                    </tbody>
                </table>
                <h3>Cart subtotal ({this.props.totalnum} item(s)): ${this.props.price}</h3>
                <button className='checkout_btn' onClick={this.checkOut}>Proceed to check out</button>
            </div>
        )
    }
}

// Component for checkout page
class CheckOut extends React.Component {
    constructor(props) {
        super(props);

        this.getCheckOut = this.getCheckOut.bind(this);
    }

    // checkout cart with 'GET' request
    getCheckOut() {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'GET',
            dataType: 'json',
            url: 'http://localhost:3001/checkout'
        })
    }

    // automatically checkout when mounted
    componentDidMount() {
        this.getCheckOut();
    }

    render() {
        var tick = '✓'
        return (
            <div className='content checkout'>
                <div className='message'>
                    <h2>{tick} You have successfully placed order for {this.props.totalnum} item(s)</h2>
                    <h2>${this.props.price} paid</h2>
                </div>
                <a href='#' className='back' onClick={(e) => this.props.fetchProduct('', '', e)}>{'continue browsing>'}</a>
                {/* fetch all product to reload initial page */}
            </div>
        )
    }
}

// Component for signin page
class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            signin: false
        }

        this.signin = this.signin.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    signin() {
        // if username/password field is/are empty
        if (this.state.username.length === 0 || this.state.password.length === 0) {
            alert('You must enter username and password')
        }
        else {
            $.post({
                xhrFields: { withCredentials: true },
                url: 'http://localhost:3001/signin',
                dataType: 'json',
                data: {
                    username: this.state.username,
                    password: this.state.password
                },
                success: function (result) {
                    this.props.setUserInfo(
                        true,
                        this.state.username,
                        result.totalnum
                    )
                    // login success
                    if (result.message === '') {
                        // if previous page is product detail --> add to cart page
                        if (this.props.inCart) {
                            this.props.setPageContent(2);
                            this.props.setInCart(false);
                        }
                        // otherwise --> initial/searched page
                        else {
                            this.props.setPageContent(0);
                        }
                    }
                    // login fail
                    else {
                        alert(result.message);
                    }
                }.bind(this)
            })
        }
    }


    handleUsernameChange(e) {
        this.setState({
            username: e.target.value
        })
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    render() {

        return (
            <div className='content signin'>
                <div>
                    <label>Username: </label>
                    <input type='text' id='username' name='username' value={this.state.username} onChange={this.handleUsernameChange} />
                </div>
                <div>
                    <label>Password: </label>
                    <input type='password' id='password' name='password' value={this.state.password} onChange={this.handlePasswordChange} />

                </div>
                <button onClick={this.signin}>Sign in</button>
            </div>

        )
    }


}

// Root component
class ShoppingApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // determin which page
            pageContent: 0,
            // 0: display product, 1: product detail
            // 2: add to cart, 3: show cart, 4: check out
            // 5: sign in

            // user info
            signin: false,
            username: '',
            totalnum: 0,
            inCart: false,
            cart: [],
            price: 0,

            // products info list 
            products: [],

            // individual product info
            productId: '',
            productImage: '',
            productName: '',
            productPrice: 0,
            quantity: 1,
        }

        // ajax
        this.fetchProduct = this.fetchProduct.bind(this);
        this.getSessionInfo = this.getSessionInfo.bind(this);
        this.getSignout = this.getSignout.bind(this);

        // set state
        this.setPageContent = this.setPageContent.bind(this);
        this.setProductDetail = this.setProductDetail.bind(this);
        this.setQuantity = this.setQuantity.bind(this);
        this.setTotalnum = this.setTotalnum.bind(this);
        this.setInCart = this.setInCart.bind(this);
        this.setUserInfo = this.setUserInfo.bind(this);
        this.setCart = this.setCart.bind(this);
        this.setPrice = this.setPrice.bind(this);
    }

    // get required product info with 'GET' request
    fetchProduct(category, searchstring) {
        $.ajax({
            xhrFields: { withCredentials: true },
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/loadpage?category=' + category + '&searchstring=' + searchstring,
            success: function (result) {
                this.setState({
                    products: result.products,
                    pageContent: 0 // whenever fetch product --> initial/search page
                })
            }.bind(this)
        })
    }

    // get cookie info with 'GET' request
    getSessionInfo() {
        $.ajax({
            xhrFields: { withCredentials: true },
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/getsessioninfo',
            success: function (result) {
                this.setState({
                    signin: result.signin,
                    username: result.username,
                    totalnum: result.totalnum
                })
            }.bind(this)
        })
    }

    // signout & clear cookie by 'GET' request
    getSignout() {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'GET',
            url: 'http://localhost:3001/signout',
            success: function (result) {
                this.setState({
                    signin: false,
                    username: '',
                    totalnum: ''
                })
            }.bind(this)
        })
    }

    // set user info (signin or not, username, num of item in cart)
    setUserInfo(bool, username, totalnum) {
        this.setState({
            signin: bool,
            username: username,
            totalnum: totalnum,
        })
    }

    // set what page to display
    setPageContent(num) {
        this.setState({
            pageContent: num
        })
    }

    // set current product detail --> for product detail page
    setProductDetail(id, image, name, price) {
        this.setState({
            productId: id,
            productImage: image,
            productName: name,
            productPrice: price,
        })
    }

    // set where to go after sigin 
    setInCart(bool) {
        this.setState({
            inCart: bool
        })
    }

    // set quantity of product to add to cart
    setQuantity(num) {
        this.setState({
            quantity: num
        })
    }

    // set num of item in cart
    setTotalnum(num) {
        this.setState({
            totalnum: num
        })
    }

    // set cart array
    setCart(array) {
        this.setState({
            cart: array
        })
    }

    // set total price
    setPrice(num) {
        this.setState({
            price: num
        })
    }

    // automatically fetch product & get cookie info when mounted
    componentDidMount() {
        this.fetchProduct('', '');
        this.getSessionInfo();
    }



    render() {
        var page = null;
        // conditional rendering for different page
        if (this.state.pageContent === 1) {
            page =
                <div>
                    <NavBar
                        signin={this.state.signin}
                        username={this.state.username}
                        totalnum={this.state.totalnum}
                        fetchProduct={this.fetchProduct}
                        setPageContent={this.setPageContent}
                        getSignout={this.getSignout}
                    />
                    <ProductDetail
                        id={this.state.productId}
                        image={this.state.productImage}
                        name={this.state.productName}
                        price={this.state.productPrice}
                        totalnum={this.props.totalnum}
                        quantity={this.state.quantity}
                        setPageContent={this.setPageContent}
                        setInCart={this.setInCart}
                        signin={this.state.signin}
                        setQuantity={this.setQuantity}

                    />
                </div>
        }
        else if (this.state.pageContent === 2) {
            page =
                <div>
                    <NavBar
                        signin={this.state.signin}
                        username={this.state.username}
                        totalnum={this.state.totalnum}
                        fetchProduct={this.fetchProduct}
                        setPageContent={this.setPageContent}
                        getSignout={this.getSignout}
                    />
                    <AddToCart
                        image={this.state.productImage}
                        setPageContent={this.setPageContent}
                        fetchProduct={this.fetchProduct}
                        productId={this.state.productId}
                        quantity={this.state.quantity}
                        setTotalnum={this.setTotalnum}
                    />
                </div>
        }
        else if (this.state.pageContent === 3) {
            page =
                <div>
                    <NavBar
                        signin={this.state.signin}
                        username={this.state.username}
                        totalnum={this.state.totalnum}
                        fetchProduct={this.fetchProduct}
                        setPageContent={this.setPageContent}
                        getSignout={this.getSignout}
                    />
                    <ShowCart
                        cart={this.state.cart}
                        totalnum={this.state.totalnum}
                        price={this.state.price}
                        setCart={this.setCart}
                        setTotalnum={this.setTotalnum}
                        setPageContent={this.setPageContent}
                        setPrice={this.setPrice}
                    />
                </div>
        }
        else if (this.state.pageContent === 4) {
            page =
                <div>
                    <NavBar
                        signin={this.state.signin}
                        username={this.state.username}
                        totalnum={this.state.totalnum}
                        fetchProduct={this.fetchProduct}
                        setPageContent={this.setPageContent}
                        getSignout={this.getSignout}
                    />
                    <CheckOut
                        totalnum={this.state.totalnum}
                        price={this.state.price}
                        setPageContent={this.setPageContent}
                        fetchProduct={this.fetchProduct}
                        setTotalnum={this.setTotalnum}
                    />
                </div>
        }
        else if (this.state.pageContent === 5) {
            page =
                <div>
                    <SignIn
                        setUserInfo={this.setUserInfo}
                        setPageContent={this.setPageContent}
                        setInCar={this.setInCart}
                        inCart={this.state.inCart}
                    />
                </div>
        }
        else {
            page =
                <div>
                    <NavBar
                        signin={this.state.signin}
                        username={this.state.username}
                        totalnum={this.state.totalnum}
                        fetchProduct={this.fetchProduct}
                        setPageContent={this.setPageContent}
                        getSignout={this.getSignout}
                    />
                    <DisplayProduct
                        products={this.state.products}
                        setPageContent={this.setPageContent}
                        setProductDetail={this.setProductDetail}
                    />
                </div>
        }


        return (
            <React.Fragment>
                <div className='header'>
                    <h1> iShop </h1>
                </div>

                {page}

            </React.Fragment>
        )
    }

}

export default ShoppingApp;
