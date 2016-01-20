<h1>Matches</h1>

<table class=".table-striped"> 
    <tr>
        <th>Title</th>
        <th>Date Released</th>
        <th>Tickets Sold</th>
        <th>Gross Sales</th>
    </tr>
    <?php foreach($matches as $match): ?>
    <tr>
        <td><?= htmlentities($match['title']) ?></td>
        <td><?= htmlentities($match['released']) ?></td>
        <td><?= htmlentities($match['tickets']) ?></td>
        <td><?= htmlentities($match['gross']) ?></td>
    </tr> 
    <?php endforeach; ?>
</table>