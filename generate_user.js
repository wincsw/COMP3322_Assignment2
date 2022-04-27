// mongo complete_path

var conn = new Mongo();

var db = conn.getDB("assignment2");

var user_username = ['Jack', 'Ann', 'Alex'];
var user_password = ['Jackpw', 'Annpw', 'Alexpw'];
var user_cart = [[{ 'productId': '6269637becc70af1ff06e935', 'quantity': 1 }], [{ 'productId': '6269637becc70af1ff06e937', 'quantity': 3 }, { 'productId': '6269637becc70af1ff06e93d', 'quantity': 1 }], [{ 'productId': '6269637becc70af1ff06e945', 'quantity': 2 }, { 'productId': '6269637becc70af1ff06e943', 'quantity': 1 }, { 'productId': '6269637becc70af1ff06e93b', 'quantity': 2 }]];
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