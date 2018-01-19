if(localStorage.token) {
    $("#mnRegister").attr("style", "display: none");
    $("#mnLogin").attr("style", "display: none");
    $("#mnTools").removeAttr("style");
}