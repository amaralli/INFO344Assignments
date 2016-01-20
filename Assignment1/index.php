<?php
require_once 'connection.php';
require_once 'models/movies-model.php';

$q = $_GET['q'];

$conn = getConnection();
$moviesModel = new GrabMovies($conn);
$matches = $moviesModel->search($q);

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta charset="UTF-8">
    <link rel="icon" href="img/Film-Icon.png">
    <title>Movie Database</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" 
    integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

</head>
<body>
    <?php
        include 'views/search-view.php';
        include 'views/matches.php';
    ?>

</body>
</html>