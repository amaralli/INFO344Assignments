<!--This file establishes the secure connection between the fucntions that pull and use the
data in the database-->
<?php
function getConnection() {
    require_once 'secret/db-credentials.php';

    try {
        $conn = new PDO("mysql:host=$dbHost;port=3306;dbname=$dbDatabase",
            $dbUser, $dbPassword);

        return $conn;

    } catch(PDOException $e){
        die('Could not connect to database ' . $e);
    }
}
?>