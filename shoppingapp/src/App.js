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
                <button onClick={(e) => this.props.fetchProduct(this.state.category, this.state.searchstring, e)}>&#x1F50D</button>
            </form>
        )
    }
}

class SignInOut extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.signin) {
            return (
                <div>
                    <p>icon of shopping cart</p>
                    <p> {this.props.totalnum} in Cart</p>
                    <p>Hello, {this.props.username}</p>
                    <a href='http://localhost:3001/signout'>Sign out</a>
                </div>
            )
        }
        else {
            return (
                <div>
                    <a href='#'>Sign In</a>
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
            manufacture: '', // NOT working 
            description: '', // NOT working
        }

        this.select = this.select.bind(this);
        this.getDetail = this.getDetail.bind(this);
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

        this.getDetail()
        console.log(this.state.manufacture)

    }

    getDetail() {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/loadproduct/' + this.state.id,
            success: function (result) {
                this.setState({
                    manufacture: result.manufacture,
                    description: result.description
                })
                console.log('a')
            }.bind(this)
        })
    }


    render() {
        if (this.state.select) {
            return (
                <ProductDetail
                    id={this.state.id}
                    image={this.state.image}
                    name={this.state.name}
                    price={this.state.price}
                    manufacture={this.state.manufacture}
                    description={this.state.description}
                />
            )

        }
        else {
            return (
                <div>
                    {
                        this.props.products.map((product => {
                            return <ProductBox
                                image={product.productImage}
                                name={product.name}
                                price={product.price}
                                key={product._id}
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
        }

        this.addToCart = this.addToCart.bind(this);
        this.back = this.back.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
    }


    addToCart() {

    }

    back() {

    }

    handleQuantityChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({ quantity: value });
    }

    render() {
        console.log(this.props.id)
        console.log(this.props.image)
        console.log(this.props.name)
        console.log(this.props.manufacture)
        console.log(this.props.description)
        return (
            <div className='product'>
                <img src={this.props.image} alt='' className='product image' />
                <div className='product info'>
                    <p className='product name'>{this.props.name}</p>
                    <p className='product price'>{this.props.price}</p>
                    <p className='product manufacture'>{this.props.manufacture}</p>
                    <p className='product description'>{this.props.description}</p>
                </div>
                <form className='product addtocart'>
                    Quantity:
                    <input type='number' id='product_quantity' name='quantity' value={this.state.quantity} onChange={this.handleQuantityChange} min="1" max="5" />
                    <button onClick={this.addToCart}>Add to Cart</button>
                </form>
                <a className='back' href='#' onClick={this.back}>{'< go back'}</a>
            </div>
        )
    }
}

class AddToCart extends React.Component {
    render() {
        return (
            <p>AddToCart</p>
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
    render() {
        return (
            <p>SignIn</p>
        )
    }
}



class ShoppingApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            category: '',
            searchstring: '',
            signin: false,
            username: '',
            totalnum: 0
        }

        this.fetchProduct = this.fetchProduct.bind(this);
        this.getSessionInfo = this.getSessionInfo.bind(this);
    }

    fetchProduct(category, searchstring) {
        $.ajax({
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

    componentDidMount() {
        this.fetchProduct('', '');
        this.getSessionInfo();
    }


    render() {

        return (
            <React.Fragment>
                <h1> iShop </h1>
                <NavBar
                    signin={this.state.signin}
                    username={this.state.username}
                    totalnum={this.state.totalnum}
                    fetchProduct={this.fetchProduct}
                />
                <DisplayProduct
                    products={this.state.products}
                />
            </React.Fragment>
        )
    }

}

export default ShoppingApp;
