$( "#dialog" ).dialog({ autoOpen: false });

$('#form_geofeedia').submit(function(e) {
  e.preventDefault();

  var url = "submit.php"; 

  $.ajax({
    type: "POST",
    url: url,
    data: $("#form_geofeedia").serialize() 
    
  }).done(function(data) {
    // var data = $.parseJSON(data);

    console.log(data);
   
    $('textarea').val(data);

    $('#dialog').dialog("open");

  });

  

});



