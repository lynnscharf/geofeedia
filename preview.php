<?php
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
  return_data($guid);
}

/**
 * Retrieve data, prepare iframe
 * @var $guid guid created on insert
 * @var $db database connection object
 */
function return_data($guid) {
  if (($width || $height) == '0') {
    $string = $host . "/prev.php?guid=" . $guid . "&height=100%&width=100%";
    
  } else {
    $string = $host . "/prev.php?guid=" . $guid;
  };

  print $string;
}

?>