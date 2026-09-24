$(document).ready(function(){
    /** Recupera password dimenticata. */
    $('body')
    .on('submit', 'form#recover_password', function(e){
        e.preventDefault();
        setTimeout(()=>{
        Swal.fire({
            title: "Ti è stata inviata una email.",
            text: "Controlla la tua email è troverai informazioni per recuperare la tua password.",
            icon: "success",
            confirmButtonText: 'Chiudi' 
            }).then((result) => {
                if(result.isConfirmed == true){
                    setTimeout(()=>{
                      window.location.reload();
                    },500);
                    
                }
             });
        },500);
    });
});