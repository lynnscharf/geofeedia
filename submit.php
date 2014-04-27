<?php

// prepare db connection
// we'll cache the queries to stay speedy with prepared statements
$db = new PDO('mysql:dbname=geo_maps;host=127.0.0.1;charset=utf8', 'root', '');

$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// print_r($_SERVER['REQUEST_METHOD']);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  gf_insert($_POST, $db);
}

/**
 * A mysql transaction hook
 *
 * @var $post $_POST
 * @var $op insert, update, delete 
 */
function gf_insert($post, $db) {

  // print "<pre>";n
  // print_r($_POST);
  // print "</pre>";

  // todo: more better encryption!
  $guid = crypt($post['appid'].$post['appkey'].$post['collection'].$post['location'].$post['height'].$post['width']);

  // we escape strings
  $preparedStatement = $db->prepare('INSERT INTO map (guid,
                                                      app_id,
                                                      app_key,
                                                      collection,
                                                      address_location,
                                                      width,
                                                      height
                                                      ) VALUES (
                                                        :guid,
                                                        :app_id,
                                                        :app_key,
                                                        :collection,
                                                        :address_location,
                                                        :width,
                                                        :height
                                                      )');

  $preparedStatement->execute(array('guid' => $guid,
                                    'app_id' => $post['appid'],
                                    'app_key' => $post['appkey'],
                                    'collection' => $post['collection'],
                                    'address_location' => $post['location'],
                                    'width' => $post['width'],
                                    'height' => $post['height']
                                    ));
  return_data($guid, $db);

}

/**
 * Retrieve data, prepare iframe
 * @var $guid guid created on insert
 * @var $db database connection object
 */
function return_data($guid, $db) {
  $statement = $db->prepare("select * from map where guid = :guid");
  $statement->execute(array(':guid' => $guid));

  $row = $statement->fetch();
  $locjson = json_decode($row['address_location']);

  $host = "http://geofeed";

  $height = $row['height'];
  $width = $row['width'];
  $guid = $row['guid'];
  $app_id = $row['app_id'];
  $app_key = $row['app_key'];
  $collection = $row['collection'];
  $lat = $locjson->lat;
  $lon = $locjson->lon;
  $zoom = $locjson->zoom;


  $string = "<iframe height='" . $height . "' width='" . $width . "' src='" . $host . "/embed.php?guid=" . $guid . "&appid=" . $app_id . "&appkey=" . $app_key . "&collection=" . $collection . "&lat=" . $lat . "&lon=" . $lon . "&zoom=" . $zoom . "'></iframe>";
  
  /* $string = "\"<iframe height=\"$row[height]\" width=\"$row[width]\" src=\"/embed.php?guid=$row[guid]&appid=$row[app_id]&appkey=$row[app_key]&collection=$row[collection]&lat=$locjson[lat];&lon=$locjson[lon];\"></iframe>\""; */

  // print_r($locjson->lat);
   // print_r($row['address_location']);
  // print json_encode($row);
  print $string;
}

// function pr($var_to_print_pretty) {
//   print "<pre>";
//   print_r $var_to_print_pretty;
//   print "</pre>";
// }

?>