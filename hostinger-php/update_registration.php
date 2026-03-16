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
if (!$regId) {
    echo json_encode(['success' => false, 'error' => 'registration_id required']);
    exit();
}

$allowed_fields = [
    'surname', 'first_name', 'middle_name', 'father_name', 'mother_name',
    'dob', 'aadhar', 'gender', 'whatsapp', 'alt_number', 'email', 'address',
    'category', 'fee_category', 'fee_amount', 'present_school', 'prev_std',
    'prev_board', 'exam_language', 'exam_centre', 'payment_status', 'payment_id'
];

$sets = [];
$params = [];

foreach ($allowed_fields as $field) {
    if (isset($data[$field])) {
        $sets[] = "$field = ?";
        $params[] = $data[$field];
    }
}

if (empty($sets)) {
    echo json_encode(['success' => false, 'error' => 'No fields to update']);
    exit();
}

$sets[] = "updated_at = NOW()";
$params[] = $regId;

$pdo = getDB();
$sql = "UPDATE registrations SET " . implode(', ', $sets) . " WHERE registration_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

echo json_encode([
    'success' => true,
    'message' => 'Registration updated',
    'rows_affected' => $stmt->rowCount()
]);
