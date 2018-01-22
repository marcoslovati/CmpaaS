$("#btlogin").click((event) => {
    let data = {};
    $("#formlogin").serializeArray().forEach(atr => data[atr.name] = atr.value);
    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open("POST", "http://localhost:3000/v1/auth/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == "204") {
            var token = xhr.getResponseHeader("X-Access-Token");
            localStorage.token = token;
            $('#loginModal').modal('hide');
            location.reload();
        } else {
            var result = JSON.parse(xhr.responseText);
            $('#notifications')
                .append('<div class="alert alert-danger"><div class="container"><div class="alert-icon"><i class="material-icons">'+
                    'error_outline</i></div><button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true"><i class="material-icons">clear</i></span></button><b>Error Alert:</b>'+result.userMessage+
                    '</div></div><div class="clearfix"></div>');
        }
    }
    xhr.send(JSON.stringify(data));
    
});

$("#btLogout").click((event) => {
    localStorage.removeItem("token");
    location.reload();
});
$("#btDashboard").click((event) => {
    window.location.href = "http://localhost:3000/dashboard";
});