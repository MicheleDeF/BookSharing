$(document).ready(function(){

geolocationStart('registration');

function checkPasswordMatch() {
    var password = $('form#registration').find("input#password").val();
    var confirmPassword = $('form#registration').find("input#password_confirm").val();
    if (password != confirmPassword)
         $('form#registration').find("input#password_confirm").addClass('is-invalid');    
    else     
       $('form#registration').find("input#password_confirm").removeClass('is-invalid');   
}

$('form#registration')
.find("input#password_confirm")
.keyup(checkPasswordMatch);

/** Submit Registration Form */
$('body')
.on('submit', 'form#registration', function(e){
e.preventDefault();
var $form = $(this);
let form = $(this)[0];
var data = new FormData();
var elements = form.elements;

        if (form.checkValidity() === false) {
            form.classList.add('was-validated');                 
            return false;
        }else{
   
          for (var i = 0, element; element = elements[i++];) {               
                 
                if(element.name == 'first_name' || 
                   element.name == 'last_name'  ||
                   element.name == 'email'      ||
                   element.name == 'password'   ||
                   element.name == 'password_confirm' ||
                   element.name == 'address'    ||
                   element.name == 'radius'     ||
                   element.name == 'latitude'   ||
                   element.name == 'longitude'  ||
                   element.name == 'agree_terms'){

                     data.append(element.name, element.value);

                }                
          }

          for (var d of data.entries()) {
              console.log(d); 
              // Do whatever with d
          }

          /** request ajax >> */
          
        }
});


});