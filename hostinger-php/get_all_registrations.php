<?php
require_once 'config.php';
setCorsHeaders();
ensureTable();

$pdo = getDB();

// Optional filters
$status = $_GET['status'] ?? '';
$centre = $_GET['centre'] ?? '';
$search = $_GET['search'] ?? '';

$sql = "SELECT id, registration_id, surname, first_name, middle_name,
               father_name, mother_name, dob, aadhar, gender,
               whatsapp, alt_number, email, address,
               category, fee_category, fee_amount,
               present_school, prev_std, prev_board, exam_language, exam_centre,
               course, academic_year, payment_id, order_id,
               payment_status, photo, created_at, updated_at
        FROM registrations WHERE 1=1";

$params = [];

if ($status) {
    $sql .= " AND payment_status = ?";
    $params[] = $status;
}
if ($centre) {
    $sql .= " AND exam_centre = ?";
    $params[] = $centre;
}
if ($search) {
    $sql .= " AND (first_name LIKE ? OR surname LIKE ? OR aadhar LIKE ? OR whatsapp LIKE ? OR email LIKE ?)";
    $like = '%' . $search . '%';
    $params = array_merge($params, [$like, $like, $like, $like, $like]);
}

$sql .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

// Format dates
foreach ($rows as &$row) {
    if ($row['dob']) $row['dob'] = date('d-M-Y', strtotime($row['dob']));
}

// Stats
$total   = count($rows);
$paid    = count(array_filter($rows, fn($r) => $r['payment_status'] === 'PAID'));
$pending = count(array_filter($rows, fn($r) => $r['payment_status'] === 'PENDING'));
$failed  = count(array_filter($rows, fn($r) => $r['payment_status'] === 'FAILED'));
$revenue = array_sum(array_map(fn($r) => $r['payment_status'] === 'PAID' ? (float)$r['fee_amount'] : 0, $rows));

$today = date('Y-m-d');
$today_revenue = array_sum(array_map(function($r) use ($today) {
    return ($r['payment_status'] === 'PAID' && substr($r['created_at'], 0, 10) === $today)
        ? (float)$r['fee_amount'] : 0;
}, $rows));

echo json_encode([
    'success'       => true,
    'registrations' => $rows,
    'stats' => [
        'total'         => $total,
        'paid'          => $paid,
        'pending'       => $pending,
        'failed'        => $failed,
        'revenue'       => $revenue,
        'today_revenue' => $today_revenue
    ]
]);
