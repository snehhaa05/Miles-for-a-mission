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
