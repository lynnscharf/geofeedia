<?php
// prepare db connection
// we'll cache the queries to stay speedy with prepared statements
$db = new PDO('mysql:dbname=geo_maps;host=http://localhost:8888/GeofeediaGit/;charset=utf8', 'root', 'root');

$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>