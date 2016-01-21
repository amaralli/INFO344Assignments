<!--This class handles interactions between the views (details.php and index.php) and the database
There are multiple types of search function, that differ by the query that is used to parse
through the data-->
<?php
class GrabMovieData {
    protected $conn;

    //constructs model
    public function __construct($conn) {
        $this->conn = $conn;
    }

    //searches through the movie database by its unique key,
    //should only ever return one option
    public function searchById($query) {
        $sql = 'select * from movies where id=?';
        search($sql, $query);
    }

    //searches through the movie database by the imbd id,
    //which not all movies in the database have. May return one
    //or no results
    public function searchByImdb($query) {
        $sql = 'select * from movies where imdb_id=?';
        search($sql, $query);
    }

    //searches through the database by title, not guaranteed unique
    public function searchByTitle($query) {
        $sql = 'select * from movies where title like ?';
        search($sql, $query);
    }

    //handles the transfer of data out of the database
    public function search($sql, $query) {
        $statement = $this->conn->prepare($sql);
        $success = $statement->execute(array($query));
        if(!$success) {
            trigger_error($statement->errorInfo());
        } else {
            return $statement->fetchAll();
        }
    }

} 
?>