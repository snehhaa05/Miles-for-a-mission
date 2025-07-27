<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "marathon_db";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed");
}

$usernameOrEmail = $_POST['emailOrUsername'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usernameOrEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        echo "success";
    } else {
        echo "invalid";
    }
} else {
    echo "invalid";
}
?>
