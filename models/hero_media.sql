CREATE TABLE hero_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    media_type ENUM('image', 'video') NOT NULL,
    media_url VARCHAR(255) NOT NULL
);