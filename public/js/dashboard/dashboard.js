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
    var password = $('form#editProfile').find("input#password").val();
    var confirmPassword = $('form#editProfile').find("input#password_confirm").val();
    if (password != confirmPassword)
         $('form#editProfile').find("input#password_confirm").addClass('is-invalid');    
    else     
       $('form#editProfile').find("input#password_confirm").removeClass('is-invalid');   
}


$(document).ready(function(){

$('form#editProfile')
.find("input#password_confirm")
.keyup(checkPasswordMatch);

var itemsForPage = 10;
var currentIndex = 10; 

/** Visualizza il numero di libri che l'utente autenticato ha inserito. */
$('body').find('#totalBooks').text(userBooks.length);

/** Dalla documentazione di bootstrap, per inserire un link sul tab. */
$('ul#myDashboard > li > button[data-bs-toggle="tab"]')
.on('shown.bs.tab', function (e) {
    var targetHash = $(e.target).attr('data-bs-target') || $(e.target).attr('href');
    if (targetHash && targetHash.startsWith('#')) {
      history.pushState(null, null, targetHash);
    }
  });

  var currentHash = window.location.hash;
  if (currentHash) {
    var $activeTabTrigger = $('[data-bs-target="' + currentHash + '"], [href="' + currentHash + '"]');    
    if ($activeTabTrigger.length) {
      var tab = new bootstrap.Tab($activeTabTrigger[0]);
      tab.show();
    }
  }

  /** Questa funzione effettua la visualizzazione dei contenuti 
   *  nella dashboard utente allo scrollare della pagina.
   */
function loadMoreItems() {
    
    if (currentIndex >= userBooks.length) {
            $(window).off('scroll'); 
            return;
        }

        var nextItems = userBooks.slice(currentIndex, currentIndex + itemsForPage);
        nextItems.forEach(function(item) {
        var itemHtml = `<div class="col">
                         <div class="card" style="width: 20rem;">
                           <img src="${item.cover}" class="card-img-top">
                            <div class="card-body">
                             <h6 class="card-title">${item.title}</h5>
                              <p><em>Autore: ${item.author}</em></p>
                               <p class="card-text">${truncate(item.description)}</p>
                               <ul class="list-inline">
                                <li class="list-inline-item">
                                 <a href="/book/${item.id}/${item.slug}" class="btn btn-primary">Vai al dettaglio <i class="fa-solid fa-arrow-right-long"></i></a>
                                  </li>
                                   <li class="list-inline-item">
                                    <button type="button" class="btn btn-secondary">
                                     <i class="fa-solid fa-pen"></i>
                                      </button>
                                       </li>
                                        <li class="list-inline-item">
                                         <button type="button" id="deleteBook" class="btn btn-danger">
                                          <i class="fa-solid fa-trash"></i>
                                          </button>
                                          </li>
                                           </ul>                                
                                            </div>
                                             </div>
                                              </div>`;
        $('#content-container').append(itemHtml);
        });
        currentIndex += itemsForPage;
    }

     $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            loadMoreItems();
        }
    });

    /** Eliminazione di uno specifivo libro. */
    $('body').on('click', 'button#deleteBook', function (e) {
        e.preventDefault();
        var idBook = $(this).data('id');
        var title = $(this).data('title');
        Swal.fire({
            title: `Sei sicuro di voler cancellare <br/><strong>${title}</strong>?`,
            text: "Una volta cancellato non sarà più possibile recuperarlo.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            cancelButtonText: "Annulla",
            confirmButtonText: "Si, Cancella"
        }).then((result) => {
            if (result.isConfirmed) {
                 var settings = {
                    "url": `/api/book/${idBook}`,
                    "method": "DELETE",
                    "timeout": 0,
                    "processData": false,
                    "contentType": false,
                    "beforeSend": function (xhr) {
                       $('#divLoading').addClass('show');
                     },
                     "success": function(result,status,xhr){
                        Swal.fire({
                            title: `${result.message}`,
                            icon: "success",
                            confirmButtonText: "Chiudi"
                        }).then((r) => {
                             if (r.isConfirmed) location.href = "/dashboard";                    
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
                    }

                };

                $.ajax(settings); 
                
            }
        });
    });
  
    /** Inizio codice per generare grafici con chart.js (https://www.chartjs.org/docs/latest/getting-started/) */
    
    try {
    /** ordina "userBooks" per maggior numero di visualizzazioni e contatti*/
    const userBooksViews = userBooks.toSorted((a, b) => b.statistic.views - a.statistic.views);   
    const userBooksContacts = userBooks.toSorted((a, b) => b.statistic.contacts - a.statistic.contacts);  
    
        if(userBooksViews.length >= 4 && userBooksContacts.length >=4){

           const bookView = [];
           const bookContact = [];

           $('#statistics-tab-pane > .container-fluid > .row > main')
            .append(`<div class="g-4 mb-4 row"><div class="col-12 col-xl-6"><div class="card p-4"><div class="align-items-center d-flex mb-3"><div class="me-3 p-2 rounded bg-primary-subtle text-primary"><i class="fa-solid fa-eye"></i></div><div><h5 class="card-title mb-0">Visualizzazioni Top 4</h5><small class=text-muted>I 4 libri più visualizzati</small></div></div><div style=position:relative;height:300px;width:100%><canvas id=viewsChart></canvas></div></div></div><div class="col-12 col-xl-6"><div class="card p-4"><div class="align-items-center d-flex mb-3"><div class="me-3 p-2 rounded bg-success-subtle text-success"><i class="fa-solid fa-envelope"></i></div><div><h5 class="card-title mb-0">Richiste Top 4</h5><small class=text-muted>I 4 libri più richiesti</small></div></div><div style=position:relative;height:300px;width:100%><canvas id=contactsChart></canvas></div></div></div></div><div class="card mb-4 p-4"><nav><div class="nav nav-tabs"id=nav-tab role=tablist><button aria-controls=nav-views aria-selected=true class="active nav-link"data-bs-target=#nav-views data-bs-toggle=tab id=nav-views-tab role=tab type=button><h5 class="card-title mb-0"><i class="fa-list-check fa-solid me-2 text-primary"></i> Dettaglio Top 4 Libri più Visualizzti</h5></button> <button aria-controls=nav-requests aria-selected=false class=nav-link data-bs-target=#nav-requests data-bs-toggle=tab id=nav-requests-tab role=tab type=button><h5 class="card-title mb-0"><i class="fa-list-check fa-solid me-2 text-info"></i> Dettaglio Top 4 Libri più Richiesti</h5></button></div></nav><div class=tab-content id=nav-tabContent><div class="active fade show tab-pane"id=nav-views role=tabpanel aria-labelledby=nav-views-tab tabindex=0><div class=table-responsive><table class="table table-bordered border-primary"id=top_for_book_detail_views><thead><tr><th>Posizione<th>Titolo Libro<th>Autore<th>Genere<th>Anno di Pubblicazione<th class=text-end>Visualizzazioni<tbody></table></div></div><div class="fade tab-pane"id=nav-requests role=tabpanel aria-labelledby=nav-requests-tab tabindex=0><div class=table-responsive><table class="table table-bordered border-info"id=top_for_book_detail_requests><thead><tr><th>Posizione<th>Titolo Libro<th>Autore<th>Genere<th>Anno di Pubblicazione<th class=text-end>Contatti<tbody></table></div></div></div></div>`);


            for (let index = 0; index < 4; index++) {
                const element = userBooksViews[index];
                bookView.push({title: element.title, views: element.statistic.views});        
            }

            for (let index = 0; index < 4; index++) {
                const element = userBooksContacts[index];
                bookContact.push({title: element.title, contacts: element.statistic.contacts}); 
            }

          const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            };


            /** Grafico Visualizzazioni */
            const ctxViews = document.getElementById('viewsChart').getContext('2d');
            new Chart(ctxViews, {
                type: 'bar',
                data: {
                    labels: [bookView[0].title, bookView[1].title, bookView[2].title, bookView[3].title],
                    datasets: [{
                        label: 'Visualizzazioni',
                        data: [bookView[0].views, bookView[1].views, bookView[2].views, bookView[3].views],
                        backgroundColor: 'rgba(13, 110, 253, 0.85)',
                        borderColor: 'rgb(13, 110, 253)',
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 40
                    }]
                },
                options: chartOptions
            });
            /** Grafico Contatti */
            const ctxContacts = document.getElementById('contactsChart').getContext('2d');
                new Chart(ctxContacts, {
                type: 'line',
                data: {
                    labels: [bookContact[0].title, bookContact[1].title, bookContact[2].title, bookContact[3].title],
                    datasets: [{
                        label: 'Contatti Ricevuti',
                        data: [bookContact[0].contacts, bookContact[1].contacts, bookContact[2].contacts, bookContact[3].contacts],
                        backgroundColor: 'rgba(25, 135, 84, 0.15)',
                        borderColor: 'rgb(25, 135, 84)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: 'rgb(25, 135, 84)',
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: chartOptions
            });
            /** Fine codice per generare grafici con chart.js (https://www.chartjs.org/docs/latest/getting-started/) */

            /** Popola tabella "Dettaglio Libri Top 4 Visualizzazioni" >>> */
            var contentTableViews = "";
            
            for (let index = 0; index < 4; index++) {

                let tr = `<tr>
                        <td>
                            <span class="badge ${index == 0 ? "bg-success" : "bg-info"} rounded-circle p-2">
                            #${index+1}
                            </span>
                                </td>
                                <td>
                                <strong>
                                <a href="/book/${userBooksViews[index].id}/${userBooksViews[index].slug}">
                                    ${userBooksViews[index].title}
                                    </a>
                                    </strong>
                                    </td>
                                        <td>
                                        ${userBooksViews[index].author}
                                        </td>
                                        <td>
                                            ${userBooksViews[index].category}
                                            </td>
                                            <td>
                                            ${userBooksViews[index].publish_year}
                                                </td>
                                                <td class="text-end">
                                                ${userBooksViews[index].statistic.views}
                                                </td>
                                                    </tr>`;
                
                contentTableViews+=tr;
                
            }

            $('table#top_for_book_detail_views').find('tbody').html(contentTableViews);
            /** <<< Popola tabella "Dettaglio Libri Top 4 Visualizzazioni" */

            /** Popola tabella "Dettaglio Libri Top 4 Contatti" >>> */
            var contentTableContacts = "";

            for (let index = 0; index < 4; index++) {
                        let tr = `<tr>
                                <td>
                                    <span class="badge ${index == 0 ? "bg-success" : "bg-info"} rounded-circle p-2">
                                    #${index+1}
                                    </span>
                                    </td>
                                        <td>
                                        <strong>
                                        <a href="/book/${userBooksContacts[index].id}/${userBooksContacts[index].slug}">
                                        ${userBooksContacts[index].title}
                                            </a>
                                            </strong>
                                            </td>
                                            <td>
                                                ${userBooksContacts[index].author}
                                                </td>
                                                <td>
                                                ${userBooksContacts[index].category}
                                                    </td>
                                                    <td>
                                                    ${userBooksContacts[index].publish_year}
                                                    </td>
                                                        <td class="text-end">
                                                        ${userBooksContacts[index].statistic.contacts}
                                                        </td>
                                                        </tr>`;
            contentTableContacts+=tr;   
            }

            $('table#top_for_book_detail_requests').find('tbody').html(contentTableContacts);
            /** <<< Popola tabella "Dettaglio Libri Top 4 Contatti"  */
        }else{

            $('#statistics-tab-pane > .container-fluid > .row > main')
             .append(`<div class="col-md-12">Nessun Dato da Mostrare! Hai inserito meno di 4 libri.</div>`);
        }

    } catch (error) {
        console.log(error);
        $('#statistics-tab-pane > .container-fluid > .row > main')
        .append(`<div class="col-md-12">Nessun Dato da Mostrare.</div>`);
    }

    /** Invio messaggio dalla dashboard utente. */
    $('body')
    .on('submit', '#sendMesssage', function (e) {
        e.preventDefault();
        let recipient = $(this).find('[name="recipient"]').val();
        let text = $(this).find('[name="textRecipient"]').val();

        var settings = {
                "url": "/api/send-message",
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
                    "text": text
                }),
            };

           $.ajax(settings);        
    });

    /** Settaggio messaggi da 'non letti' a 'letti'. */
    $('body')
    .on('click', '#messages-tab', function(){    
        var $buttonMessagesTag = $(this);
        let isRead = $buttonMessagesTag.data('isread');
        
        if(isRead != 0){

            var settings = {
                "url": "/api/update-unread-messages",
                "method": "POST",
                "timeout": 0,
                "success": function(result,status,xhr){
                  $buttonMessagesTag.removeClass('position-relative');
                  $buttonMessagesTag.find('span').remove();
                },
                "error": function(xhr,status,error){}
                };
                $.ajax(settings);
        }
    });

    $('body')
    .on('submit', 'form#editProfile', function (e) {
        e.preventDefault();
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
                   element.name == 'password'    ||
                   element.name == 'password_confirm'
                  ){
                    
                    data[element.name] = element.value; 

                  }
             }

             console.log(data);
        }

        
    });

});