DROP DATABASE IF EXISTS NatureHarvestDb;
CREATE DATABASE IF NOT EXISTS NatureHarvestDb;
USE NatureHarvestDb;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `users` (
    `user_id` VARCHAR(255) PRIMARY KEY NOT NULL,
    `email` VARCHAR(255) NOT NULL,
	`email_verified` BOOLEAN DEFAULT FALSE,
    `password` char(60) COLLATE utf8mb4_general_ci,
    `name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `phone` VARCHAR(12),
    `date_of_birth` DATE,
    `picture` VARCHAR(255),
    `address` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
    `google_id` VARCHAR(255),
    `role_id` INT NOT NULL,
    `active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;


CREATE TABLE `roles` (
    `role_id` INT PRIMARY KEY NOT NULL,
    `name` VARCHAR(50) NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `categories` (
    `category_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `subcategories` (
    `subcategory_id` INT PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `products` (
    `product_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `subcategory_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `price` INT NOT NULL,
    `quantity` INT NOT NULL,
    `discount` INT DEFAULT 0,
    `thumbnail` VARCHAR(255) DEFAULT '',
    `description` LONGTEXT,
    `purchases` INT DEFAULT 0,
	`average_rating` DECIMAL(2, 1) DEFAULT 0.0,
	`active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    FOREIGN KEY (product_id)
        REFERENCES products (product_id),
    CONSTRAINT fk_product_images_product_id FOREIGN KEY (product_id)
        REFERENCES products (product_id)
        ON DELETE CASCADE,
    image_url VARCHAR(300)
);

CREATE TABLE `ratings` (
    `rating_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` VARCHAR(50) NOT NULL,
    `product_id` INT NOT NULL,
    `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;


CREATE TABLE `wishlist` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;


CREATE TABLE `orders` (
    `order_id` VARCHAR(100) PRIMARY KEY NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(12) NOT NULL,
    `delivery_address` VARCHAR(255) NOT NULL,
    `note` LONGTEXT,
	`status` enum('pending','processing','shipped','delivered','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Trạng thái đơn hàng',
    `payment_status` enum('paid','unpaid') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Trạng thái thanh toán',
    `payment_method` VARCHAR(10) NOT NULL,
    `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `delivery_date` TIMESTAMP,
    `amount` INT NOT NULL,
    `coupon_id` INT,
    `active` BOOLEAN DEFAULT TRUE NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `order_details` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(100) NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `coupon_id` INT
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `carts` (
    `cart_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;


CREATE TABLE `order_cancellation_requests` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL,
    `order_id` VARCHAR(10) NOT NULL,
    `reason` VARCHAR(255),
    `request_status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `tokens` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(350) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `token_type` VARCHAR(50) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `expiration_date` DATETIME DEFAULT NULL,
    `revoked` TINYINT(1) NOT NULL,
    `expired` TINYINT(1) NOT NULL,
    `user_id` VARCHAR(255) DEFAULT NULL,
    `is_mobile` TINYINT(1) DEFAULT '0',
    `refresh_token` VARCHAR(255) COLLATE UTF8MB4_GENERAL_CI DEFAULT '',
    `refresh_expiration_date` DATETIME DEFAULT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `coupons` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `active` BOOLEAN DEFAULT TRUE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `coupon_conditions` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `coupon_id` INT NOT NULL,
    `attribute` VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `operator` VARCHAR(10) NOT NULL,
	`value` VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `discount_amount` INT NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `comments` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `user_id` VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
	`content` VARCHAR(255)CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;


ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

ALTER TABLE `ratings` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `ratings` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);


ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);

ALTER TABLE `carts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `carts` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);


ALTER TABLE `order_details` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);
ALTER TABLE `order_details` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
ALTER TABLE `order_details` ADD FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);


ALTER TABLE `order_cancellation_requests` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `order_cancellation_requests` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);


ALTER TABLE `wishlist` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`);
ALTER TABLE `wishlist`ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`);

ALTER TABLE `tokens` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `comments` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `coupon_conditions` ADD FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);



INSERT INTO categories (name) VALUES
  ('Vegetables'),
  ('Fruits'),
  ('Bread'),
  ('Meat');

  
INSERT INTO roles (role_id, name) values
 (0,"USER"),
 (1,"STAFF"),
 (2,"ADMIN");
 

INSERT INTO `users` (`user_id`, `email`, `password`, `name`, `phone`, `picture`, `address`,`role_id`, `email_verified`) 
VALUES (UUID(), 'staff123@gmail.com', '$2a$10$wNGqMyi/jy8aURA1Bbm8.e6l90CY5A6FU0gmqKdLWC7BmWDYkoPpG', 'Ng Tran Staff', '1234567890', 'picture_url1', 'Address1', 1, 1);

INSERT INTO `users` (`user_id`, `email`, `password`, `name`, `phone`, `picture`, `address`,`role_id`, `email_verified`) 
VALUES (UUID(), 'admin123@gmail.com', '$2a$10$wNGqMyi/jy8aURA1Bbm8.e6l90CY5A6FU0gmqKdLWC7BmWDYkoPpG', 'Ng Tran Admin', '1234567890', 'picture_url2', 'Address2', 2, 1);

INSERT INTO products (title, description, quantity, price, category_id, thumbnail) VALUES 
('Apple', 'Apples come in various varieties such as Gala, Fuji, Granny Smith, and Honeycrisp. They have thin skin with colors ranging from red, yellow, to green, and a crisp, sweet, or tart flesh.',
 200, 50000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215698/best-product-6_w8j3ua.jpg'),
 
('Grapes', 'Grapes are small, juicy fruits that come in various colors such as red, green, and purple. They can be eaten fresh, made into wine, or dried into raisins.',
 200, 80000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215700/fruite-item-5_sdpt9f.jpg'),
 
('Banana', 'Bananas are tropical fruits with yellow skin when ripe, and soft, sweet flesh. They are easy to peel and can be eaten raw or used in various dishes.', 
200, 30000, 2, 
'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215700/fruite-item-3_j8akab.jpg'),

('Oranges', 'Oranges have thick orange skin, juicy flesh, and a sweet or tart taste. They are often eaten fresh or juiced.', 
200, 60000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215699/fruite-item-1_sfzdva.jpg'),

('Apricots', 'Apricots are small, golden-orange fruits with a velvety skin and flesh. They have a slightly tart and sweet flavor, with a texture similar to a peach but firmer and less juicy', 
200, 35000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215700/fruite-item-4_v2h3mo.jpg'),

('Raspberries', 'Raspberries are small, delicate fruits that come in various colors, including red, black, purple, and golden', 
200, 720000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215699/fruite-item-2_k4ruse.jpg'),

('Strawberry', 'Strawberries are bright red, juicy fruits with a sweet or tart flavor. They are often eaten fresh, made into jam, or used in desserts.', 
200, 90000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215699/featur-2_svn6ut.jpg'),

('Tomato', 'Tomatoes are versatile fruits (often considered vegetables in culinary contexts) that come in various shapes, sizes, and colors, including red, yellow, green, and purple..', 
200, 30000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215698/vegetable-item-1_a9s2lr.jpg'),

('Broccoli', 'Broccoli is a green vegetable belonging to the cruciferous family. It has a tree-like appearance with thick, edible stems and clusters of small, tight green florets.', 
200, 40000, 2, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215699/featur-3_ofqx8w.jpg'),

('Potato', 'Potatoes are starchy tuberous vegetables that come in various shapes, sizes, and colors, including white, yellow, red, and purple.', 
200, 20000, 1, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215699/vegetable-item-5_ahplep.jpg'),

('Bell Pepper', 'They come in various colors, including red, yellow, orange, green, and even purple, and have a crunchy texture and a sweet, mildly tangy flavor', 
200, 20000, 1, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215699/vegetable-item-4_piszyt.jpg'),

('Cilantro', 'Cilantro is rich in vitamins A, C, and K, as well as antioxidants, fiber, and essential oils.', 
200, 10000, 1, 'https://res.cloudinary.com/dl3rsgucq/image/upload/v1717215700/vegetable-item-6_nf9z8a.jpg');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
