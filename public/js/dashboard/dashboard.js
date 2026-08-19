$(document).ready(function(){

var itemsForPage = 10;
var currentIndex = 10; 
$('body').find('#totalBooks').text(userBooks.length);

function truncate(text, limit = 50) {
    if (text.length > limit) {
        return text.slice(0, limit) + '...';
    }
    return text;
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
                                <a href="/book/${item.id}/${item.slug}" class="btn btn-primary">Vai al dettaglio <i class="fa-solid fa-arrow-right-long"></i></a>
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

});