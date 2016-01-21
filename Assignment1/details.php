<!--Builds the page users can look to for more detailed
    information about the movie they selected-->

<?php
    require_once 'connection.php';
    require_once 'models/movies-model.php';

    $q = $_GET['id'];

    $conn = getConnection();
    $movieModel = new GrabMovieData($conn);
    $resultId = $movieModel->searchById($q);
    $resultImdbId = $movieModel->searchByImdb($resultId[0]['imdb_id']);
    $id = $resultId[0]['imdb_id'];

    if(count($resultImdbId) == 1) {
        $url = "http://www.omdbapi.com/?i={$id}&tomatoes=true";
        $json = file_get_contents($url);
        $results = json_decode($json);
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlentities($resultId[0]['title']) ?></title>
    <link rel="icon" href="img/Film-Icon.png">

    <!--Bootstrap functionality-->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" 
    integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

</head>
<body background="img/pink_rice/pink_rice.png">
    <div class='container'>
        
        <h1><?= htmlentities($resultId[0]['title'])?></h1>

        <h4><?= htmlentities($resultId[0]['genre'])?> movie rated <?= htmlentities($resultId[0]['rating'])?></h4>
        <h4>Released on <?= htmlentities($resultId[0]['released'])?></h4>
        <h4>This movie sold <?= htmlentities(number_format($resultId[0]['tickets']))?> tickets,
        earning gross revenues of $<?= htmlentities(number_format($resultId[0]['gross']))?></h4>

        <h1>Rotten Tomatoes Details</h1>

        <h5><?= htmlentities($results->Plot) ?></h5>
        <h5>Directed By: <?= htmlentities($results->Director) ?></h5>
        <h5>Notable Actors:<?= htmlentities($results->Actors) ?></h5>
        <h5>Notable Awards: <?= htmlentities($results->Awards) ?></h5>
    </div>
</body>
</html>








