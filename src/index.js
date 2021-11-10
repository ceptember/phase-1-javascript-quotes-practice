const quoteList = document.getElementById("quote-list"); 
const form = document.getElementById("new-quote-form"); 

function getQuotes (){
    quoteList.innerHTML = ""; 
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(resp => resp.json())
        .then(data => {
            for (let x of data){
                let li = document.createElement('li'); 
                li.setAttribute('class', 'quote-card'); 
                li.innerHTML = `<blockquote class="blockquote">
                <p class="mb-0">${x.quote}</p>
                <footer class="blockquote-footer">${x.author}</footer>
                <br>
                <button class='btn-success' id="likeBtn-${x.id}">Likes: <span>${x.likes.length}</span></button>
                <button class='btn-danger' id="deleteBtn-${x.id}">Delete</button>
              </blockquote>`
              quoteList.appendChild(li); 
              // Handle Delete Button 
              document.getElementById(`deleteBtn-${x.id}`).addEventListener('click', () => {
                  fetch(`http://localhost:3000/quotes/${x.id}`, {
                      method: 'DELETE'
                  })
                    .then( () => {getQuotes()})
              })

              // Handle Like Button
              document.getElementById(`likeBtn-${x.id}`).addEventListener('click', () => {
                fetch('http://localhost:3000/likes',{
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        quoteId: parseInt(x.id),
                        //createdAt: 
                    })

                })
                    .then( () => {fetch('http://localhost:3000/quotes?_embed=likes')
                        .then(newResp => newResp.json())
                        .then(newData => {
                            for (let x of newData){
                               // console.log(x.quote + "" + x.likes.length)
                                document.getElementById(`likeBtn-${x.id}`).innerHTML = `Likes: <span>${x.likes.length}</span>`
                            }
                        })
                    })    
                })
            }
        } )
}



function newQuote (event){
    event.preventDefault(); 
    fetch('http://localhost:3000/quotes', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            Accept: 'application/json'
        },
        body: JSON.stringify({
            quote: document.getElementById('new-quote').value,
            author: document.getElementById('author').value
        })
    })
        .then(() => {
            document.getElementById('new-quote').value = ""; 
            document.getElementById('author').value = ""; 
            getQuotes(); 
        } )
}


document.addEventListener('DOMContentLoaded', getQuotes); 
form.addEventListener('submit', newQuote)