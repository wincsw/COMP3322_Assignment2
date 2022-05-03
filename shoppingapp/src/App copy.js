import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import React from 'react';

function NavBar(props) {
    return (
        <nav>
            <div className='nav-category'>
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
            <div className='nav-searchBar'>
                <SearchBar
                    fetchProduct={props.fetchProduct}
                />
            </div>
            <div className='nav-signin'>
                <SignInOut
                    signin={props.signin}
                    username={props.username}
                    totalnum={props.totalnum}
                    setPageContent={props.setPageContent}
                    signout={props.signout}
                />
            </div>
        </nav>
    );
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            category: '',
            searchstring: '',
        }

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSearchstringChange = this.handleSearchstringChange.bind(this);
        this.search = this.search.bind(this);
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

    search() {
        this.props.fetchProduct(this.state.category, this.state.searchstring);
    }

    render() {
        return (
            <form className='searchBar'>
                <select id='category' value={this.state.category} name='category' onChange={this.handleCategoryChange}>
                    <option value=''>All</option>
                    <option value='Phones'>Phones</option>
                    <option value='Tablets'>Tablets</option>
                    <option value='Laptops'>Laptops</option>
                </select>
                <input type='text' id='searchstring' name='searchstring' value={this.state.searchstring} onChange={this.handleSearchstringChange} />
                <button onClick={this.search}>&#x1F50D</button>
            </form>

        )


    }
}

function SignInOut(props) {

    if (props.signin) {
        return (
            <div>
                <p>icon of shopping cart</p>
                <p> {props.totalnum} in Cart</p>
                <p>Hello, {props.username}</p>
                <a href='#' onClick={(e) => props.signout(e)}>Sign out</a>
            </div>
        )
    }
    else {
        return (
            <div>
                <a href='#' onClick={(e) => props.setPageContent(5, e)}>Sign In</a>
            </div>
        )
    }

}

function ProductBox(props) {
    const image = '../../productservice/public/' + props.image
    return (
        <div className='productBox'>
            <img src={image} alt={image} onClick={(e) => props.select(props.id, e)} />
            <a href='#' onClick={(e) => props.select(props.id, e)}>{props.name}</a>
            <p>${props.price}</p>
            <p>{props.id}</p>
        </div>
    )

}
class DisplayProduct extends React.Component {
    constructor(props) {
        super(props);

        this.select = this.select.bind(this);
    }

    select(id) {

        for (let i = 0; i < this.props.products.length; i++) {
            if (this.props.products[i]._id === id) {
                this.props.setProductDetail(
                    id,
                    '../../productservice/public/' + this.props.products[i].productImage,
                    this.props.products[i].name,
                    this.props.products[i].price
                )
            }
        }

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

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 1,
            manufacturer: '',
            description: ''
        }

        this.addToCart = this.addToCart.bind(this);
        this.back = this.back.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.getDetail = this.getDetail.bind(this)
    }

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
                console.log(result.manufacture, result.description)
            }.bind(this)
        })
    }


    addToCart() {
        if (this.props.signin) {
            this.props.postAddToCart(this.state.quantity);
            this.props.setPageContent(2);
        }
        else {
            this.props.setInCart(true);
            this.props.setPageContent(5);
        }

    }

    back() {
        this.props.setPageContent(0);
    }

    handleQuantityChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({ quantity: value });
    }

    componentDidMount() {
        this.getDetail();
    }

    render() {
        return (
            <div className='content product'>
                <img src={this.props.image} alt={this.props.image} className='product image' />
                <div className='product info'>
                    <p className='product name'>{this.props.name}</p>
                    <p className='product price'>{this.props.price}</p>
                    <p className='product manufacturer'>{this.state.manufacturer}</p>
                    <p className='product description'>{this.state.description}</p>
                </div>
                <form className='product addtocart'>
                    Quantity:
                    <input type='number' id='product_quantity' name='quantity' value={this.state.quantity} onChange={this.handleQuantityChange} min="1" max="5" />
                    <button onClick={this.addToCart}>Add to Cart</button>
                </form>
                <a className='back' href='#' onClick={(e) => this.back(e)}>{'< go back'}</a>
            </div>
        )
    }

}


class AddToCart extends React.Component {
    constructor(props) {
        super(props);

        this.back = this.back.bind(this);
    }

    back() {
        this.props.fetchProduct('', '');
        this.props.setPageContent(0);
    }

    render() {
        return (
            <div className='content addtocart'>
                <img className='addtocart image' src={this.props.image} alt={this.props.image} />
                <p className='addtocart sucess'>&#10003 Added to Cart</p>
                <a href='#' onClick={this.back}>{'continue browsing>'}</a>
            </div>
        )
    }
}

class ShowCart extends React.Component {
    render() {
        return (
            <p>ShowCart</p>
        )
    }
}


class CheckOut extends React.Component {
    render() {
        return (
            <p>CheckOut</p>
        )
    }
}

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            signin: false
        }

        this.postSignin = this.postSignin.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    // CANNOT make unsucessful login stay in login page --> change to initial page right after alerts
    postSignin() {
        if (this.state.username.length === 0 || this.state.password.length === 0) {
            alert('You must enter username and password')
        }
        else {
            $.post({
                xhrFields: { withCredentials: true },
                url: 'http://localhost:3001/signin',
                data: {
                    username: this.state.username,
                    password: this.state.password
                },
                success: function (result) {
                    if (result.message === 0) {
                        this.props.setUserInfo(
                            true,
                            this.state.username,
                            this.state.password
                        )
                        if (this.props.inCart) {
                            this.props.setPageContent(2);
                        }
                        else {
                            this.props.setPageContent(0);
                        }
                    }
                    else {
                        alert(result.message)
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
                <form className='signin'>
                    Username:
                    <input type='text' id='username' name='username' value={this.state.username} onChange={this.handleUsernameChange} />
                    Password:
                    <input type='password' id='password' name='password' value={this.state.password} onChange={this.handlePasswordChange} />
                    <button onClick={this.postSignin}>Sign in</button>
                </form>
            </div>

        )
    }


}


class ShoppingApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageContent: 0,
            // 0: display product, 1: product detail
            // 2: add to cart, 3: show cart, 4: check out
            // 5: sign in

            // user info
            signin: false,
            username: '',
            totalnum: 0,
            inCart: false,

            // products info list
            products: [],
            allProducts: [],

            // individual product info
            productId: '',
            productImage: '',
            productName: '',
            productPrice: 0,

        }

        this.fetchProduct = this.fetchProduct.bind(this);
        this.getSessionInfo = this.getSessionInfo.bind(this);
        this.signout = this.signout.bind(this);
        this.setPageContent = this.setPageContent.bind(this);
        this.setProductDetail = this.setProductDetail.bind(this);
        this.postAddToCart = this.postAddToCart.bind(this)
    }

    fetchProduct(category, searchstring) {
        $.ajax({
            xhrFields: { withCredentials: true },
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/loadpage?category=' + category + '&searchstring=' + searchstring,
            success: function (result) {
                this.setState({
                    products: result.products,
                    pageContent: 0
                })
                if (this.state.allProducts.length === 0) {
                    this.setState({
                        allProducts: result.products
                    })
                }
                console.log('sucess')
            }.bind(this)
        })
    }

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

    signout() {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'GET',
            url: 'http://localhost:3001/signout',
            sucess: function (result) {
                this.setState({
                    signin: false,
                    username: '',
                    totalnum: ''
                })
                this.fetchProduct('', '');
                this.setPageContent(0)
            }.bind(this)
        })
    }

    postAddToCart(quantity) {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'PUT',
            dataType: 'json',
            url: 'http://localhost:3001/addtocart',
            data: {
                productId: this.state.productId,
                quantity: quantity
            },
            success: function (result) {
                this.setState({
                    totalnum: result.totalnum
                })
            }.bind(this)
        })
    }

    setPageContent(num) {
        this.setState({
            pageContent: num
        })
    }


    setProductDetail(id, image, name, price) {
        this.setState({
            productId: id,
            productImage: image,
            productName: name,
            productPrice: price,
        })
    }

    setInCart(bool) {
        this.setState({
            inCart: bool
        })
    }

    setUserInfo(bool, username, totalnum) {
        this.setState({
            signin: bool,
            username: username,
            totalnum: totalnum
        })
    }

    componentDidMount() {
        this.fetchProduct('', '');
        this.getSessionInfo();
    }


    render() {
        var page = null;
        if (this.state.pageContent === 1) {
            page =
                <div>
                    <NavBar
                        signin={this.state.signin}
                        username={this.state.username}
                        totalnum={this.props.totalnum}
                        fetchProduct={this.fetchProduct}
                        setPageContent={this.setPageContent}
                        signout={this.signout}
                    />
                    <ProductDetail
                        id={this.state.productId}
                        image={this.state.productImage}
                        name={this.state.productName}
                        price={this.state.productPrice}
                        setPageContent={this.setPageContent}
                        postAddToCart={this.postAddToCart}
                        setInCart={this.setInCart}
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
                        signout={this.signout}
                    />
                    <AddToCart
                        image={this.state.productImage}
                        setPageContent={this.setPageContent}
                        fetchProduct={this.fetchProduct}
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
                        signout={this.signout}
                    />
                    <ShowCart />
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
                        signout={this.signout}
                    />
                    <CheckOut />
                </div>
        }
        else if (this.state.pageContent === 5) {
            page =
                <div>
                    <SignIn
                        setUserInfo={this.setUserInfo}
                        setPageContent={this.setPageContent}
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
                        signout={this.signout}
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
                <h1> iShop </h1>
                {page}
            </React.Fragment>
        )
    }

}

export default ShoppingApp;
