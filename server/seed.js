/**
 * FoodieHub Seed Script
 * Run: npm run seed   (from the server/ directory)
 *
 * Passwords are plain text here — the User model's pre('save') hook
 * hashes them automatically. Do NOT pre-hash or logins will fail.
 */
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from './models/User.js'
import Category from './models/Category.js'
import Food from './models/Food.js'
import Cart from './models/Cart.js'

export const CATEGORIES = [
  {
    name: 'Pizza',
    description: 'Hand-tossed and stone-baked pizzas with gourmet toppings',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=450&fit=crop',
  },
  {
    name: 'Burgers',
    description: 'Juicy handcrafted gourmet burgers and crispy sliders',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
  },
  {
    name: 'Indian',
    description: 'Authentic rich Indian curries, tandoori breads, and clay oven specials',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=450&fit=crop',
  },
  {
    name: 'Chinese',
    description: 'Wok-tossed noodles, fried rice, and sizzling Indo-Chinese appetizers',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=450&fit=crop',
  },
  {
    name: 'Desserts',
    description: 'Indulgent baked cakes, chocolate brownies, and sweet delicacies',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=450&fit=crop',
  },
  {
    name: 'Biryani',
    description: 'Fragrant dum-cooked aged basmati rice layered with rich spices and herbs',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=450&fit=crop',
  },
  {
    name: 'Beverages',
    description: 'Chilled fruit smoothies, milkshakes, fresh juices, and hot brews',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=450&fit=crop',
  },
  {
    name: 'Healthy',
    description: 'Nutritious grain bowls, superfood salads, and fresh fruit bowls',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop',
  },
  {
    name: 'South Indian',
    description: 'Authentic South Indian tiffins, crispy dosas, steamed idlis, and vadas',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=450&fit=crop',
  },
]

export const FOODS = (c) => [
  // ── PIZZA (5 items) ──────────────────────────────────────────────────────────
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with rich San Marzano tomato sauce, fresh buffalo mozzarella, and fragrant aromatic basil on a stone-baked crust.',
    price: 299,
    category: c['Pizza'],
    rating: 4.8,
    numReviews: 142,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 20,
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with premium smoky pepperoni slices, melted mozzarella cheese, and zesty herb tomato sauce on a crispy thin crust.',
    price: 369,
    category: c['Pizza'],
    rating: 4.9,
    numReviews: 128,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 25,
  },
  {
    name: 'Four Cheese Rustic Pizza',
    description: 'Stone-baked Italian pizza smothered in melted mozzarella, sharp cheddar, parmesan, and aromatic fresh rosemary on a golden crust.',
    price: 329,
    category: c['Pizza'],
    rating: 4.6,
    numReviews: 94,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 22,
  },
  {
    name: 'Neapolitan Herb Pizza',
    description: 'Authentic thin-crust Neapolitan pizza layered with ripe tomato passata, melted mozzarella, olive oil, and sweet basil leaves.',
    price: 319,
    category: c['Pizza'],
    rating: 4.5,
    numReviews: 89,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 20,
  },
  {
    name: 'Smoky Sausage & Mushroom Pizza',
    description: 'Crispy crust topped with savory sliced sausage, sliced button mushrooms, black olives, sweet bell peppers, and mozzarella cheese.',
    price: 379,
    category: c['Pizza'],
    rating: 4.7,
    numReviews: 104,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 25,
  },

  // ── BURGERS (7 items) ────────────────────────────────────────────────────────
  {
    name: 'Gourmet Bacon Cheeseburger',
    description: 'Towering handcrafted burger with seared patty, crispy smoked bacon, melted cheddar cheese, and a fried egg inside a toasted brioche bun.',
    price: 299,
    category: c['Burgers'],
    rating: 4.8,
    numReviews: 175,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 20,
  },
  {
    name: 'Double Smash Cheeseburger',
    description: 'Two searingly smashed beef patties with crispy edges, melted American cheddar, dill pickles, onions, and house burger sauce.',
    price: 269,
    category: c['Burgers'],
    rating: 4.9,
    numReviews: 245,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 18,
  },
  {
    name: 'Classic Bacon Burger',
    description: 'Flame-grilled juicy patty layered with crispy bacon strips, melted cheddar, lettuce, vine tomatoes, and signature sauce in a sesame bun.',
    price: 249,
    category: c['Burgers'],
    rating: 4.7,
    numReviews: 168,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: false,
    preparationTime: 16,
  },
  {
    name: 'Avocado Quinoa Veggie Burger',
    description: 'Wholesome toasted quinoa and grain patty topped with smashed avocado, garden tomatoes, and fresh peppery arugula in a warm brioche bun.',
    price: 219,
    category: c['Burgers'],
    rating: 4.6,
    numReviews: 112,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 15,
  },
  {
    name: 'Crispy Fried Chicken Burger & Fries',
    description: 'Golden buttermilk-fried crispy chicken breast fillet with crisp green lettuce and creamy mayo, served with a basket of hot salted fries.',
    price: 239,
    category: c['Burgers'],
    rating: 4.8,
    numReviews: 156,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 18,
  },
  {
    name: 'Artisan Guacamole Burger',
    description: 'Juicy flame-seared patty topped with freshly prepared guacamole, crisp sliced radish, and baby greens on a seeded multigrain bun.',
    price: 279,
    category: c['Burgers'],
    rating: 4.7,
    numReviews: 198,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: false,
    preparationTime: 18,
  },
  {
    name: 'Flame-Grilled Cheeseburger Deluxe',
    description: 'Classic seasoned beef patty grilled to juicy perfection with melted cheddar, ripe sliced tomatoes, crisp lettuce, and onion rings.',
    price: 229,
    category: c['Burgers'],
    rating: 4.6,
    numReviews: 134,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: false,
    preparationTime: 15,
  },

  // ── INDIAN (9 items) ─────────────────────────────────────────────────────────
  {
    name: 'Paneer Butter Masala with Basmati Rice',
    description: 'Soft cottage cheese cubes simmered in a rich, buttery tomato-cashew makhani gravy, served over fragrant long-grain basmati rice.',
    price: 259,
    category: c['Indian'],
    rating: 4.8,
    numReviews: 384,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 22,
  },
  {
    name: 'Chicken Tikka Masala with Garlic Naan',
    description: 'Clay-oven charred spiced chicken pieces cooked in a luscious spiced tomato gravy, paired with warm, freshly baked tandoori garlic naan.',
    price: 289,
    category: c['Indian'],
    rating: 4.9,
    numReviews: 215,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 25,
  },
  {
    name: 'North Indian Thali Platter',
    description: 'Wholesome traditional thali featuring two warm tawa rotis, aromatic yellow lentil dal, homestyle spiced vegetable subzi, pickle, and sweet lassi.',
    price: 199,
    category: c['Indian'],
    rating: 4.6,
    numReviews: 176,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 20,
  },
  {
    name: 'Shahi Paneer Handi',
    description: 'Royal cottage cheese cubes cooked in a silky Mughlai cashew and saffron gravy, served in a traditional handi with cumin-spiced basmati rice.',
    price: 269,
    category: c['Indian'],
    rating: 4.8,
    numReviews: 160,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 25,
  },
  {
    name: 'Kadai Vegetable Handi',
    description: 'Fresh garden vegetables including cauliflower, carrots, and sweet green peas wok-tossed in robust onion-tomato masala with crushed kadai spices.',
    price: 239,
    category: c['Indian'],
    rating: 4.5,
    numReviews: 138,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 22,
  },
  {
    name: 'Homestyle Butter Chicken',
    description: 'Tender boneless chicken morsels slow-simmered in a rich, buttery tomato sauce with aromatic garam masala and finished with fresh cream.',
    price: 289,
    category: c['Indian'],
    rating: 4.9,
    numReviews: 240,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 25,
  },
  {
    name: 'Sizzling Tandoori Paneer Tikka',
    description: 'Fresh cottage cheese cubes marinated in tandoori spices and yogurt, skewered and flame-charred, served sizzling with grilled onions and lemon.',
    price: 249,
    category: c['Indian'],
    rating: 4.7,
    numReviews: 185,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 20,
  },
  {
    name: 'Crispy Punjabi Samosas (3 pcs)',
    description: 'Three crispy golden-flaky pastries stuffed with spiced potatoes, green peas, and whole coriander seeds, served with tangy tamarind and mint chutneys.',
    price: 99,
    category: c['Indian'],
    rating: 4.7,
    numReviews: 140,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 12,
  },
  {
    name: 'Mumbai Pav Bhaji Platter',
    description: 'Famous street food feast: spiced mashed vegetable curry cooked with Mumbai bhaji masala and a dollop of butter, served with toasted buttered pav buns.',
    price: 159,
    category: c['Indian'],
    rating: 4.8,
    numReviews: 285,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 18,
  },

  // ── BIRYANI (4 items) ────────────────────────────────────────────────────────
  {
    name: 'Hyderabadi Dum Biryani',
    description: 'Authentic kacchi dum biryani layered with marinated chicken, saffron-infused basmati rice, caramelized onions, and fresh mint, served with spicy salan.',
    price: 279,
    category: c['Biryani'],
    rating: 4.9,
    numReviews: 480,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 35,
  },
  {
    name: 'Mutton Dum Biryani',
    description: 'Royal slow-cooked biryani with tender bone-in mutton pieces, fragrant aged basmati rice, fried shallots, and fresh mint, garnished with cucumber.',
    price: 349,
    category: c['Biryani'],
    rating: 4.8,
    numReviews: 310,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 40,
  },
  {
    name: 'Special Chicken Leg Dum Biryani',
    description: 'Juicy whole spiced chicken leg drumstick slow-cooked with saffron basmati rice, golden roasted cashews, and caramelized onions, served with chilled raita.',
    price: 299,
    category: c['Biryani'],
    rating: 4.7,
    numReviews: 260,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 35,
  },
  {
    name: 'Royal Kolkata Mughlai Biryani',
    description: 'Kolkata-style fragrant dum biryani prepared with aromatic spices, tender meat, melt-in-the-mouth seasoned potato, and boiled egg, scented with kewra.',
    price: 319,
    category: c['Biryani'],
    rating: 4.8,
    numReviews: 220,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: false,
    preparationTime: 35,
  },

  // ── CHINESE (3 items) ────────────────────────────────────────────────────────
  {
    name: 'Prawn Ramen Noodle Bowl',
    description: 'Delicious Asian ramen noodles in savory garlic-soy broth topped with succulent tiger prawns, soft-boiled ramen eggs, sweet snow peas, and sesame.',
    price: 249,
    category: c['Chinese'],
    rating: 4.8,
    numReviews: 172,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 18,
  },
  {
    name: 'Steamed Dim Sum Dumplings',
    description: 'Delicate translucent steamed dumplings packed with finely minced savory fillings and herbs, served piping hot in traditional bamboo steamer baskets.',
    price: 199,
    category: c['Chinese'],
    rating: 4.7,
    numReviews: 214,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: true,
    preparationTime: 18,
  },
  {
    name: 'Spiced Chicken Rice Bowl',
    description: 'Fragrant seasoned rice topped with tender wok-cooked spiced chicken morsels, fresh herbs, citrus lime, and savory chef\'s sauce.',
    price: 219,
    category: c['Chinese'],
    rating: 4.5,
    numReviews: 110,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&h=450&fit=crop',
    isVegetarian: false,
    isFeatured: false,
    preparationTime: 18,
  },

  // ── SOUTH INDIAN (4 items) ───────────────────────────────────────────────────
  {
    name: 'Steamed Idli Sambar Platter',
    description: 'Three soft, steamed fermented rice and lentil idlis served on a fresh green banana leaf with homemade coconut chutney and aromatic sambar.',
    price: 99,
    category: c['South Indian'],
    rating: 4.8,
    numReviews: 210,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 10,
  },
  {
    name: 'Idli Vada Combo Platter',
    description: 'Classic South Indian breakfast combo featuring soft steamed idlis and a crispy golden medu vada, accompanied by piping hot sambar and three vibrant chutneys.',
    price: 139,
    category: c['South Indian'],
    rating: 4.8,
    numReviews: 260,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 15,
  },
  {
    name: 'Crispy Masala Dosa',
    description: 'Large golden crispy fermented rice crepe stuffed with spiced mustard-and-curry-leaf mashed potato masala, served with sambar and an assortment of chutneys.',
    price: 159,
    category: c['South Indian'],
    rating: 4.9,
    numReviews: 320,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 18,
  },
  {
    name: 'Kerala Banana Leaf Sadhya Feast',
    description: 'Traditional South Indian feast served on a fresh plantain leaf with steamed matta rice, crisp papadum, vegetable avial, beetroot pachadi, medu vada, and sambar.',
    price: 229,
    category: c['South Indian'],
    rating: 4.9,
    numReviews: 195,
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 20,
  },

  // ── BEVERAGES (6 items) ──────────────────────────────────────────────────────
  {
    name: 'Fresh Mango Cooler',
    description: 'Chilled tropical drink made from sweet Alphonso mangoes, infused with fresh lime juice, served ice-cold over crushed ice with fresh mint.',
    price: 99,
    category: c['Beverages'],
    rating: 4.8,
    numReviews: 215,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 5,
  },
  {
    name: 'Strawberry Milkshake',
    description: 'Chilled creamy milkshake blended with ripe fresh strawberries, cold whole milk, and a scoop of velvety strawberry ice cream.',
    price: 129,
    category: c['Beverages'],
    rating: 4.7,
    numReviews: 180,
    image: 'https://images.unsplash.com/photo-1613279060105-b851f33ca66b?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 5,
  },
  {
    name: 'Classic Iced Lemon Tea',
    description: 'Refreshing cold-brewed black tea infused with zesty freshly squeezed lemon juice, lightly sweetened and served over ice cubes with mint.',
    price: 89,
    category: c['Beverages'],
    rating: 4.6,
    numReviews: 140,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 4,
  },
  {
    name: 'Iced Creamy Cold Coffee',
    description: 'Bold dark roast espresso poured over ice and blended with sweet cream and whole milk for a rich, invigorating coffee treat.',
    price: 129,
    category: c['Beverages'],
    rating: 4.8,
    numReviews: 210,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 5,
  },
  {
    name: 'Artisan Herbal Tea',
    description: 'Aromatic blend of whole tea leaves and delicate herbal spices steeped to golden perfection, served in a clear glass cup.',
    price: 79,
    category: c['Beverages'],
    rating: 4.7,
    numReviews: 195,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 6,
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Pure freshly pressed sweet Valencia orange juice with natural citrus pulp, chilled and served without added sugar or preservatives.',
    price: 99,
    category: c['Beverages'],
    rating: 4.6,
    numReviews: 135,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 5,
  },

  // ── DESSERTS (5 items) ───────────────────────────────────────────────────────
  {
    name: 'Blueberry Cheesecake Slice',
    description: 'Creamy New York-style cheesecake layered over a buttery graham cracker crust, topped with luscious whole blueberry compote.',
    price: 179,
    category: c['Desserts'],
    rating: 4.8,
    numReviews: 190,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 5,
  },
  {
    name: 'Warm Chocolate Fudge Brownie',
    description: 'Rich and gooey dark chocolate fudge brownie stack drizzled with warm Belgian chocolate ganache.',
    price: 149,
    category: c['Desserts'],
    rating: 4.8,
    numReviews: 240,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 5,
  },
  {
    name: 'Oreo Chocolate Sundae',
    description: 'Decadent layered sundae in a glass with rich chocolate gelato, whipped cream, crushed crunchy Oreos, and hot chocolate fudge.',
    price: 159,
    category: c['Desserts'],
    rating: 4.7,
    numReviews: 165,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 5,
  },
  {
    name: 'Sizzling Brownie with Vanilla Ice Cream',
    description: 'Warm walnut brownie served with two generous scoops of vanilla bean ice cream and drizzled with molten chocolate sauce.',
    price: 189,
    category: c['Desserts'],
    rating: 4.9,
    numReviews: 185,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 8,
  },
  {
    name: 'Chocolate Crisp Pops (3 pcs)',
    description: 'Crispy toasted puffed rice treats half-dipped in rich dark chocolate, garnished with colorful rainbow sprinkles on wooden pops.',
    price: 119,
    category: c['Desserts'],
    rating: 4.6,
    numReviews: 120,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 5,
  },

  // ── HEALTHY (5 items) ────────────────────────────────────────────────────────
  {
    name: 'Avocado & Chickpea Power Bowl',
    description: 'Nutrient-packed nourish bowl featuring freshly sliced ripe avocado, roasted sweet potato cubes, protein chickpeas, cherry tomatoes, and tahini drizzle.',
    price: 239,
    category: c['Healthy'],
    rating: 4.8,
    numReviews: 130,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 15,
  },
  {
    name: 'Tofu & Edamame Poke Bowl',
    description: 'Wholesome salad bowl loaded with grilled marinated tofu cubes, sweet corn, edamame beans, cherry tomatoes, and shredded purple cabbage over crisp greens.',
    price: 249,
    category: c['Healthy'],
    rating: 4.7,
    numReviews: 115,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 18,
  },
  {
    name: 'Tropical Coconut Fruit Bowl',
    description: 'Vibrant bowl of freshly cut tropical fruits including sweet watermelon, sliced kiwi, ruby grapefruit, strawberries, and sweet cherries.',
    price: 169,
    category: c['Healthy'],
    rating: 4.7,
    numReviews: 95,
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: true,
    preparationTime: 10,
  },
  {
    name: 'Spinach, Sweet Potato & Avocado Salad',
    description: 'Baby spinach tossed with roasted sweet potato cubes, creamy avocado slices, red onions, and tart ruby pomegranate seeds with olive vinaigrette.',
    price: 199,
    category: c['Healthy'],
    rating: 4.6,
    numReviews: 88,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 12,
  },
  {
    name: 'Creamy Broccoli Herb Soup',
    description: 'Nutritious creamy broccoli soup simmered with fresh herbs, finished with a swirl of cream, and served with a crispy seasoned breadstick.',
    price: 159,
    category: c['Healthy'],
    rating: 4.6,
    numReviews: 142,
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&h=450&fit=crop',
    isVegetarian: true,
    isFeatured: false,
    preparationTime: 15,
  },
]

async function seed() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodiehub'
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
    console.log('Connected to MongoDB ✅')

    // Clear existing collections safely
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Food.deleteMany({}),
      Cart.deleteMany({}),
    ])
    console.log('🗑️  Cleared Users, Categories, Foods, Carts')

    // Insert categories
    const insertedCats = await Category.insertMany(CATEGORIES)
    const catMap = {}
    insertedCats.forEach(cat => { catMap[cat.name] = cat._id })
    console.log(`📂 Seeded ${insertedCats.length} categories`)

    // Insert foods (catMap is now populated)
    const foodDocs = FOODS(catMap)
    const insertedFoods = await Food.insertMany(foodDocs)
    console.log(`🍔 Seeded ${insertedFoods.length} food items`)

    // Admin user — plain text, pre('save') hook hashes it
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@foodiehub.com',
      password: 'admin123',
      phone: '9000000001',
      role: 'admin',
      isActive: true,
    })
    console.log(`🛡️  Admin:     ${admin.email}  /  admin123`)

    // Demo user with a saved address
    const demo = await User.create({
      name: 'Demo User',
      email: 'user@foodiehub.com',
      password: 'user123',
      phone: '9000000002',
      role: 'user',
      isActive: true,
      addresses: [
        {
          label: 'Home',
          street: '12, Rose Garden Apartments, MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          phone: '9000000002',
        },
      ],
    })
    console.log(`👤 Demo user: ${demo.email}  /  user123`)

    console.log('\n🎉 Seeding complete!')
    console.log('─────────────────────────────────────────')
    console.log(`   Categories : ${insertedCats.length}`)
    console.log(`   Foods      : ${insertedFoods.length}`)
    console.log('─────────────────────────────────────────')
    console.log('   Admin:  admin@foodiehub.com / admin123')
    console.log('   User:   user@foodiehub.com  / user123')
    console.log('─────────────────────────────────────────\n')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

// Only auto-run when executed directly via `node seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  seed()
}
