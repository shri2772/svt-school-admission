<?php
// ─── Database Configuration (Hostinger MySQL) ─────────────────────────────────
// Update these values with your Hostinger MySQL credentials

define('DB_HOST', 'localhost');         // Usually 'localhost' on Hostinger
define('DB_NAME', 'your_db_name');      // Your Hostinger database name
define('DB_USER', 'your_db_user');      // Your Hostinger database username
define('DB_PASS', 'your_db_password');  // Your Hostinger database password
define('DB_CHARSET', 'utf8mb4');

// ─── Security ─────────────────────────────────────────────────────────────────
define('API_SECRET', 'svt_school_2026_secret_key'); // Must match HOSTINGER_API_SECRET in Cloudflare

// ─── CORS & Headers ──────────────────────────────────────────────────────────
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// ─── Get PDO Connection ───────────────────────────────────────────────────────
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => 'DB connection failed: ' . $e->getMessage()]);
            exit();
        }
    }
    return $pdo;
}

// ─── Create Table if not exists ───────────────────────────────────────────────
function ensureTable() {
    $pdo = getDB();
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS registrations (
            id                INT AUTO_INCREMENT PRIMARY KEY,
            registration_id   VARCHAR(50) UNIQUE NOT NULL,
            surname           VARCHAR(100),
            first_name        VARCHAR(100),
            middle_name       VARCHAR(100),
            father_name       VARCHAR(200),
            mother_name       VARCHAR(200),
            dob               DATE,
            aadhar            VARCHAR(20),
            gender            VARCHAR(20),
            whatsapp          VARCHAR(15),
            alt_number        VARCHAR(15),
            email             VARCHAR(200),
            address           TEXT,
            category          VARCHAR(20),
            fee_category      VARCHAR(5),
            fee_amount        DECIMAL(10,2),
            present_school    VARCHAR(300),
            prev_std          VARCHAR(10),
            prev_board        VARCHAR(100),
            exam_language     VARCHAR(20),
            exam_centre       VARCHAR(100),
            course            VARCHAR(10) DEFAULT '6th',
            academic_year     VARCHAR(20) DEFAULT '2026-27',
            payment_id        VARCHAR(200),
            order_id          VARCHAR(200),
            razorpay_signature VARCHAR(500),
            payment_status    ENUM('PAID','PENDING','FAILED') DEFAULT 'PENDING',
            photo             MEDIUMTEXT,
            bonafide_doc      MEDIUMTEXT,
            aadhar_doc        MEDIUMTEXT,
            created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
}
