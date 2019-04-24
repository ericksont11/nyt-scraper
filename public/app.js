
$(document).ready(function(){

  let splitterArray = []

  $('.modal').modal();

  $(document).on("click", ".delete-comment", function() {
    const button = $(this).attr("data-id")
    const num =  $(this).attr("data-num")
    $("#"+button).remove()
    console.log(splitterArray)
    splitterArray.splice(num, 1);
    console.log(splitterArray)


    var title = splitterArray.join("|") +

    $.ajax({
      url: '/hello',
      type: 'POST',
      }).then(()=>{
        console.log(title)
        $.ajax({
          method: "POST",
          url: "/articles/" + num,
          data: {
            title,
          }
        })
      })
  })

  $("#btn").click(function() {
    $(".loading-screen").hide()
    $.getJSON("/articles", data => {
      for (let i = 0; i < data.length; i++) {
        $("#articles").append("<div class='col s10 offset-1 articles' id="+data[i]._id+"><h5 class='header' id="+data[i]._id+">"
        +data[i].title+"</h5><div class='card horizontal'><div class='card-image'><img src="
        +data[i].img+" class='caption-image'></div><div class='card-stacked'><div class='card-content'><p>"
        +data[i].teaser+"</p></div><div class='card-action'><a href="+data[i].link+">"
        +data[i].link+"<a class='waves-effect waves-light btn modal-trigger comments' id="+data[i]._id+" href='#modal1'>View Comments</a></a></div></div></div></div>");
      }
    });
  })

  $(document).on("click", ".modal-trigger", function() {
    $("#notes").empty();
    splitterArray = []
    const thisId = $(this).attr("id");

    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(data => {
        $("#notes").append("<input id='titleinput' name='title' placeholder='Type your comments here!'>");
        $("#notes").append("<h6 id='notetitle'></h6>");
        $("#notes").append("<a class='waves-effect waves-light btn' id='savenote' data-id="+data._id+">Leave a comment</a>");
  
        if (data.note) {
          splitter = (data.note.title).split("|")
          for (i=0; i < (splitter.length+1); i++){
              $("#notetitle").prepend("<li class='collection-item' id='link"+splitter[i].split(" ").join("")
              +"'> User commented: "+splitter[i]+"<button data-id='link"+splitter[i].split(" ").join("")
              +"' class='delete-comment' data-num='"+i+"' data-id='"+data._id+"'>X</button></li>");
              splitterArray.push(splitter[i])
          }
        }
      });
  });

  $(document).on("click", "#savenote", function() {
    const thisId = $(this).attr("data-id");
    if ($("#titleinput").val() !== "") {
      if (splitterArray.length >= 1) {
        var title = splitterArray.join("|") + "|" + $("#titleinput").val()
      }
      else {
        var title = $("#titleinput").val()
      }

      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          title,
        }
      })

        .then(data => {
          $("#notes").empty();
          splitterArray=[]
          $.ajax({
            method: "GET",
            url: "/articles/" + thisId
          })
            .then(data => {
              $("#notes").append("<input id='titleinput' name='title' placeholder='Type your comment here!'>");
              $("#notes").append("<h6 id='notetitle'></h6>");
              $("#notes").append("<a class='waves-effect waves-light btn' id='savenote' data-id="+data._id+">Leave a comment</a>");
        
              if (data.note) {
                splitter= (data.note.title).split("|")
                for (i=0; i < splitter.length; i++){
                  $("#notetitle").prepend("<li class='collection-item' id='link"+splitter[i].split(" ").join("").trim()
                  +"'>User commented: "+splitter[i]+"<button data-id='link"+splitter[i].split(" ").join("").trim()
                  +"' class='delete-comment' data-num='"+i+"'>X</button></li>");
                  splitterArray.push(splitter[i])
                }
              }
            });
        });
    
      $("#titleinput").val("");
      $("#bodyinput").val("");
    }
  });

})