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

  // print "<pre>";
  // print "</pre>";

  $crypt = crypt($post['appid'].$post['appkey'].$post['collection'].$post['location'].$post['height'].$post['width']);

  $guid = crypt($crypt);

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
  return_data($guid, $post['height'], $post['width']);
}

/**
 * Retrieve data, prepare iframe
 * @var $guid guid created on insert
 */
function return_data($guid, $height, $width) {
  

  if (($width || $height) == '0') {
    $string = "<iframe height='" . $height . "' width='" . $width . "' src='" . "http://" . $_SERVER['HTTP_HOST'] . "/embed.php?guid=" . $guid . "' style='width: 100%; height: 100%;'></iframe>";
  } else {
    $string = "<iframe height='" . $height . "' width='" . $width . "' src='" . "http://" . $_SERVER['HTTP_HOST'] . "/embed.php?guid=" . $guid . "'></iframe>";
  }
  
  print $string;
  // print $guid;
}

?>
