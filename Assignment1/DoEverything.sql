use movies;

drop table if exists movies;

create table movies (title varchar(72) not null,released varchar(64),distributor varchar(64),genre varchar(32),rating varchar(10),gross varchar(15),tickets varchar(15),imdb_id varchar(15),id int auto_increment not null primary key);

load data local infile '/var/www/html/Assignment1/data/movies-2014.csv'
into table movies
fields terminated by ','
optionally enclosed by '"'
ignore 1 lines
(title, released, distributor, genre,  rating, gross, tickets, imdb_id);

