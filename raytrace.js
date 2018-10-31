'use strict';

const WIDTH = 480;
const HEIGHT = 270;


document.getElementById("sceneFile").onchange = function() {
  let fileReader = new FileReader();

  fileReader.onload = function() {

    sessionStorage.clear();
    let lines = this.result.split('\n');

    let camera = {
      lookAt: lines[0].split(' ').slice(1),
      lookFrom: lines[1].split(' ').slice(1),
      lookUp: lines[2].split(' ').slice(1),
      fov: lines[3].split(' ')[1],
    }

    let lights = {
      directionToLight: lines[4].split(' ').slice(1,4),
      lightColor: lines[4].split(' ').slice(5),
      ambientLight: lines[5].split(' ').slice(1),
      backgroundColor: lines[6].split(' ').slice(1),
    }

    function Material(diffuse, specularHighlight, phongConstant) {
      this.diffuse = diffuse;
      this.specularHighlight = specularHighlight;
      this.phongConstant = phongConstant;
    }

    function Sphere(center, radius, material) {
      this.center = center;
      this.radius = radius;
      this.material = material;
    }

    function Triangle(p1, p2, p3, material) {
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.material = material;
    }

    let sceneObjects = [];
    for (let i = 7; i < lines.length; i++) {
      let line = lines[i].split(' ');
      if (line[0].toLowerCase() == "sphere") {
        let newSphere = new Sphere(
          line.slice(2,5), line[6],
          new Material(line.slice(9,12),line.slice(13,16), line[17]));
        sceneObjects.push(newSphere);
      } else if (line[0].toLowerCase() == "triangle"){ //Assume Triangle
        let newTriangle = new Triangle(
          line.slice(1,4), line.slice(4,7), line.slice(7,10),
          new Material(line.slice(12,15),line.slice(16,19), line[20]));
        sceneObjects.push(newTriangle);
      }
    }

    sessionStorage.setItem('camera', JSON.stringify(camera));
    sessionStorage.setItem('lights', JSON.stringify(lights));
    sessionStorage.setItem('sceneObjects', JSON.stringify(sceneObjects));

    console.log(JSON.parse(sessionStorage.getItem('camera')));
    console.log(JSON.parse(sessionStorage.getItem('lights')));
    console.log(JSON.parse(sessionStorage.getItem('sceneObjects')));
  };
  fileReader.readAsText(this.files[0]);

};

document.querySelector("button").onclick = function() {
  let renderCanvas = document.getElementById("renderCanvas");
  let ctx = renderCanvas.getContext("2d");
  let imgData = ctx.createImageData(WIDTH, HEIGHT);
  for (let i = 0; i < imgData.data.length; i+=4) {
    imgData.data[i] = 255;
    imgData.data[i+1] = i % 255;
    imgData.data[i+2] = 0;
    imgData.data[i+3] = 255;
  }
  console.log(ctx);
  ctx.putImageData(imgData,0,0);
}
