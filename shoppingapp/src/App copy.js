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
                    setCategory={props.setCategory}
                    setSearchstring={props.setSearchstring}
                />
            </div>
            <div className='nav-signin'>
                <SignInOut
                    signin={props.signin}
                    username={props.username}
                    totalnum={props.totalnum}
                    setPageContent={props.setPageContent}
                />
            </div>
        </nav>
    );
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
    }

    search() {

    }

    render() {
        return (
            <form className='searchBar'>
                <select id='category' defaultValue={{ value: '' }}>
                    <option value=''>All</option>
                    <option value='Phones'>Phones</option>
                    <option value='Tablets'>Tablets</option>
                    <option value='Laptops'>Laptops</option>
                </select>
                <input type='text' id='searchstring' />
                {/* <button onClick={ }>&#x1F50D</button> */}
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
                    {/* <a href='#' onClick={this.props.setPageContent(5)}>Sign In</a> */}
                </div>
            )
        }
    }
}


function DisplayProduct(props) {
    console.log(2)
    console.log(props.products)
    // console.log(props.products.type)
    // const products = props.products;
    // console.log(products[0])
    if (props.products) {
        return (
            <div>
                {
                    props.products.map((product => {
                        return (
                            <div className='individual_product'>
                                <img src={product.productImage} alt='' className='small_product_image' />
                                <p>{product.name}</p>
                                <p>${product.price}</p>
                            </div>
                        )
                    }))
                }
                <p>asda</p>
            </div>
        )
    }
    else {
        return (<p>sdhfgvk</p>)
    }


}

class ProductDetail extends React.Component {
    render() {
        return (
            <p>ProductDetail</p>
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

class PageContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let page = null;
        if (this.props.pageContent === 0) {
            page =
                <div>
                    <NavBar
                        signin={this.props.signin}
                        username={this.props.username}
                        totalnum={this.props.totalnum}
                        fetchProduct={this.props.fetchProduct}
                        setCategory={this.props.setCategory}
                        setSearchstring={this.props.setSearchstring}
                        setPageContent={this.props.setPageContent}
                    />
                    <DisplayProduct
                        products={this.props.products}
                        setProductId={this.props.setProductId}
                        setPageContent={this.props.setPageContent}
                        fetchProduct={this.props.fetchProduct}
                    />
                </div>

        }
        else if (this.props.pageContent === 1) {
            page =
                <div>
                    <NavBar
                        signin={this.props.signin}
                        username={this.props.username}
                        totalnum={this.props.totalnum}
                        fetchProduct={this.props.fetchProduct}
                        setCategory={this.props.setCategory}
                        setSearchstring={this.props.setSearchstring}
                        setPageContent={this.props.setPageContent}
                    />
                    <ProductDetail />
                </div>
        }
        else if (this.props.pageContent === 2) {
            page =
                <div>
                    <NavBar
                        signin={this.props.signin}
                        username={this.props.username}
                        totalnum={this.props.totalnum}
                        fetchProduct={this.props.fetchProduct}
                        setCategory={this.props.setCategory}
                        setSearchstring={this.props.setSearchstring}
                        setPageContent={this.props.setPageContent}
                    />
                    <AddToCart />
                </div>
        }
        else if (this.props.pageContent === 3) {
            page =
                <div>
                    <NavBar
                        signin={this.props.signin}
                        username={this.props.username}
                        totalnum={this.props.totalnum}
                        fetchProduct={this.props.fetchProduct}
                        setCategory={this.props.setCategory}
                        setSearchstring={this.props.setSearchstring}
                        setPageContent={this.props.setPageContent}
                    />
                    <ShowCart />
                </div>
        }
        else if (this.props.pageContent === 4) {
            page =
                <div>
                    <NavBar
                        signin={this.props.signin}
                        username={this.props.username}
                        totalnum={this.props.totalnum}
                        fetchProduct={this.props.fetchProduct}
                        setCategory={this.props.setCategory}
                        setSearchstring={this.props.setSearchstring}
                        setPageContent={this.props.setPageContent}
                    />
                    <CheckOut />
                </div>
        }
        else if (this.props.pageContent === 5) {
            page =
                <div>
                    <SignIn />
                </div>
        }
        return (page)
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
            signin: false,
            username: '',
            totalnum: 0,
            category: '',
            searchstring: '',
            products: [],
            id: ''
        }

        this.fetchProduct = this.fetchProduct.bind(this);
        this.getSessionInfo = this.getSessionInfo.bind(this);
    }

    fetchProduct() {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: 'http://localhost:3001/loadpage?category=' + this.state.category + '&searchstring=' + this.state.searchstring,
            success: function (result) {
                this.setState({
                    products: result.products,
                    pageContent: 0
                })
                console.log('sucess')
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

    setPageContent(num) {
        this.setState({
            pageContent: num
        })
    }

    setCategory(category) {
        this.setState({
            category: category
        })
    }

    setSearchstring(searchstring) {
        this.setState({
            searchstring: searchstring
        })
    }

    setProductId(id) {
        this.setState({
            id: id
        })
    }

    componentDidMount() {
        this.fetchProduct();
        console.log(1)
        console.log(this.state.products)
        //this.getSessionInfo();
    }


    render() {

        return (
            <React.Fragment>
                <h1> iShop </h1>
                <PageContent
                    pageContent={this.state.pageContent}
                    category={this.state.category}
                    searchstring={this.state.searchstring}
                    products={this.state.products}
                    fetchProduct={this.fetchProduct}
                    getSessionInfo={this.getSessionInfo}
                    setPageContent={this.setPageContent}
                    setCategory={this.setCategory}
                    setSearchstring={this.setSearchstring}
                    setProductId={this.setProductId}
                />
            </React.Fragment>
        )
    }

}

export default ShoppingApp;
