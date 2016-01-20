<?php
    require_once '../connection.php';
    require_once 'details-model.php';

    $q = $_GET['id'];

    $conn = getConnection();
    $movieModel = new GrabSingleMovie($conn);
    $resultId = $movieModel->searchById($q);
    $resultImdbId = $movieModel->searchByImdb($resultId[0]['imdb_id']);
    $id = $resultId[0]['imdb_id'];

    if(count($resultImdbId) == 1) {
        $url = "http://www.omdbapi.com/?i={$id}&tomatoes=true";
        echo $url;
        $json = file_get_contents($url);
        $results = json_decode($json);
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlentities($resultId[0]['title']) ?></title>
</head>
<body>
     <?php
        include '../views/general-details.php';
        include '../views/rotten-view.php';
    ?>
</body>
</html>