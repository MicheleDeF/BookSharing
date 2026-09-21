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

function checkPasswordMatch() {
    var password = $('form#registration').find("input#password").val();
    var confirmPassword = $('form#registration').find("input#password_confirm").val();
    if (password != confirmPassword)
         $('form#registration').find("input#password_confirm").addClass('is-invalid');    
    else     
       $('form#registration').find("input#password_confirm").removeClass('is-invalid');   
}

$(document).ready(function(){

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

$('form#registration')
.find("input#password_confirm")
.keyup(checkPasswordMatch);

/** Submit Registration Form */
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
                 
                if(element.name == 'first_name' || 
                   element.name == 'last_name'  ||
                   element.name == 'email'      ||
                   element.name == 'password'   ||
                   element.name == 'password_confirm' ||
                   element.name == 'address'    ||
                   element.name == 'latitude'   ||
                   element.name == 'longitude'  ||
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
            "data": JSON.stringify(data),
            };

            $.ajax(settings).done(function (response) {
              console.log(response);
            });
          
        }
});


});