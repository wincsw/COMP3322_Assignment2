// mongo complete_path

var conn = new Mongo();

var db = conn.getDB("assignment2");

var product_name = ["iPhone 13", "iPhone 13 Pro", "iPhone SE", "iPhone 12", "iPad Air", "iPad Pro", "iPad", "iPad Mini", "MacBook Pro 16''", "MacBook Pro 14''", "MacBook Pro 13''", "MacBook Air", "Galaxy S22 Ultra", "Galaxy A53", "Galaxy S21 FE", "Galaxy Z Fold3", "Galaxy Tab S7 FE", "Galaxy Tab S7+", "Galaxy Tab S8", "Galaxy Tab S8 Ultra", "Galaxy Book2 Pro 360", "Galaxy Book2 Pro", "Galaxy Book Ion2", "Galaxy Book Flex2"];
var product_category = ["Phones", "Phones", "Phones", "Phones", "Tablets", "Tablets", "Tablets", "Tablets", "Laptops", "Laptops", "Laptops", "Laptops", "Phones", "Phones", "Phones", "Phones", "Tablets", "Tablets", "Tablets", "Tablets", "Laptops", "Laptops", "Laptops", "Laptops"];
var product_price = [8000, 8500, 5000, 6000, 6000, 8800, 3800, 5200, 20000, 16000, 11000, 10000, 11000, 4000, 5000, 15000, 5200, 6000, 5500, 12000, 13000, 11000, 9000, 15000];
var product_manufacturer = ["Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Apple Inc.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd.", "Samsung Ltd."];
var product_productImage = ["images/iPhone13.png", "images/iPhone13Pro.png", "images/iPhoneSE.png", "images/iPhone12.jpeg", "images/iPadAir.jpeg", "images/iPadPro.jpeg", "images/iPad.jpeg", "images/iPadMini.jpeg", "images/MacBookPro16.jpeg", "images/MacBookPro14.jpeg", "images/MacBookPro13.jpeg", "images/MacBookAir.jpeg", "images/GalaxyS22Ultra.jpg", "images/GalaxyA53.jpg", "images/GalaxyS21FE.jpg", "images/GalaxyZFold3.jpg", "images/GalaxyTabS7FE.jpeg", "images/GalaxyTabS7+.jpeg", "images/GalaxyTabS8.jpg", "images/GalaxyTabS8Ultra.jpg", "images/GalaxyBook2Pro360.jpg", "images/GalaxyBook2Pro.jpg", "images/GalaxyBookIon2.jpeg", "images/GalaxyBookFlex2.jpg"];
var product_description = ["Most advanced dual camera system ever.", "The world's fastest smartphone chip.", "Serious Power. Serious value.", "The outdated iPhone...", "Powerful. Colorful. Wonderful.", "The ultimate iPad experience.", "Powerful. Easy to use. Versatile. The new iPad is designed for all the things you love to do.", "The magic of iPad. In the palm of your hand.", "The most powerful MacBook Pro ever is here.", "The most powerful MacBook Pro ever is here.", "The Apple M1 chip gives the 13-inch MacBook Pro speed and power beyond belief.", "Our thinnest, lightest notebook, completely transformed by the Apple M1 chip.", "Discover the phones bringing epic to your everyday.", "Fast. To the point of innovation", "We took what you love most and built the ultimate fan-inspired phone so you can experience your everyday passions to the absolute fullest.", "Get ready to unfold your world. This is everything you'd want in a premium, durable, 5G smartphone.", "Enjoy the sleekness of the Galaxy Tab S7 FE in your hands.", "The most advanced Galaxy Tab changes how you work and play ", "The largest Samsung Galaxy Tab S.", "The new epic standard for tablets", "360 degrees of thin and stylish 2-in-1 creativity.", "Light. Powerful. Made to move in style.", "Radiant Mystic White Design. Turn heads with a beautiful new design!", "Auto save and sync all your notes across laptop, tablet, and mobile."];

db.productCollection.remove({});

for (let i = 0; i < product_name.length; i++) {
    db.productCollection.insert(
        {
            'name': product_name[i],
            'category': product_category[i],
            'price': product_price[i],
            'manufacturer': product_manufacturer[i],
            'productImage': product_productImage[i],
            'description': product_description[i],
        },
    )
}


