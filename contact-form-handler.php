<?php
    $name = $_Post['name'];
    $visitor_email = $_Post['email'];
    $message = $_POST['message'];

    $email_form = 'hana1uddin@gmail.com';
    $email_subject = "New Form  Submission";
    $email_body = "User Name: $visitor_email.\n".
                        "User Email: $visitor_email.\n".
                            "User Message: $message.\n";

$to = "hana1uddi@gmail.com";
$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $visitor_email \r\n";
mail($to,$email_subject,$email_body,$headers);
header("Location: index.html");
?>