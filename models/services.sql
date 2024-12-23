CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL
);