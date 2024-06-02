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

/**CREATE TABLE `subcategories` (
    `subcategory_id` INT PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;**/

CREATE TABLE `products` (
    `product_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    /**--`subcategory_id` INT,**/
    `title` VARCHAR(255) NOT NULL,
    `price` INT NOT NULL,
    `quantity` INT NOT NULL,
    `discount` INT DEFAULT 0,
    `thumbnail` VARCHAR(255) DEFAULT '',
    `description` LONGTEXT,
    `purchases` INT DEFAULT 0,
	`average_rating` DECIMAL(2, 1) DEFAULT 0.0,
	`active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     /**FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`)**/
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

CREATE TABLE `email_confirmation` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `expired` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `orders` (
    `order_id` VARCHAR(10) PRIMARY KEY NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(12) NOT NULL,
    `delivery_address` VARCHAR(255) NOT NULL,
    `note` LONGTEXT,
    `previous_status` INT NOT NULL,
    `current_status` INT NOT NULL,
    `payment_status` BOOLEAN NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `delivery_date` TIMESTAMP,
    `amount` INT NOT NULL,
    `active` BOOLEAN DEFAULT TRUE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `order_status` (
    `status_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `order_details` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(10) NOT NULL,
    `product_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `price` INT NOT NULL,
    `quantity` INT NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `total_money` INT NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `carts` (
    `cart_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL,
    `product_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `quantity` INT NOT NULL,
    `price` INT NOT NULL
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


DELIMITER $$

CREATE TRIGGER TR_Order_Update AFTER UPDATE ON orders 
FOR EACH ROW
BEGIN
    DECLARE product_quantity INT;
    DECLARE product_id_found INT;	

    -- Kiểm tra nếu trạng thái đơn hàng đã được thay đổi từ 4 (Đang giao hàng) sang 5 (Giao hàng thành công)
    IF OLD.current_status = 4 AND NEW.current_status = 5 THEN
        -- Tìm kiếm product_id từ bảng order_details dựa trên order_id
        SELECT od.product_id INTO product_id_found
        FROM order_details od
        WHERE od.order_id = NEW.order_id;

        -- Kiểm tra xem product_id đã được tìm thấy hay không
        IF product_id_found IS NOT NULL THEN
            -- Nếu tìm thấy product_id, tiến hành lấy số lượng sản phẩm từ bảng order_details
            SELECT od.quantity INTO product_quantity
            FROM order_details od
            WHERE od.order_id = NEW.order_id AND od.product_id = product_id_found;

            -- Giảm số lượng sản phẩm trong kho và tăng lượt mua
            UPDATE products 
            SET quantity = quantity - product_quantity,
                purchases = purchases + product_quantity
            WHERE product_id = product_id_found;
        END IF;
    END IF;
END$$

DELIMITER ;



ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

ALTER TABLE `ratings` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `ratings` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);


ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`current_status`) REFERENCES `order_status` (`status_id`);

ALTER TABLE `carts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `carts` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);


ALTER TABLE `order_details` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);
ALTER TABLE `order_details` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);


ALTER TABLE `order_cancellation_requests` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `order_cancellation_requests` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);


ALTER TABLE `wishlist` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`);
ALTER TABLE `wishlist`ADD FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`);

ALTER TABLE `tokens` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `email_confirmation` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);



INSERT INTO categories (name) VALUES
  ('Vegetables'),
  ('Fruits'),
  ('Bread'),
  ('Meat');

INSERT INTO `order_status` (`name`) VALUES
  ('Pending');
  
INSERT INTO roles (role_id, name) values
 (0,"USER"),
 (1,"STAFF"),
 (2,"ADMIN");
 

INSERT INTO `users` (`user_id`, `email`, `password`, `name`, `phone`, `picture`, `address`,`role_id`) 
VALUES (UUID(), 'staff123@gmail.com', '$2a$10$wNGqMyi/jy8aURA1Bbm8.e6l90CY5A6FU0gmqKdLWC7BmWDYkoPpG', 'Ng Tran Staff', '1234567890', 'picture_url1', 'Address1', 1);

INSERT INTO `users` (`user_id`, `email`, `password`, `name`, `phone`, `picture`, `address`,`role_id`) 
VALUES (UUID(), 'admin123@gmail.com', '$2a$10$wNGqMyi/jy8aURA1Bbm8.e6l90CY5A6FU0gmqKdLWC7BmWDYkoPpG', 'Ng Tran Admin', '1234567890', 'picture_url2', 'Address2', 2);

INSERT INTO products (title, description, quantity, price, category_id, thumbnail) VALUES 
('Apple', 'Apples come in various varieties such as Gala, Fuji, Granny Smith, and Honeycrisp. They have thin skin with colors ranging from red, yellow, to green, and a crisp, sweet, or tart flesh.',
 200, 50000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215700/ZnJ1aXRlLWl0ZW0tNl9mZHowbHc=/template_primary/dF9B'),
 
('Grapes', 'Grapes are small, juicy fruits that come in various colors such as red, green, and purple. They can be eaten fresh, made into wine, or dried into raisins.',
 200, 80000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215700/ZnJ1aXRlLWl0ZW0tNV9zZHB0OWY=/template_primary/dF9B'),
 
('Banana', 'Bananas are tropical fruits with yellow skin when ripe, and soft, sweet flesh. They are easy to peel and can be eaten raw or used in various dishes.', 
200, 30000, 2, 
'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215700/ZnJ1aXRlLWl0ZW0tM19qOGFrYWI=/drilldown'),

('Oranges', 'Oranges have thick orange skin, juicy flesh, and a sweet or tart taste. They are often eaten fresh or juiced.', 
200, 60000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215699/ZnJ1aXRlLWl0ZW0tMV9zZnpkdmE=/drilldown'),

('Apricots', 'Apricots are small, golden-orange fruits with a velvety skin and flesh. They have a slightly tart and sweet flavor, with a texture similar to a peach but firmer and less juicy', 
200, 35000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215700/ZnJ1aXRlLWl0ZW0tNF92MmgzbW8=/drilldown'),

('Raspberries', 'Raspberries are small, delicate fruits that come in various colors, including red, black, purple, and golden', 
200, 720000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215699/ZnJ1aXRlLWl0ZW0tMl9rNHJ1c2U=/drilldown'),

('Strawberry', 'Strawberries are bright red, juicy fruits with a sweet or tart flavor. They are often eaten fresh, made into jam, or used in desserts.', 
200, 90000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215699/ZmVhdHVyLTJfc3ZuNnV0/template_primary/dF9B'),

('Tomato', 'Tomatoes are versatile fruits (often considered vegetables in culinary contexts) that come in various shapes, sizes, and colors, including red, yellow, green, and purple..', 
200, 30000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215698/dmVnZXRhYmxlLWl0ZW0tMV9hOXMybHI=/template_primary/dF9B'),

('Broccoli', 'Broccoli is a green vegetable belonging to the cruciferous family. It has a tree-like appearance with thick, edible stems and clusters of small, tight green florets.', 
200, 40000, 2, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215700/dmVnZXRhYmxlLWl0ZW0tNl9uZjl6OGE=/template_primary/dF9B'),

('Potato', 'Potatoes are starchy tuberous vegetables that come in various shapes, sizes, and colors, including white, yellow, red, and purple.', 
200, 20000, 1, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215699/dmVnZXRhYmxlLWl0ZW0tNV9haHBsZXA=/template_primary/dF9B'),

('Bell Pepper', 'They come in various colors, including red, yellow, orange, green, and even purple, and have a crunchy texture and a sweet, mildly tangy flavor', 
200, 20000, 1, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215699/dmVnZXRhYmxlLWl0ZW0tNF9waXN6eXQ=/template_primary/dF9B'),

('Cilantro', 'Cilantro is rich in vitamins A, C, and K, as well as antioxidants, fiber, and essential oils.', 
200, 10000, 1, 'https://res-console.cloudinary.com/dl3rsgucq/thumbnails/v1/image/upload/v1717215699/ZmVhdHVyLTNfb2ZxeDh3/template_primary/dF9B');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
