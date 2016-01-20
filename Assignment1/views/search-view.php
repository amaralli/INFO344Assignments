<h1>Lookup a Movie from 2014!</h1>
<form action="" method="GET">
    <div class="form-group">
        <input type="text"
            id="queryInput"
            name="q"
            class="form-control"
            value="<?= htmlentities($q) ?>"
            placeholder="Enter a movie title"
            required
        >
    </div>
    <div class="form-group">
        <button class="btn btn-primary" type="submit"> Go! </button>
    </div>
</form>