$(document).ready(function(){

    $('body')
    .on('submit', 'form#sendMesssageOnDetailBook', function (e) {
        e.preventDefault();
        let recipient = $(this).find('[name="recipient"]').val();
        let bookId = $(this).find('[name="bookId"]').val();
        let text = $(this).find('[name="textRecipient"]').val();

        var settings = {
            "url": "/api/send-message-book-detail-page",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "beforeSend": function (xhr) {
                $('#divLoading').addClass('show');
             },
            "success": function(result,status,xhr){
                Swal.fire({
                icon: "success",
                title: result.message,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "Chiudi",
                }).then((r) => {
                if (r.isDismissed) window.location.reload();
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
                    text: "Si è verificato un errore!",
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "Chiudi",                    
                    });
             },
            "data": JSON.stringify({
                "recipient": recipient,
                "text": text,
                "bookId": bookId
            }),
            };

            $.ajax(settings);

    });


});