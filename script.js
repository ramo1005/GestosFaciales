
const video = document.getElementById('video')
const photo = document.getElementById('canvas')

var age;
var gender;
var mensaje;




Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')


]).then(startVideo)

function startVideo() {
  navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
  if (navigator.getUserMedia){
    navigator.getUserMedia(
      { audio: true,video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
}
function asd(porcentaje,edad,genero,data){

  expression=sort_object(data)
  let firstKey = Object.keys(expression)[0]; // "plainKey"


  if (genero=='male'){
    genero="masculino"
  }
  else if (genero=='female'){
    genero="femenino"
  }
  mensaje="Se ha dectetado un rostro con rasgos "+genero+" "+firstKey+" con una edad aproximada de "+Math.trunc(edad)+" años"

  takePicture();

  document.getElementById("title").innerHTML=mensaje;

}


video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  var idvar = setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender().withFaceExpressions()
    var porcent =JSON.stringify(detections)

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)

     resizedDetections.forEach( detection => {
      const box = detection.detection.box 
       age=detection.age
       gender=detection.gender
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
      drawBox.draw(canvas)
    })
    if(porcent.length>2){

      var porcent2=porcent.toString()
      var porcent3=JSON.parse(porcent2.slice(1,-1))
      asd(porcent3['detection']['_classScore'],age,gender,porcent3['expressions'])
      
    }

  }, 600)
});

function takePicture(){

  photo.getContext("2d").drawImage(video, 0, 0,720,560);
  var img = photo.toDataURL("image/png",1.0);

  document.getElementById('linkimg').value=img;
  document.getElementById('caption').value=mensaje;

  $.ajax({
      url: "index.php",
      type: "POST",
      data: {'linkimg':document.getElementById('linkimg').value,
      'caption':document.getElementById('caption').value},
      success: function(d){
        changePhoto(d.slice(0,30)); 
       }
  });
}

function sort_object(obj) {
  items = Object.keys(obj).map(function(key) {
      return [key, obj[key]];
  });
  items.sort(function(first, second) {
      return second[1] - first[1];
  });
  sorted_obj={}
  $.each(items, function(k, v) {
      use_key = v[0]
      use_value = v[1]
      sorted_obj[use_key] = use_value
  })
  return(sorted_obj)
}

function changePhoto(photo){
  document.getElementById("photo").src="Data/img/"+photo;
  document.getElementById("download").href="Data/img/"+photo;


}





