$( "#dialog" ).dialog({ autoOpen: false,
                        title: "Copy the code below and paste it where you want the map to appear on your website.",
                        height: 300,
                        width: 350,
                        buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ],
                        position: { my: "center", at: "center", of: window },
                      });

// $(".ui-dialog-titlebar-close", ui).hide();

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



