-- Clear existing
DELETE FROM products;

-- Reset
DELETE FROM sqlite_sequence WHERE name = 'products';

-- New Products (category_id = 1)
INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new) VALUES
('Bubble Tea', 'Milk tea with brown sugar bubble.', '/term-project/frontend/images/bubble-tea.webp', 5.99, 1, 1, 1),
('Green Tea', 'Made from finely ground green tea powder and steamed milk.', '/term-project/frontend/images/green-tea.webp', 4.49, 1, 1, 1),
('Matcha', 'Naturally sweet, vegetal grassy flavor with a smooth and creamy finish.', '/term-project/frontend/images/matcha.webp', 5.49, 1, 1, 1),
('Iced Green Tea', 'Refreshing iced green tea.', '/term-project/frontend/images/iced-green-tea.webp', 3.99, 1, 0, 1);

-- Milk Tea Products (category_id = 2)
INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new) VALUES
('Classic Milk Tea', 'Traditional black tea with creamy milk.', '/term-project/frontend/images/classic-milk-tea.webp', 4.99, 2, 0, 0),
('Taro Milk Tea', 'Silky milk tea infused with taro flavor.', '/term-project/frontend/images/taro-milk-tea.webp', 5.49, 2, 0, 0),
('Brown Sugar Milk Tea', 'Creamy milk tea with caramelized brown sugar syrup.', '/term-project/frontend/images/brown-sugar-milk-tea.webp', 5.99, 2, 1, 0),
('Honey Milk Tea', 'Smooth milk tea sweetened with natural honey.', '/term-project/frontend/images/honey-milk-tea.webp', 5.49, 2, 0, 0);

-- Hot Tea Products (category_id = 3)
INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new) VALUES
('Jasmine Hot Tea', 'Fragrant jasmine-infused green tea served hot.', '/term-project/frontend/images/jasmine-tea.webp', 3.99, 3, 0, 0),
('Earl Grey Tea', 'Classic black tea flavored with bergamot oil.', '/term-project/frontend/images/earl-grey-tea.webp', 3.99, 3, 0, 0),
('Ginger Tea', 'Warming tea with fresh ginger notes.', '/term-project/frontend/images/ginger-tea.webp', 4.29, 3, 0, 0),
('Chamomile Tea', 'Soothing herbal tea with delicate floral notes.', '/term-project/frontend/images/chamomile-tea.webp', 3.79, 3, 0, 0);

-- Ice Tea Products (category_id = 4)
INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new) VALUES
('Peach Ice Tea', 'Refreshing iced tea with sweet peach flavor.', '/term-project/frontend/images/peach-ice-tea.webp', 4.49, 4, 0, 0),
('Lychee Ice Tea', 'Delicate iced tea infused with lychee.', '/term-project/frontend/images/lychee-ice-tea.webp', 4.49, 4, 0, 0),
('Passion Fruit Ice Tea', 'Tropical iced tea with passion fruit.', '/term-project/frontend/images/passion-fruit-tea.webp', 4.79, 4, 1, 0),
('Lemon Ice Tea', 'Classic iced tea with fresh lemon.', '/term-project/frontend/images/lemon-ice-tea.webp', 3.99, 4, 0, 0);

-- Coffee Products (category_id = 5)
INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new) VALUES
('Iced Coffee', 'Smooth cold brewed coffee served over ice.', '/term-project/frontend/images/iced-coffee.webp', 4.29, 5, 0, 0),
('Latte', 'Espresso with steamed milk and a light layer of foam.', '/term-project/frontend/images/latte.webp', 4.99, 5, 0, 0),
('Mocha', 'Espresso with chocolate and steamed milk.', '/term-project/frontend/images/mocha.webp', 5.49, 5, 0, 0),
('Caramel Macchiato', 'Vanilla-flavored espresso with caramel drizzle.', '/term-project/frontend/images/caramel-macchiato.webp', 5.79, 5, 1, 0);

-- Lemonade Products (category_id = 6)
INSERT INTO products (name, description, image_url, price, category_id, is_featured, is_new) VALUES
('Classic Lemonade', 'Freshly squeezed lemons with just the right amount of sweetness.', '/term-project/frontend/images/classic-lemonade.webp', 3.99, 6, 0, 0),
('Strawberry Lemonade', 'Classic lemonade infused with sweet strawberries.', '/term-project/frontend/images/strawberry-lemonade.webp', 4.49, 6, 1, 0),
('Blueberry Lemonade', 'Tangy lemonade with fresh blueberry puree.', '/term-project/frontend/images/blueberry-lemonade.webp', 4.49, 6, 0, 0),
('Cucumber Mint Lemonade', 'Refreshing lemonade with cucumber and mint.', '/term-project/frontend/images/cucumber-lemonade.webp', 4.79, 6, 0, 0);


SELECT COUNT(*) AS total_products FROM products;
SELECT category_id, COUNT(*) AS products_per_category FROM products GROUP BY category_id;
SELECT COUNT(*) AS featured_products FROM products WHERE is_featured = 1;