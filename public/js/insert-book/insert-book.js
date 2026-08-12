$(document).ready(function(){
    
geolocationStart('insert-book');

let cropper;
const $coverUpload = $('#cover-upload');
const $cropperModal = new bootstrap.Modal(document.getElementById('cropperModal'));
const imageToCrop = document.getElementById('imageToCrop');
let croppedBlob = null; 

$coverUpload.on('change', function (e) {  
    const files = e.target.files;
    if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();        
        reader.onload = function (event) {
            imageToCrop.src = event.target.result;            
            $cropperModal.show();
        };
        reader.readAsDataURL(file);
    }
});

$('#cropperModal').on('shown.bs.modal', function () {
    cropper = new Cropper(imageToCrop, {
        aspectRatio: 600 / 800, 
        viewMode: 1,       
        autoCropArea: 0.9     
    });
}).on('hidden.bs.modal', function () {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
});

$('#cropButton').on('click', function () {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({
        width: 600, 
        height: 800,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    canvas.toBlob(function (blob) {
        croppedBlob = blob;
        $('#cover-preview').attr('src', canvas.toDataURL('image/jpeg'));     
        $cropperModal.hide();
    }, 'image/jpeg', 0.85);
});


/** Submit insert-book Form */
$('body')
.on('submit', 'form#insert-book', function(e){
e.preventDefault();
var $form = $(this);
let form = $(this)[0];
var data = new FormData();
var elements = form.elements;

  if (form.checkValidity() === false) {
        form.classList.add('was-validated');
        return false;
    } else {

        for (var i = 0, element; element = elements[i++];) { 

                if( element.name == 'title'        || 
                    element.name == 'author'       || 
                    element.name == 'publish_year' || 
                    element.name == 'category'     || 
                    element.name == 'address'      ||
                    element.name == 'radius'       ||
                    element.name == 'description'  ||
                    element.name == 'latitude'     ||
                    element.name == 'longitude'
                ){

                    data.append(element.name, element.value);

                }else if(element.name == 'cover'){

                 if (croppedBlob) {
                      data.set('copertina_libro', croppedBlob, 'copertina.jpg');
                    }
                }
         }


        for (var d of data.entries()) {
              console.log(d); 
              // Do whatever with d
          }


    }


});


});