CREATE TABLE info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address_ar TEXT NOT NULL,
    address_en TEXT NOT NULL,
    maps_link VARCHAR(255)
);