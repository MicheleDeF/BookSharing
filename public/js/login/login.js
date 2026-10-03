$(document).ready(function(){

/** Login utente. */
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
                    /** Salva le informazioni di geolocalizzazione nei localStorage. */
                    localStorage.setItem('latitude', dati.lat);  
                    localStorage.setItem('longitude', dati.lon);   
                    localStorage.setItem('display_name_address', dati.address);   
                    /** Salva latitudine e longitudine nei cookies. */ 
                    document.cookie = `latitude=${dati.lat}`;
                    document.cookie = `longitude=${dati.lon}`;
                    /** Effettua il redirect alla 'dashboard' */
                    location.href = "/dashboard";                   
                 },
                 "error": function(jqXHR, textStatus, errorThrown){
                    $('#divLoading').removeClass('show');
                     Swal.fire({
                           title: "Oops...",
                           text: "Credenziali non valide!",
                           icon: "error",
                           cancelButtonColor: "#3085d6",
                           cancelButtonText: "Chiudi",
                     })
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