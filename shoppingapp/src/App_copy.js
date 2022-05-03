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
                    signin={props.signin}
                    username={props.username}
                    totalnum={props.totalnum}
                    products={props.products}
                    fetchProduct={props.fetchProduct}
                />
            </div>
            <div className='nav-signin'>
                <SignInOut
                    signin={props.signin}
                    username={props.username}
                    totalnum={props.totalnum}
                    signinPage={props.signinPage}
                />
            </div>
        </nav>
    );
}

class SearchBar extends React.Component { // NOT working
    constructor(props) {
        super(props);

        this.state = {
            search: false,
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
        console.log(this.state.category, this.state.searchstring)
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

class SignInOut extends React.Component {
    constructor(props) {
        super(props);

        this.signout = this.signout.bind(this);
    }

    signout() {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: 'GET',
            url: 'http://localhost:3001/signout',
            sucess: function (result) {
                this.setState({
                    signin: true
                })
            }.bind(this)
        })
    }
    // signin/out won't change unless reload
    render() {
        if (this.props.signin) {
            return (
                <div>
                    <p>icon of shopping cart</p>
                    <p> {this.props.totalnum} in Cart</p>
                    <p>Hello, {this.props.username}</p>
                    <a href='#' onClick={this.signout}>Sign out</a>
                </div>
            )
        }
        else {
            return (
                <div>
                    <a href='#' onClick={(e) => this.props.signinPage(true, e)}>Sign In</a>
                </div>
            )
        }
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
        this.state = {
            select: false,
            id: '',
            image: '',
            name: '',
            price: 0,
        }

        this.select = this.select.bind(this);
    }

    select(id) {
        this.setState({
            select: true,
            id: id,
        });

        for (let i = 0; i < this.props.products.length; i++) {
            if (this.props.products[i]._id === id) {
                this.setState({
                    image: '../../productservice/public/' + this.props.products[i].productImage,
                    name: this.props.products[i].name,
                    price: this.props.products[i].price
                })
            }
        }

    }


    render() {
        console.log(this.props.products)
        console.log(this.state.select)
        if (this.state.select) {
            return (
                <ProductDetail
                    id={this.state.id}
                    image={this.state.image}
                    name={this.state.name}
                    price={this.state.price}
                    products={this.props.products}
                    signin={this.props.signin}
                    fetchProduct={this.props.fetchProduct}
                    setTotalnum={this.props.setTotalnum}
                />
            )

        }
        else {
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
}




class ProductDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 1,
            addtocart: false,
            back: false,
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
        this.setState({
            addtocart: true
        })
    }

    back() {
        this.setState({
            back: true
        })
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
        console.log(this.props.products)
        console.log(this.state.back)
        if (this.state.back) {
            return (
                <DisplayProduct
                    signin={this.props.signin}
                    products={this.props.products}
                    fetchProduct={this.props.fetchProduct}
                    setTotalnum={this.props.setTotalnum}
                />
            )
        }
        else if (this.state.addtocart) {
            if (this.props.signin) {
                return (
                    <AddToCart
                        productId={this.props.id}
                        quantity={this.state.quantity}
                        image={this.props.image}
                        signin={this.props.signin}
                        fetchProduct={this.props.fetchProduct}
                        setTotalnum={this.props.setTotalnum}
                    />
                )

            }
            else {
                return (
                    <SignIn
                        fetchProduct={this.props.fetchProduct}
                        setTotalnum={this.props.setTotalnum}
                    />
                )
            }
        }
        else {

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
                    console.log(result)
                    if (result.message.length > 0) {
                        alert(result.message)
                    }
                    else {
                        this.setState({
                            signin: true
                        })
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
        if (this.state.signin) {
            return (
                <DisplayProduct
                    signin={this.props.signin}
                    products={this.props.products}
                    fetchProduct={this.props.fetchProduct}
                    setTotalnum={this.props.setTotalnum}
                />
            )

        }
        else {

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
}

class AddToCart extends React.Component {
    constructor(props) {
        super(props);

        this.postAddToCart = this.postAddToCart.bind(this);
    }

    postAddToCart() {
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
                this.props.setTotalnum(result.totalnum)
            }.bind(this)
        })
    }


    componentDidMount() {
        this.postAddToCart()
    }

    render() {
        return (
            <div className='content addtocart'>
                <img className='addtocart image' src={this.props.image} alt={this.props.image} />
                <p className='addtocart sucess'>&#10003 Added to Cart</p>
                <a href='#'>{'continue browsing>'}</a>
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





class ShoppingApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signinpage: false,
            products: [],
            category: '',
            searchstring: '',
            signin: false,
            username: '',
            totalnum: 0
        }

        this.fetchProduct = this.fetchProduct.bind(this);
        this.getSessionInfo = this.getSessionInfo.bind(this);
        this.signinPage = this.signinPage.bind(this);
        this.setTotalnum = this.setTotalnum.bind(this);
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
                })
                console.log(this.state.products)
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

    signinPage(val) {
        this.setState({
            signinpage: val
        })
    }

    setTotalnum(num) {
        this.setState({
            totalnum: num
        })
    }

    componentDidMount() {
        this.fetchProduct('', '');
        this.getSessionInfo();

    }


    render() {
        console.log(this.state.signin, this.state.username);
        console.log(this.state.signinpage);
        var body;
        if (this.state.signinpage) {
            body = <SignIn
                products={this.state.products}
            />;
        }
        else {
            body = <DisplayProduct
                signin={this.state.signin}
                products={this.state.products}
                fetchProduct={this.fetchProduct}
                setTotalnum={this.setTotalnum}
            />;

        }

        return (
            <React.Fragment>
                <h1> iShop </h1>
                <NavBar
                    signin={this.state.signin}
                    username={this.state.username}
                    totalnum={this.state.totalnum}
                    products={this.state.products}
                    fetchProduct={this.fetchProduct}
                    signinPage={this.signinPage}
                />
                {body}
            </React.Fragment>
        )
    }

}

export default ShoppingApp;
