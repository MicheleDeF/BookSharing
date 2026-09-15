$(document).ready(function(){

var itemsForPage = 10;
var currentIndex = 10; 
$('body').find('#totalBooks').text(userBooks.length);

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
  

});