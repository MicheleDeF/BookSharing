/** Questa funzione visualizza la password inserita 
 *  all'atto della registrazione passando il mouse sul
 *  pulsante a forma di occhio.
 */
function viewPassword(item) {
    var $inputPassword = $(item).siblings('input[type=password]');
    $(item)
        .hover(function () {
            $inputPassword.attr('type', 'text');
        }, function () {
            $inputPassword.attr('type', 'password');
        }
        ).click(function (e) { e.preventDefault(); });
}

/** Questa funzione verifica che i campi 'password' e 'password_confirm' siano uguali. */
function checkPasswordMatch() {
    var password = $('form#registration').find("input#password").val();
    var confirmPassword = $('form#registration').find("input#password_confirm").val();
    if (password != confirmPassword)
         $('form#registration').find("input#password_confirm").addClass('is-invalid');    
    else     
       $('form#registration').find("input#password_confirm").removeClass('is-invalid');   
}

$(document).ready(function(){

  /** Carica i dati di geolocalizzazione utente 
   *  nel form di registrazione (campi nascosti 'latitude' e 'longitude').
   */
  setInterval(()=>{
  if( localStorage.getItem('display_name_address') !== null && 
    localStorage.getItem('latitude') !== null && 
    localStorage.getItem('longitude') !== null){
    let latitude = localStorage.getItem('latitude');
    let longitude = localStorage.getItem('longitude');
    let display_name_address = localStorage.getItem('display_name_address');
    $(`form#registration`).find('input#latitude').val(latitude);
    $(`form#registration`).find('input#longitude').val(longitude);
    $(`form#registration`).find('input#address').val(display_name_address);

}
}, 2000); 

/** Verifica compatibilità campi 'password' e 'password_confirm' */
$('form#registration')
.find("input#password_confirm")
.keyup(checkPasswordMatch);

/** Registrazione utente */
$('body')
.on('submit', 'form#registration', function(e){
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
                 
                if(element.name == 'first_name'  || 
                   element.name == 'last_name'   ||
                   element.name == 'description' ||
                   element.name == 'email'       ||
                   element.name == 'password'    ||
                   element.name == 'password_confirm' ||
                   element.name == 'address'     ||
                   element.name == 'latitude'    ||
                   element.name == 'longitude'   ||
                   element.name == 'agree_terms'){

                     data[element.name] = element.value;            

                }                
          }

          /** request ajax >> */
          var settings = {
            "url": "/api/user-registration",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "beforeSend": function (xhr) {
                $('#divLoading').addClass('show');
            },
            "success": function(result,status,xhr){
               console.log(result);
               Swal.fire({
                    title: result.message,
                    text: "Ti è stata inviata un'email per attivare l'account.",
                    icon: "success",
                    confirmButtonText: "Chiudi"
                    }).then((r) => {
                        if (r.isConfirmed) location.href = "/";                    
                    });
            },
            "complete": function(xhr,status){
                $('#divLoading').removeClass('show'); 
            },
            "error": function(xhr,status,error){
                $('#divLoading').removeClass('show');
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: xhr.responseJSON.message,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "Chiudi",                    
                    });
            },
            "data": JSON.stringify(data),
            };

            $.ajax(settings);
          
        }
     });
});