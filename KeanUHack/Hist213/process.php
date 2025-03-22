<?php
// Set headers to prevent caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Initialize variables for error messages
$errors = [];
$data = [];

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get and sanitize the email
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // Validate email
    if (empty($email)) {
        $errors['email'] = "Email address is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Please enter a valid email address";
    }
    
    // Validate password
    if (empty($password)) {
        $errors['password'] = "Password is required";
    } elseif (strlen($password) < 8) {
        $errors['password'] = "Password must be at least 8 characters long";
    }
    
    // If no errors, process the form
    if (empty($errors)) {
        // In a real application, you would:
        // 1. Check if the email already exists in your database
        // 2. Hash the password before storing it
        // 3. Save user data to database
        // 4. Create a user session
        
        // For demonstration, we'll just return success
        $data['success'] = true;
        $data['message'] = "Success! You're now registered.";
        $data['redirect'] = "download.html"; // Page to redirect to after successful signup
        
        // You could also save the email to a file or database here
        // file_put_contents('subscribers.txt', $email . PHP_EOL, FILE_APPEND);
    } else {
        $data['success'] = false;
        $data['errors'] = $errors;
    }
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// If it's not a POST request, redirect to the main page
header("Location: index.html");
exit;