<!--This class handles interactions between the views (details.php and index.php) and the database
There are multiple types of search function, that differ by the query that is used to parse
through the data-->
<?php
class GrabMovies {
    protected $conn;

    //constructs model
    public function __construct($conn) {
        $this->conn = $conn;
    }       

    //handles the transfer of data out of the database
    public function search($query) {
        $sql = 'select * from movies where title like ?';
        $statement = $this->conn->prepare($sql);
        $success = $statement->execute(array("%".$query."%"));
        if(!$success) {
            trigger_error($statement->errorInfo());
        } else {
            return $statement->fetchAll();
        }
    }

} 
?>