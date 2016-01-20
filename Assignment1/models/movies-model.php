<?php

class GrabMovies {
    protected $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function search($query) {
        $sqlResults = 'select * from movies where title=?';
        $statement = $this->conn->prepare($sql);
        $success = $statement->execute(array($q));
        if(!success) {
            trigger_error($statement->errorInfo());
        } else {
            return $statement->fetchAll();
        }
    }
} 
?>