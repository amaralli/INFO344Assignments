<h1>Rotten Tomatoes Rating</h1>

    <?php foreach($results as $result): ?>
        <ul>
            <li>Directed By:<?= htmlentities($result->Director) ?></li>
            <li>Notable Actors:<?= htmlentities($result->Actors) ?></li>
            <li><?= htmlentities($result->Plot) ?></li>
            <li>Notable Awards:<?= htmlentities($match->Awards) ?></li>
        </ul> 
    <?php endforeach; ?>


