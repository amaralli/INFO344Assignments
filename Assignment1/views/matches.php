<h1>Matches</h1>

<table class="table table-striped table-hover"> 
    <tr>
        <th>Title</th>
        <th>Date Released</th>
        <th>Tickets Sold</th>
        <th>Gross Sales</th>
    </tr>
    <?php foreach($matches as $match): ?>
    <tr>
        <td><a href="models/details.php?id=<?= htmlentities($match['id']) ?>">
            <?= htmlentities($match['title']) ?></a></td>
        <td><?= htmlentities($date = date("j-M-Y", strtotime($match['released']))) ?></td>
        <td><?= htmlentities(number_format($match['tickets'])) ?></td>
        <td>$<?= htmlentities(number_format($match['gross'])) ?></td>
    </tr> 
    <?php endforeach; ?>
</table>