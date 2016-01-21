<!--This file handles the building of each item in the table of movie data, showing title
data released, the number of tickets sold and the gross sales-->
<h1>Matches</h1>

<?php date_default_timezone_set('America/Los_Angeles')?>

<table class="table table-striped table-hover table-bordered"> 
    <tr>
        <th>Title</th>
        <th>Date Released</th>
        <th>Tickets Sold</th>
        <th>Gross Sales</th>
    </tr>
    <?php foreach($matches as $match): ?>
    <tr>
        <td><a href="details.php?id=<?= htmlentities($match['id']) ?>">
            <?= htmlentities($match['title']) ?></a></td>
        <td><?= htmlentities($date = date("j-M-Y", strtotime($match['released']))) ?></td>
        <td><?= htmlentities(number_format($match['tickets'])) ?></td>
        <td>$<?= htmlentities(number_format($match['gross'])) ?></td>
    </tr> 
    <?php endforeach; ?>
</table>