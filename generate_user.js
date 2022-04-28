// mongo complete_path

var conn = new Mongo();

var db = conn.getDB("assignment2");

var user_username = ['Jack', 'Ann', 'Alex'];
var user_password = ['Jackpw', 'Annpw', 'Alexpw'];
var user_cart = [[{ 'productId': '6269637becc70af1ff06e935', 'quantity': 1 }], [{ 'productId': '626a305a79a886d89177f0e0', 'quantity': 3 }, { 'productId': '626a305a79a886d89177f0e6', 'quantity': 1 }], [{ 'productId': '626a305a79a886d89177f0eb', 'quantity': 2 }, { 'productId': '626a305a79a886d89177f0ed', 'quantity': 1 }, { 'productId': '626a305a79a886d89177f0f2', 'quantity': 2 }]];
var user_totalnum = [1, 4, 5];

db.userCollection.remove({});

for (let i = 0; i < user_username.length; i++) {
    db.userCollection.insert(
        {
            'username': user_username[i],
            'password': user_password[i],
            'cart': user_cart[i],
            'totalnum': user_totalnum[i],
        },
    )
}