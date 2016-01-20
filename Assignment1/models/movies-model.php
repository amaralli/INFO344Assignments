<?php

class GrabMovies {
    protected $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

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