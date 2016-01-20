<h1><?= htmlentities($resultId[0]['title'])?></h1>
<p><?= htmlentities($resultId[0]['genre'])?> movie rated <?= htmlentities($resultId[0]['rating'])?></p>
<p>Released on <?= htmlentities($resultId[0]['released'])?></p>
<p>This movie sold <?= htmlentities($resultId[0]['tickets'])?> tickets, earning gross revenues of $<?= htmlentities($resultId[0]['gross'])?></p>
