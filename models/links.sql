CREATE TABLE links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_name_ar VARCHAR(255) NOT NULL,
    provider_name_en VARCHAR(255) NOT NULL,
    provider_link VARCHAR(255) NOT NULL,
    icon_url VARCHAR(255) NOT NULL
);