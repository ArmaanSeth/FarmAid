const express=require("express")
const bodyParser=require("body-parser")
const tfjs=require("@tensorflow/tfjs-node")
const multer=require("multer")
const path=require('path')
const fs = require('fs');
const ejs = require("ejs");
const app=express()



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/temp/');
    },
    filename: function (req, file, cb) {
      cb(null,"temp.jpg");
    }
  });
const upload = multer({ storage: storage });



app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:false}))



app.get("/",function(req,res){
    res.render(__dirname+"/index")
})
app.get("/crop_recommendation",function(req,res){
    res.render(__dirname+"/form1")
})
app.get("/disease_prediction",function(req,res){
    res.render(__dirname+"/form2")
})
app.get("/fertilizer_recommendation",function(req,res){
    res.render(__dirname+"/form3")
})



app.post("/crop_recommendation",function(req,res){
    var list=[[parseInt(req.body.val1),
            parseInt(req.body.val2),
            parseInt(req.body.val3),
            parseInt(req.body.val4),
            parseInt(req.body.val5),
            parseInt(req.body.val6),
            parseInt(req.body.val7)]]    
    console.log(list)
    const predictions=async()=>{
        const pred=await loadCrModel(list)
        console.log("pred:"+pred)
        res.send(pred)
    }
    predictions()
})
async function loadCrModel(list){
    const model=await tfjs.loadLayersModel("file://"+__dirname+"/Model/cropRecommendation/model.json")
    console.log("test")
    const y_pred= model.predict(tfjs.tensor(list))
    console.log(y_pred.sum().dataSync())
    const prediction=tfjs.argMax(y_pred,axis=1)
    const accuracy=y_pred.dataSync()[prediction.dataSync()]
    return [prediction.dataSync()[0],accuracy]
}



app.post('/disease_prediction',upload.single('image'),(req, res) => {
    imagePath=__dirname+"/public/temp/temp.jpg"
    readImage(imagePath).then((imageTensor) => {
        const predictions=async()=>{
            const pred=await loadImgModel(imageTensor)
            console.log("pred:"+pred)
            fs.writeFile(__dirname+'/public/result.json', JSON.stringify({prediction:pred[0]},null,2), (err) => {
                if (err) {
                  console.error('Error saving JSON:', err);
                  res.status(500).send('Error saving JSON data.');
                } else {
                  console.log('JSON data saved successfully.');
                  res.render(__dirname+"/form2Result")
                }
              });
        }
        predictions()
    }).catch((error) => {
        console.error('Error reading image:', error);
    });   
});       
async function loadImgModel(image){
    // classes=["healthy apple","apple black rot","apple cedar rust","apple scab",
    //         "healthy blueberry",
    //         "healthy cherry","cherry powdery mildew",
    //         "healthy corn","corn cercospora leaf spot","corn common rust","northern corn leaf blight",
    //         "healthy grape","grape black rot","grape esca / black measles","grape leaf blight / Isariopsis leaf spot",
    //         "orange haunglongbing / citrus greening",
    //         "healthy peach","peach bacterial spot",
    //         "healthy pepperbell","pepper bell bacterial spot",
    //         "healthy potato","potato early blight","potato late blight",
    //         "healthy rasberry",
    //         "healthy soybean",
    //         "squash powdery mildew",
    //         "healthy strawberry","strawberry leaf scorch",
    //         "healthy tomato","tomato bacterial spot","tomato early blight","tomato late blight","tomato leaf mold","tomato mosaic virus","tomato septoria leaf spot","tomato spider mites","tomato target spot","tomato yellow leaf curl virus"]
    // mapping=[31,28,11,15,24,25,20,10,30,34,8,27,16,3,37,29,1,4,6,17,2,36,18,14,22,33,26,0,12,21,5,9,13,23,32,35,19,7]
    var path="file://"+__dirname+"/Model/diseaseDetectionModel/model.json"
    const model=await tfjs.loadLayersModel(path)
    const y_pred=tfjs.variable(model.predict(image))
    const prediction=tfjs.argMax(y_pred,axis=1)
    k=Array.from(y_pred.dataSync())
    console.log(prediction.dataSync()[0])
    return [prediction.dataSync()[0]]
}
async function readImage(path) {
    const imageBuffer = fs.readFileSync(path);
    const decodedImage = tfjs.node.decodeImage(imageBuffer);
    const normalizedImage=tfjs.div(decodedImage,255);
    tfjs.image.normalizedImage
    k=tfjs.expandDims(tfjs.variable(normalizedImage))
    return k;
  }



app.post("/fertilizer_recommendation",function(req,res){
    var list=[[parseInt(req.body.val1),
        parseInt(req.body.val2),
        parseInt(req.body.val3),
        parseInt(req.body.val4),
        parseInt(req.body.val5),
        parseInt(req.body.val6),
        parseInt(req.body.val7),
        parseInt(req.body.val7)]]    
console.log(list)
const predictions=async()=>{
    const pred=await loadFrModel(list)
    console.log("pred:"+pred)
    res.send(pred)
}
predictions()
})
async function loadFrModel(list){
    const model=await tfjs.loadLayersModel("file://"+__dirname+"/Model/fertilizerRecommendation/model.json")
    console.log("test")
    const y_pred= model.predict(tfjs.tensor(list))
    console.log(y_pred)
    const prediction=tfjs.argMax(y_pred,axis=1)
    const accuracy=y_pred.dataSync()[prediction.dataSync()]
    return [prediction.dataSync()[0],accuracy]
}



app.listen(3000,function(){
    console.log("Server is up and running on port 3000")  
})