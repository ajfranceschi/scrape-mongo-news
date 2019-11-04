// TODO: Fix timestamps on Articles and Comments

$("#scrapeNewArticles").on("click", event => {
  event.preventDefault();
  fetch("/api/scrape")
    .then(response => response.json())
    .then(data => {
      console.log("starting insertArticles push");
      fetch("/api/insertArticles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
      })
        .then(response => console.log(response))
        .then(() => {
          console.log("completed insertArticles fetch");
          location.href = "/";
        });
    });
});

$("body").on("click", ".commentsBtn", event => {
  event.preventDefault();
  const articleId = event.target.dataset.articleid;
  location.href = `/comments/${articleId}`;
});

$("#commentSubmitBtn").on("click", event => {
  event.preventDefault();
  const comment = $("#commentTxt")
    .val()
    .trim();
  const articleId = event.target.dataset.articleid;

  if (comment === "") {
    // alert error
    console.log("no text");
    return;
  }
  fetch("/api/addComment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ comment: comment, articleId: articleId})
  })
    .then(response => response.json())
    .then(() => {
      $("#commentTxt").val("");
      location.reload();
    });
});

$(".commentsList").on("click", ".trashIcon", event => {
  const commentId = event.target.parentNode.dataset.id;

  fetch("/api/rmComment", {
    method: "delete",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: commentId})
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) location.reload();
      else console.log(data);

    });
});
