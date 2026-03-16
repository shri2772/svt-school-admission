<?php
require_once 'config.php';
setCorsHeaders();
ensureTable();

$id = $_GET['id'] ?? '';
if (!$id) {
    echo json_encode(['success' => false, 'error' => 'ID required']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM registrations WHERE registration_id = ? LIMIT 1");
$stmt->execute([$id]);
$row = $stmt->fetch();

if ($row) {
    // Format date
    if ($row['dob']) $row['dob'] = date('d-M-Y', strtotime($row['dob']));
    echo json_encode($row);
} else {
    echo json_encode(['success' => false, 'error' => 'Not found']);
}
