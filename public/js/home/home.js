$(document).ready(function(){

    /** Questo è l'evento 'submit' associato al modulo web nella home page per visualizzare dati sulla mappa. */
    $('body')
        .on('submit', 'form#bookSearch', function (e) {
            e.preventDefault();
            var $form = $(this);
            let category = $form.find('select#category').val();
            let lat = localStorage.getItem('latitude');
            let lon = localStorage.getItem('longitude');
            window.location.href = `/view-map?category=${category}&lat=${lat}&lon=${lon}`;
        });

    /** Mostra i libri nelle vicinanze inseriti di recente  */
     let latitude = document.cookie.split('; ').find(row => row.startsWith('latitude='))?.split('=')[1];
     let longitude = document.cookie.split('; ').find(row => row.startsWith('longitude='))?.split('=')[1];
     
     if(latitude !=="undefined" && longitude !=="undefined"){
        var latestCars = "";
        latestBooks.forEach(element => {

            let card = `<div class="col">
                            <div class="card" style="width: 20rem;">
                                <img src="${element.cover}" class="card-img-top">
                                <div class="card-body">
                                    <h6 class="card-title">${element.title}</h6>
                                    <p><em>Autore: ${element.author}</em></p>
                                    <p class="card-text">${truncate(element.description)}</p>
                                    <a href="/book/${element.id}/${element.slug}" class="btn btn-primary">
                                        Vai al dettaglio <i class="fa-solid fa-arrow-right-long"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`;
            latestCars+=card;
        });

        setTimeout(()=>{$('body').find('div#latestBooks').html(latestCars);}, 2000);        
     }
});