$(document).ready(function(){

/** Ritaglio immagine a 600x800 con Cropper (https://fengyuanchen.github.io/cropperjs/guide.html)
 *  e jquery-cropper (https://github.com/fengyuanchen/jquery-cropper).
 */
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

/** Assegna il valore al campo input tipo file. */
var urlCover = $('form#edit-book').find('input#cover-upload').data('uri');
const controlExt = urlCover.toLowerCase().endsWith('.jpg');
const fileInput = document.querySelector('input[type="file"]');

async function setInputFile(){

    try {
        const response = await fetch(urlCover, { cache: "no-cache" });
        const blob = await response.blob();
        croppedBlob = blob;
        const fileName = (controlExt) ? urlCover.substring(urlCover.lastIndexOf('/') + 1) : urlCover.substring(urlCover.lastIndexOf('/') + 1) + '.jpg';
        const file = new File([blob], fileName, { type: blob.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

    } catch (error) {
        console.error(error);
    }
}

setInputFile();

/** Modifica uno specifico libro di un utente specifico. */
$('body').on('submit', 'form#edit-book', function (e) {
    e.preventDefault();
    let form = $(this)[0];
    var data = new FormData();
    var elements = form.elements;
    const url = new URL(window.location.href);
    const path = url.pathname; 
    const id = path.split('/').pop(); 

      if (form.checkValidity() === false) {
        form.classList.add('was-validated');
        return false;

      }else{

        for (var i = 0, element; element = elements[i++];) { 

                if( element.name == 'title'        || 
                    element.name == 'author'       || 
                    element.name == 'publish_year' || 
                    element.name == 'category'     || 
                    element.name == 'description'  
                ){

                    data.append(element.name, element.value);

                }else if(element.name == 'cover'){
                 if (croppedBlob) {
                      data.set('copertina_libro', croppedBlob, 'copertina.jpg');
                    }
                }
         }


        var settings = {
            "url": `/api/book/edit/${id}`,
            "method": "POST",
            "processData": false,
            "contentType": false,
            "beforeSend": function (xhr) {
                $('#divLoading').addClass('show');
            },
            "success": function(result,status,xhr){
               
               Swal.fire({
                    title: result.message,                    
                    icon: "success",
                    confirmButtonText: "Chiudi"
                    }).then((r) => {
                        if (r.isConfirmed) window.location.reload();                    
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
            "data": data
       };

       $.ajax(settings);
      }
});


});