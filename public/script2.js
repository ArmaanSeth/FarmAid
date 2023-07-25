// $('#form').on("submit",function(event){
//     event.preventDefault()
//     const imageInput = document.getElementById('image');
//     const formData = new FormData();
//     // formData.append('image', $('#image')[0].files[0]);
//     formData.append('image', imageInput.files[0]);
//     $.ajax({
//         type:'POST',
//         url:'/disease_prediction',
//         body:formData,
//         processData:false,
//         contentType:false,
//         success:function(response){
//             $(".container-form").hide()
//             $("#res").show()
//             $('html, body').animate({
//                 scrollTop: $("#res").offset().top
//               }, 0)
//             $.getJSON("/data.json",function(data){
//                 $('.crop').html(data[2][response[0]].name) 
//                 // $('.acc').html("Accuracy:"+response[1])
//                 $('.content').html(data[2][response[0]].content)
//                 $('.res-img').attr('src',"temp/temp.jpg")
//                 console.log(data[2][response[0]-1])
//             });
//         },
//         error: function(xhr, status, error) {
//             console.log('Error:', error);
//           }
//     })
// })



fetch('/result.json')
    .then((response)=>response.json())
    .then((response)=>{
        pred=response.prediction
        $(".container-form").hide()
        $("#res").show()
        $('html, body').animate({
            scrollTop: $("#res").offset().top
            },100)
        $.getJSON("/data.json",function(data){
            $('.crop').html(data[2][pred].name) 
            // $('.acc').html("Accuracy:"+response[1])
            $('.content').html(data[2][pred].content)
            $('.res-img').attr('src',"temp/temp.jpg")
            console.log(data[2][pred-1])
        })
    })
    .catch(error => {
    console.error('Error fetching data:', error);
    });
