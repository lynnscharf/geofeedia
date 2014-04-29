$( "#dialog" ).dialog({ modal: true,
                        autoOpen: false,
                        title: "Copy the code below and paste it where you want the map to appear on your website.",
                        height: 300,
                        width: 350,
                        buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ],
                        position: { my: "center", at: "center", of: window },
                      });


$(document).ready(function() {
  $('#form_geofeedia').submit(function(e) {
    e.preventDefault();

    var formdata = $("#form_geofeedia").serialize();
    var val = $("input[type=submit][clicked=true]").val();
    var url = "submit.php"; 
    var prevurl = "preview.php";

    if (val == 'Get code') {
      $.ajax({
        type: "POST",
        url: url,
        data: formdata
        
      }).done(function(data) {

        console.log(data);
       
        $('textarea').val(data);

        $('#dialog').dialog("open");

      });
    };

    if (val == 'Preview') {
      $.ajax({
        type: "POST",
        url: prevurl,
        data: formdata,
        async: false
        
      }).done(function(preview_url) {
        // var data = $.parseJSON(data);
        // we have the full iframe as data

        window.open(preview_url, '_blank');

        // $('textarea').val(data);

        // $('#dialog').dialog("open");

      });
    };



  });

});

$("form input[type=submit]").click(function() {
    $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
});


