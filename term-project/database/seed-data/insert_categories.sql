-- Clear existing
DELETE FROM categories;

-- Reset
DELETE FROM sqlite_sequence WHERE name = 'categories';

-- Insert default categories
INSERT INTO categories (name, display_order, is_active) VALUES
('New', 1, 1),
('Milk Tea', 2, 1),
('Hot Tea', 3, 1),
('Ice Tea', 4, 1),
('Coffee', 5, 1),
('Lemonade', 6, 1);


SELECT category_id, name, display_order, is_active FROM categories ORDER BY display_order;