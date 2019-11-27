<?php
/* Attempt MySQL server connection. Assuming you are running MySQL
server with default setting (user 'root' with no password) */
$link = mysqli_connect("localhost", "u526010955_pfernandom", "S3curity1", "u526010955_blog_metrics");
 
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
 
// Print host information
echo "Connect Successfully. Host info: " . mysqli_get_host_info($link);

?>
