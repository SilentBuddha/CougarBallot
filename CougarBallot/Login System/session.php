<?php
// Start the session
session_start();

// if the user is already logged in then redirect user to welcome page
if (isset($_SESSION["id"]) && $_SESSION["id"] === true) {
    header("location: C:/Users/pickf/Documents/CSCI362/election/src/landing.html");
    exit;
}
?>