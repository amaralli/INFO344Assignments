<?php

class GrabSingleMovie {
    protected $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

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