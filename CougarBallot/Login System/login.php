<?php
require_once "config.php";
require_once "session.php";


$error = '';


if ($_SERVER["REQUEST_METHOD"] == "POST") { //&& isset($_POST['submit'])


    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username)) {
       
        $error .= '<p class=error>Please enter username.</p>';
    }

    // validate if password is empty
    if (empty($password)) {
        $error .= '<p class=error>Please enter your password.</p>';
    }

    if (empty($error)) {
        if ($query = $db->prepare("SELECT * FROM admins WHERE username = ?")) {
            $query->bind_param('s', $username);
            $query->execute();
            $result = $query->get_result();
            $user =  $result->fetch_assoc();
            $row = $query->fetch();
            if (!empty($user)) {
                echo("Welp"); 
                if($query = $db->prepare("SELECT * FROM admins WHERE username = ?")) {
                    if (password_verify($password, $user['password'])) {
                        $_SESSION["userid"] = true;
                       $_SESSION["user"] = $user['username'];
                       header("location: choose_privilege.html");
                       // header("location: C:/Users/pickf/Documents/CSCI362/election/src/landing.html");
                        exit;
                    } else {
                        $error .= '<p class=error>The password is not valid.</p>';
                    }
                }
            }
            else if($query = $db->prepare("SELECT * FROM users WHERE username = ?")) {
                $query->bind_param('s', $username);
                //echo $username;
                $query->execute();
                //$query->bind_result($w, $x, $y, $z);
                //echo $y;
                $result = $query->get_result();
                $user =  $result->fetch_assoc();
                //echo $user['password']; 
                // $query->bind_result($id, $y, $result, $z);
                $row = $query->fetch();
                //echo $row;
                if (!empty($user)) {
                    if($query = $db->prepare("SELECT * FROM users WHERE username = ?")) {
                        if (password_verify($password, $user['password'])) {
                            $_SESSION["userid"] = true;
                            $_SESSION["user"] = $user['username'];
                            header("location: http://localhost:3000/index.html");
                            //header("location: choose_privilege.html");
                            // header("location: C:/Users/pickf/Documents/CSCI362/election/src/landing.html");
                            exit;
                        } else {
                            $error .= '<p class=error>The password is not valid.</p>';
                        }
                    }
                }
            } 
            else {
                $error .= '<p class=error>No User exist with that email address.</p>';
            }
        }
        $query->close();
    }    
    mysqli_close($db);
}
?>

<!DOCTYPE html>
<html lang=en>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Login</title>

        <!-- Bootstrap -->
        <!-- <link href="css/bootstrap.min.css" rel="stylesheet">
        <link href="css/CSSFrontEnd.css" rel="stylesheet" > -->
        <link href = "/Login.css" rel = "stylesheet">
    </head>
    <body>
        <div class="container">
            <div class = row>
                <div class="col-md-12">
                <h1 class="text-center"><b>College of Charleston</b></h1>
                    <h2 class="text-center"><b>CougarBallot Login</b></h2>
                    <p> Please enter your username and password.</p>
                    <?php echo $error; ?>
                    <form action="" method="post">
                        <div class=form-group>
                            <label>Username</label>
                            <input type=Username name=username class=form-control required />
                        </div>    
                        <div class=form-group>
                            <label>Password</label>
                            <input type=password name=password class=form-control required>
                        </div>
                        <br>
                        <div class="form-group">
                            <input type = "submit" name="submit" class = "btn btn-primary" value="Submit">
                        </div>
                        <p>Trouble logging in? <a href=https://help.cofc.edu>Contact support</a>.</p>
                    </form> 
                </div> 
            </div>          
        </div>              
    </body>
</html>