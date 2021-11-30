<?php
// start the session
session_start();

// Check if the user is not logged in, then redirect the user to login page
if (session_destroy()) {
    header("location: login.php");
    exit;
}
?>
