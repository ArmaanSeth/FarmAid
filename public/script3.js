$('#form').on("submit",function(event){
    event.preventDefault()
    var val1=$('#temp').val()
    var val2=$('#humidity').val()
    var val3=$('#m').val()
    var val4=$('#soilType').val()
    var val5=$('#cropType').val()
    var val6=$('#n').val()
    var val7=$('#p').val()
    var val8=$('#k').val()
    
    $.ajax({
        type:'POST',
        url:'/fertilizer_recommendation',
        data:{val1:val1,
            val2:val2,
            val3:val3,
            val4:val4,
            val5:val5,
            val6:val6,
            val7:val7,
            val8:val8       
        },
        success:function(response){
            $(".container-form").hide()
            $("#res").show()
            $('html, body').animate({
                scrollTop: $("#res").offset().top
              },100)
            $.getJSON("/data.json",function(data){
                $('.crop').html(data[1][response[0]].name) 
                // $('.acc').html("Accuracy:"+response[1])
                $('.content').html(data[1][response[0]].content)
                $('.res-img').attr('src',"images/fertilizer/"+data[1][response[0]].image)
                console.log(data[1][response[0]-1])
            });
        },
        error: function(xhr, status, error) {
            console.log('Error:', error);
          }
    })
})