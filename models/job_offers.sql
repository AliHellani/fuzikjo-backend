CREATE TABLE job_offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    requirements_ar TEXT NOT NULL,
    requirements_en TEXT NOT NULL,
    application_deadline DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);