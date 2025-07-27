<?php
$server = "localhost";
$username = "root";
$password = "";
$dbname = "marathon1";

$con = mysqli_connect($server, $username, $password, $dbname);

if (!$con) {
    echo("Connection failed: " . mysqli_connect_error());
}
 else {
    echo "connected";
}

$fullName = $_POST['fullName'];
$email = $_POST['email'];
$phone = $_POST['phone']; // <-- CORRECT variable name
$passwordPlain = $_POST['password'];
$confirmPassword = $_POST['confirmpassword'];  // Match the HTML name exactly!
$weight = $_POST['weight'];
$height = $_POST['height'];
$bloodGroup = $_POST['bloodGroup'];
$medicalConditions = $_POST['conditions']; // Should match form field name

// Password check
if ($passwordPlain !== $confirmPassword) {
    echo("Passwords do not match.");
}

// Hash password for security
$passwordHash = password_hash($passwordPlain, PASSWORD_DEFAULT);

// Handle file upload
$photoPath = '';
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    if (!is_dir('uploads')) {
        mkdir('uploads', 0777, true);
    }
    $photoName = uniqid('user_', true) . '_' . basename($_FILES['photo']['name']);
    $photoPath = 'uploads/' . $photoName;
    if (!move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath)) {
        $photoPath = '';
    }
}

// Use prepared statements for safety!
$sql = "INSERT INTO `register` (`full_name`, `email`, `phone`, `password`, `weight`, `height`, `medical_conditions`, `blood_group`, `photo`) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($con, $sql);
mysqli_stmt_bind_param($stmt, "ssssddsss", $fullName, $email, $phone, $passwordHash, $weight, $height, $medicalConditions, $bloodGroup, $photoPath);

if (mysqli_stmt_execute($stmt)) {
    echo "Data submitted!";
} else {
    echo "Query failed: " . mysqli_error($con);
}

mysqli_stmt_close($stmt);
mysqli_close($con);
?>
