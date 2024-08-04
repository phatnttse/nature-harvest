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
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;


CREATE TABLE `roles` (
    `role_id` INT PRIMARY KEY NOT NULL,
    `name` VARCHAR(50) NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `categories` (
    `category_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `thumbnail` VARCHAR(300),
    `slug` VARCHAR(255) UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `active` BOOLEAN DEFAULT TRUE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `subcategories` (
    `subcategory_id` INT PRIMARY KEY AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `slug` VARCHAR(255) UNIQUE,
    `name` VARCHAR(100) NOT NULL,
	`active` BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `products` (
    `product_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `category_id` INT NOT NULL,
    `subcategory_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `original_price` INT NOT NULL,
    `official_price` INT NOT NULL,
    `quantity` INT NOT NULL,
    `discount` INT DEFAULT 0,
    `thumbnail` VARCHAR(255) DEFAULT '',
	`slug` VARCHAR(255) UNIQUE,
    `description` LONGTEXT,
    `purchases` INT DEFAULT 0,
	`average_rating` DECIMAL(2, 1) DEFAULT 0.0,
	`active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `product_images` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT,
    FOREIGN KEY (product_id)
        REFERENCES products (product_id),
    CONSTRAINT fk_product_images_product_id FOREIGN KEY (product_id)
        REFERENCES products (product_id)
        ON DELETE CASCADE,
    `image_url` VARCHAR(300)
);

CREATE TABLE `ratings` (
    `rating_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` VARCHAR(50) NOT NULL,
    `product_id` INT NOT NULL,
    `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `orders` (
    `order_id` VARCHAR(100) PRIMARY KEY NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(12) NOT NULL,
    `delivery_address` VARCHAR(255) NOT NULL,
    `note` LONGTEXT,
    `status` ENUM('pending', 'confirmed', 'picked_up', 'on_the_way', 'successful_delivery', 'cancelled', 'refused') CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI DEFAULT NULL COMMENT 'Trạng thái đơn hàng',
    `payment_status` ENUM('paid', 'unpaid') CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI DEFAULT NULL COMMENT 'Trạng thái thanh toán',
    `payment_method` VARCHAR(10) NOT NULL,
    `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `delivery_date` TIMESTAMP,
    `amount` INT NOT NULL,
    `reviewed` BOOLEAN DEFAULT FALSE NOT NULL,
    `coupon_id` INT,
    `active` BOOLEAN DEFAULT TRUE NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `order_details` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(100) NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `coupon_id` INT,
    `reviewed` BOOLEAN DEFAULT FALSE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `carts` (
    `cart_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL
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
    `discount_type` ENUM('percentage', 'fixed') CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL COMMENT 'Loại giảm giá (phần trăm hay cố định)',
    `attribute` VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `operator` VARCHAR(10) NOT NULL,
	`value` VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
	`discount_amount` INT NOT NULL,
    `description` LONGTEXT CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `start_date` DATE,
    `end_date` DATE,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `active` BOOLEAN DEFAULT TRUE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `comments` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `user_id` VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `star_rating` INT NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
	`content` VARCHAR(255)CHARACTER SET UTF8MB4 COLLATE UTF8MB4_GENERAL_CI NOT NULL,
    `has_picture` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `comment_pictures` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `comment_id` INT NOT NULL,
    `picture_url` VARCHAR(300)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

CREATE TABLE `blogs` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `author` VARCHAR(255) NOT NULL,
	`thumbnail` VARCHAR(255) NOT NULL,
	`slug` VARCHAR(255) UNIQUE,
    `tags` VARCHAR(255),
	`summary` TEXT,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`active` BOOLEAN DEFAULT TRUE
) ENGINE=INNODB DEFAULT CHARSET=UTF8MB4 COLLATE = UTF8MB4_GENERAL_CI;

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

ALTER TABLE `tokens` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
ALTER TABLE `comments` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `comment_pictures` ADD FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`);

ALTER TABLE `blogs` ADD FOREIGN KEY (`author`) REFERENCES `users`(`user_id`);

INSERT INTO roles (role_id, name) values
 (0,"USER"),
 (1,"ADMIN");
  
INSERT INTO `users` (`user_id`, `email`, `password`, `name`, `phone`, `picture`, `address`,`role_id`, `email_verified`) 
VALUES (UUID(), 'admin123@gmail.com', '$2a$10$wNGqMyi/jy8aURA1Bbm8.e6l90CY5A6FU0gmqKdLWC7BmWDYkoPpG', 
'Phatnttse', '1234567890', 
'https://res.cloudinary.com/dlpust9lj/image/upload/v1719497920/360_F_208981748_9fbrA3Hy2GGajHn4XDtfzVFMzHiXguYg_kppkjd.jpg', 
'', 1, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
