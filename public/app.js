$("#scrapeNewArticles").on("click", event => {
  event.preventDefault();
  fetch('/api/scrape')
    .then(response => response.json())
    .then(data => {
      console.log('starting insertArticles push');
      fetch('/api/insertArticles', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data})
      }).then(response => console.log(response)).then(()=>{
        console.log('completed insertArticles fetch');
        location.reload()
      });
    })
});
