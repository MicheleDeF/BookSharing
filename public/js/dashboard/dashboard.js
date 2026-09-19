$(document).ready(function(){

var itemsForPage = 10;
var currentIndex = 10; 
$('body').find('#totalBooks').text(userBooks.length);

$('button[data-bs-toggle="tab"], a[data-bs-toggle="tab"]')
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

    $('body').on('click', 'button#deleteBook', function (e) {
        e.preventDefault();
        Swal.fire({
            title: "Sei sicuro di voler cancellare questo libro?",
            text: "Una volta cancellato non sarà più possibile recuperarlo.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            cancelButtonText: "Annulla",
            confirmButtonText: "Si, Cancella"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cancellato",
                    text: "Il tuo libro è stato cancellato",
                    icon: "success"
                });
            }
        });
    });
  
    /** Inizio codice per generare grafici con chart.js (https://www.chartjs.org/docs/latest/getting-started/) */
    /** ordina "userBooks" per maggior numero di visualizzazioni e contatti*/
    const userBooksViews = userBooks.toSorted((a, b) => b.statistic.views - a.statistic.views);
    const userBooksContacts = userBooks.toSorted((a, b) => b.statistic.contacts - a.statistic.contacts);    
    const bookView = [];
    const bookContact = [];

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
    /** Fine codice per generare grafici con chart.js (https://www.chartjs.org/) */

    /** Popola tabella "Dettaglio Libri Top 4" */
    var contentTable = "";
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
                                   <td class="text-end">
                                    ${userBooksViews[index].statistic.views}
                                     </td>
                                      <td class="text-end">
                                       ${userBooksViews[index].statistic.contacts}
                                        </td>
                                         </tr>`;
        
        contentTable+=tr;
        
    }

    $('table#top_for_book_detail').find('tbody').html(contentTable);

});