$("#btreg").click((event) => {
    event.preventDefault();
    let data = {};
    $("#regform").serializeArray().forEach(atr => data[atr.name] = atr.value);
    if(data.repeated != data.password) 
        $('#notifications')
            .append('<div class="alert alert-danger"><div class="container"><div class="alert-icon"><i class="material-icons">'+
                'error_outline</i></div><button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true"><i class="material-icons">clear</i></span></button><b>Error Alert:</b> Ooopppsss.... '+
                'The entered passwords do not match.</div></div><div class="clearfix"></div>')
    else{
        delete data.repeated;
        var xhr = new XMLHttpRequest();   // new HttpRequest instance 
        xhr.open("POST", "http://localhost:3000/v1/users/");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            var result = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "201") {
                $('#signupModal').modal('hide');
                $('#smallAlertModal').modal('show'); 
            } else {
                $('#notifications')
                    .append('<div class="alert alert-danger"><div class="container"><div class="alert-icon"><i class="material-icons">'+
                        'error_outline</i></div><button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true"><i class="material-icons">clear</i></span></button><b>Error Alert:</b>'+result.userMessage+
                        '</div></div><div class="clearfix"></div>');
            }
        }
        xhr.send(JSON.stringify(data));
    }    
});
$("#btok").click((event) => {
    $(smallAlertModal).modal('hide');
});