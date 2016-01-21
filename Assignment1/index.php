<?php
require_once 'connection.php';
require_once 'models/movies-model.php';

/*Builds the main landing page the user sees for the movie revenue database
Shows the user the full list of movies, but the user may parse down the data by
using the search functionality. The user may also click the link to see more data
about the movie*/

$q = $_GET['q'];

$conn = getConnection();
$moviesModel = new GrabMovieData($conn);
$matches = $moviesModel->searchByTitle($q);

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta charset="UTF-8">
    <link rel="icon" href="img/Film-Icon.png">
    <title>Movie Database</title>

    <!--Bootstrap functionality-->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" 
    integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

</head>
<body background='img/confectionary/confectionary.png'>
    <div class="container">
        <?php
            include 'views/search-view.php';
            include 'views/matches.php';
        ?>
    </div>
</body>
</html>