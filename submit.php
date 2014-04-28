<?php
// print_r($_SERVER['REQUEST_METHOD']);
include_once('db-connection.php');

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
  
  $locjson = json_decode(str_replace("'",'"',$row['address_location']));
  
  $host = "http://" . $_SERVER['HTTP_HOST'];

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
  
  print $string;
}

?>
