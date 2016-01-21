<?php
 
 class GrabSingleMovie {
     protected $conn;
 
     public function __construct($conn) {
        $this->conn = $conn;
     }
 
    //searches through the movie database by its unique key,
    //should only ever return one option
     public function searchById($query) {
         $sql = 'select * from movies where id=?';
         $statement = $this->conn->prepare($sql);
         $success = $statement->execute(array($query));
         if(!$success) {
             trigger_error($statement->errorInfo());
         } else {
             return $statement->fetchAll();
         }
     }
 
 	 //searches through the movie database by the imbd id,
    //which not all movies in the database have. May return one
    //or no results
     public function searchByImdb($query) {
         $sql = 'select * from movies where imdb_id=?';
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