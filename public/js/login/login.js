$(document).ready(function(){

/** Submit login Form */
$('body')
.on('submit', 'form#login', function(e){
e.preventDefault();
var $form = $(this);
let form = $(this)[0];
var data = {};
var elements = form.elements;

        if (form.checkValidity() === false) {
            form.classList.add('was-validated');                 
            return false;
        }else{

            for (var i = 0, element; element = elements[i++];) { 
                if(element.name == 'email' || 
                   element.name == 'password'){
                    data[element.name] = element.value;
                }
             }

            var settings = {
                "url": "/api/login",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                 },
                 "beforeSend": function(xhr){
                   $('#divLoading').addClass('show');
                 },
                 "success": function(dati){         
                    location.href = "/dashboard";                   
                 },
                 "error": function(jqXHR, textStatus, errorThrown){
                    $('#divLoading').removeClass('show');
                    $form.find('div.alert').removeClass('d-lg-none');
                 },
                 "complete": function(comp){
                    $('#divLoading').removeClass('show');
                 },
                 "data": JSON.stringify(data),
                 };

                $.ajax(settings);
   

        }


});


});