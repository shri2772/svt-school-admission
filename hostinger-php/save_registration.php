<?php
require_once 'config.php';
setCorsHeaders();
ensureTable();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'POST required']);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit();
}

$pdo = getDB();

// Check duplicate Aadhaar for PAID
$stmt = $pdo->prepare("SELECT registration_id, payment_status FROM registrations WHERE aadhar = ? ORDER BY created_at DESC LIMIT 1");
$stmt->execute([$data['aadhar'] ?? '']);
$existing = $stmt->fetch();

try {
    $stmt = $pdo->prepare("
        INSERT INTO registrations (
            registration_id, surname, first_name, middle_name,
            father_name, mother_name, dob, aadhar, gender,
            whatsapp, alt_number, email, address,
            category, fee_category, fee_amount,
            present_school, prev_std, prev_board, exam_language, exam_centre,
            course, academic_year,
            payment_id, order_id, razorpay_signature, payment_status,
            photo, bonafide_doc, aadhar_doc
        ) VALUES (
            :registration_id, :surname, :first_name, :middle_name,
            :father_name, :mother_name, :dob, :aadhar, :gender,
            :whatsapp, :alt_number, :email, :address,
            :category, :fee_category, :fee_amount,
            :present_school, :prev_std, :prev_board, :exam_language, :exam_centre,
            :course, :academic_year,
            :payment_id, :order_id, :razorpay_signature, :payment_status,
            :photo, :bonafide_doc, :aadhar_doc
        )
    ");

    $stmt->execute([
        ':registration_id'    => $data['registration_id'],
        ':surname'            => $data['surname'] ?? '',
        ':first_name'         => $data['first_name'] ?? '',
        ':middle_name'        => $data['middle_name'] ?? '',
        ':father_name'        => $data['father_name'] ?? '',
        ':mother_name'        => $data['mother_name'] ?? '',
        ':dob'                => $data['dob'] ?? null,
        ':aadhar'             => $data['aadhar'] ?? '',
        ':gender'             => $data['gender'] ?? '',
        ':whatsapp'           => $data['whatsapp'] ?? '',
        ':alt_number'         => $data['alt_number'] ?? '',
        ':email'              => $data['email'] ?? '',
        ':address'            => $data['address'] ?? '',
        ':category'           => $data['category'] ?? '',
        ':fee_category'       => $data['fee_category'] ?? '',
        ':fee_amount'         => $data['fee_amount'] ?? 0,
        ':present_school'     => $data['present_school'] ?? '',
        ':prev_std'           => $data['prev_std'] ?? '',
        ':prev_board'         => $data['prev_board'] ?? '',
        ':exam_language'      => $data['exam_language'] ?? '',
        ':exam_centre'        => $data['exam_centre'] ?? '',
        ':course'             => $data['course'] ?? '6th',
        ':academic_year'      => $data['academic_year'] ?? '2026-27',
        ':payment_id'         => $data['payment_id'] ?? '',
        ':order_id'           => $data['order_id'] ?? '',
        ':razorpay_signature' => $data['razorpay_signature'] ?? '',
        ':payment_status'     => $data['payment_status'] ?? 'PAID',
        ':photo'              => $data['photo'] ?? '',
        ':bonafide_doc'       => $data['bonafide_doc'] ?? '',
        ':aadhar_doc'         => $data['aadhar_doc'] ?? '',
    ]);

    echo json_encode([
        'success'         => true,
        'registration_id' => $data['registration_id'],
        'message'         => 'Registration saved successfully'
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
