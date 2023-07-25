
$('#form').on("submit",function(event){
    event.preventDefault()
    var val1=$('#n').val()
    var val2=$('#p').val()
    var val3=$('#k').val()
    var val4=$('#temp').val()
    var val5=$('#humidity').val()
    var val6=$('#ph').val()
    var val7=$('#rain').val()
    $.ajax({
        type:'POST',
        url:'/crop_recommendation',
        data:{val1:val1,
            val2:val2,
            val3:val3,
            val4:val4,
            val5:val5,
            val6:val6,
            val7:val7      
        },
        success:function(response){
            $(".container-form").hide()
            $("#res").show()
            $('html, body').animate({
                scrollTop: $("#res").offset().top
              }, 100)
            $.getJSON("/data.json",function(data){
                console.log("DATA:"+data[0])
                $('.crop').html(data[0][response[0]].name) 
                // $('.acc').html("Accuracy:"+response[1])
                $('.content').html(data[0][response[0]].content)
                $('.res-img').attr('src',"images/crop/"+data[0][response[0]].img)
                console.log(data[0][response[0]-1])
            });
        },
        error: function(xhr, status, error) {
            console.log('Error:', error);
          }
    })
})