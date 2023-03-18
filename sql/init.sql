CREATE DATABASE `ilost`;

CREATE TABLE `ilost`.`items` (`id` INT NOT NULL AUTO_INCREMENT , `item_name` VARCHAR(1000) NOT NULL , `lost_since` TIMESTAMP NOT NULL , `image` VARCHAR(30) NOT NULL COMMENT 'Image Key' , `foundlost_by` VARCHAR(1000) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;