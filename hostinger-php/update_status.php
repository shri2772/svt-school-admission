<?php
require_once 'config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'POST required']);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$regId = $data['registration_id'] ?? '';
$status = $data['payment_status'] ?? 'PAID';

if (!$regId) {
    echo json_encode(['success' => false, 'error' => 'registration_id required']);
    exit();
}

$allowed = ['PAID', 'PENDING', 'FAILED'];
if (!in_array($status, $allowed)) {
    echo json_encode(['success' => false, 'error' => 'Invalid status']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->prepare("UPDATE registrations SET payment_status = ?, updated_at = NOW() WHERE registration_id = ?");
$stmt->execute([$status, $regId]);

if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => true, 'message' => "Status updated to $status"]);
} else {
    echo json_encode(['success' => false, 'error' => 'Record not found or no change']);
}
