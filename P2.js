/***
 * Created by Glen Berseth Feb 5, 2016
 * Created for Project 2 of CPSC314 Introduction to graphics Course.
 */

// Build a visual axis system
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}
var length = 100.0;
// Build axis visuliaztion for debugging.
x_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( length, 0, 0 ),
	    0xFF0000,
	    false
	)
y_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, length, 0 ),
	    0x00ff00,
	    false
	)
z_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, 0, length ),
	    0x0000FF,
	    false
	)
	
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
//ASSIGNMENT-SPECIFIC API EXTENSION
// For use with matrix stack
THREE.Object3D.prototype.setMatrixFromStack = function(a) {
  this.matrix=mvMatrix;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// Data to for the two camera view
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var views = [
	{
		left: 0,
		bottom: 0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 80, 20, 80 ],
		up: [ 0, 1, 0 ],
		fov: 65,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	},
	{
		left: 0.501,
		bottom: 0.0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 65, 20, 65 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	}
];



//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// Creating the two cameras and adding them to the scene.
var view = views[0];
camera_MotherShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_MotherShip.position.x = view.eye[ 0 ];
camera_MotherShip.position.y = view.eye[ 1 ];
camera_MotherShip.position.z = view.eye[ 2 ];
camera_MotherShip.up.x = view.up[ 0 ];
camera_MotherShip.up.y = view.up[ 1 ];
camera_MotherShip.up.z = view.up[ 2 ];
camera_MotherShip.lookAt( scene.position );
view.camera = camera_MotherShip;
scene.add(view.camera);

var view = views[1];
camera_ScoutShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
camera_ScoutShip.position.x = view.eye[ 0 ];
camera_ScoutShip.position.y = view.eye[ 1 ];
camera_ScoutShip.position.z = view.eye[ 2 ];
camera_ScoutShip.up.x = view.up[ 0 ];
camera_ScoutShip.up.y = view.up[ 1 ];
camera_ScoutShip.up.z = view.up[ 2 ];
camera_ScoutShip.lookAt( scene.position );
view.camera = camera_ScoutShip;
scene.add(view.camera);


// ADDING THE AXIS DEBUG VISUALIZATIONS
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);


// ADAPT TO WINDOW RESIZE
function resize() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
  renderer.setSize(window.innerWidth,window.innerHeight);
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () 
{
     window.scrollTo(0,0);
}

var ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].castShadow = true;

lights[0].position.set( 0, 0, 0 ); // IN THE SUN....

scene.add( lights[0] );

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////


// Create Solar System

// initate 8 sun
// chinese version:
// 创建8个太阳，一个大的 七个小的
// 然后每一个行星parent不同的太阳，这样就能简单的修改每个行星的绕行速度了：修改太阳的自转速度即可
var geometry = new THREE.SphereGeometry( 5 , 32, 32 );
var texture = THREE.ImageUtils.loadTexture( 'sun.jpg' );
var normalMaterial = new THREE.MeshBasicMaterial( { map: texture } );
generateVertexColors( geometry );
var sun1 = new THREE.Mesh( geometry, normalMaterial );
scene.add( sun1 );
var geometry1 = new THREE.SphereGeometry( 4.9, 32, 32 );
var sun2 = new THREE.Mesh( geometry1, normalMaterial );
scene.add( sun2 );
var sun3 = new THREE.Mesh( geometry1, normalMaterial );
scene.add( sun3 );
var sun4 = new THREE.Mesh( geometry1, normalMaterial );
scene.add( sun4 );
var sun5 = new THREE.Mesh( geometry1, normalMaterial );
scene.add( sun5 );
var sun6 = new THREE.Mesh( geometry1, normalMaterial );
scene.add( sun6 );
var sun7 = new THREE.Mesh( geometry1, normalMaterial );
scene.add( sun7 );
var sun8 = new THREE.Mesh( geometry1, normalMaterial );
scene.add( sun8 );

// iniate 8 planet and set each of them to an unique sun
var mercuryGeo = new THREE.SphereGeometry(2,15,15);
var mercurytexture = THREE.ImageUtils.loadTexture( 'mercury.jpg' );
var mercuryMat = new THREE.MeshBasicMaterial( { map: mercurytexture } );
var planetMat = new THREE.MeshPhongMaterial(); 
var mercury = new THREE.Mesh(mercuryGeo, mercuryMat); 
scene.add(mercury);
mercury.parent = sun1;
var marsGeo = new THREE.SphereGeometry(3,20,20);
var marstexture = THREE.ImageUtils.loadTexture( 'mars.jpg' );
var marsMat = new THREE.MeshBasicMaterial( { map: marstexture } );
var mars = new THREE.Mesh(marsGeo, marsMat); 
scene.add(mars);
mars.parent = sun2;
var venusGeo = new THREE.SphereGeometry(1.5,20,20);
var venustexture = THREE.ImageUtils.loadTexture( 'venus.jpg' );
var venusMat = new THREE.MeshBasicMaterial( { map: venustexture } );
var venus = new THREE.Mesh(venusGeo, venusMat); 
scene.add(venus);
venus.parent = sun3;
var earthGeo = new THREE.SphereGeometry(2,20,20);
var earthtexture = THREE.ImageUtils.loadTexture( 'earth.jpg' );
var earthMat = new THREE.MeshBasicMaterial( { map: earthtexture } );
var earth = new THREE.Mesh(earthGeo, earthMat); 
scene.add(earth);
earth.parent = sun4;
var jupiterGeo = new THREE.SphereGeometry(4,30,30);
var jupitertexture = THREE.ImageUtils.loadTexture( 'jupiter.jpg' );
var jupiterMat = new THREE.MeshBasicMaterial( { map: jupitertexture } );
var jupiter = new THREE.Mesh(jupiterGeo, jupiterMat); 
scene.add(jupiter);
jupiter.parent = sun5;
var saturnGeo = new THREE.SphereGeometry(3.5,30,30);
var saturntexture = THREE.ImageUtils.loadTexture( 'saturn.jpg' );
var saturnMat = new THREE.MeshBasicMaterial( { map: saturntexture } );
var saturn = new THREE.Mesh(saturnGeo, saturnMat); 
scene.add(saturn);
saturn.parent = sun6;
var uranusGeo = new THREE.SphereGeometry(1.5,30,30);
var jupitertexture = THREE.ImageUtils.loadTexture( 'jupiter.jpg' );
var jupiterMat = new THREE.MeshBasicMaterial( { map: jupitertexture } );
var uranus = new THREE.Mesh(uranusGeo, planetMat); 
scene.add(uranus);
uranus.parent = sun7;
var neptureGeo = new THREE.SphereGeometry(1.5,30,30);
var nepture = new THREE.Mesh(neptureGeo, planetMat); 
scene.add(nepture);
nepture.parent = sun8;

// iniate moon
var moonGeo = new THREE.SphereGeometry(0.5,30,30);
var moon = new THREE.Mesh(moonGeo, planetMat); 
scene.add(moon);
moon.parent = earth;


var i = 0;
// iniate the monthership
var mothershipTorsoGeo = new THREE.BoxGeometry(10,3,5);
//var mothershipTorsoMatrix = new THREE.Matrix4().set(1,0,0,10, 0,1,0,10, 0,0,1,-10, 0,0,0,1);
var mothershipTorso = new THREE.Mesh(mothershipTorsoGeo,planetMat);
//mothershipTorso.setMatrix(mothershipTorsoMatrix);
mothershipTorso.position.x = 30*Math.cos(0) + 0;
mothershipTorso.position.y = 30*Math.cos(0) + 0;
mothershipTorso.position.z = 30*Math.sin(0) + 0;
scene.add(mothershipTorso);
camera_MotherShip.parent = mothershipTorso;

var mothershipWingGeo = new THREE.BoxGeometry(4,1,6);
var mothershipWing1Matrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5, 0,0,0,1);
var mothershipWing2Matrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,-5, 0,0,0,1);
var mothershipWing1 = new THREE.Mesh(mothershipWingGeo,planetMat);
var mothershipWing2 = new THREE.Mesh(mothershipWingGeo,planetMat);
mothershipWing1.setMatrix(mothershipWing1Matrix);
mothershipWing2.setMatrix(mothershipWing2Matrix);
scene.add(mothershipWing1);
scene.add(mothershipWing2);
mothershipWing1.parent = mothershipTorso;
mothershipWing2.parent = mothershipTorso;


// iniate scoutship
var scoutshipTorsoGeo = new THREE.BoxGeometry(10,3,5);
//var scoutshipTorsoMatrix = new THREE.Matrix4().set(1,0,0,60, 0,1,0,15, 0,0,1,10, 0,0,0,1);
var scoutshipTorso = new THREE.Mesh(scoutshipTorsoGeo,planetMat);
scoutshipTorso.position.x = 10*Math.cos(0) + 0;
scoutshipTorso.position.y = 10*Math.cos(0) + 0;
scoutshipTorso.position.z = 30*Math.sin(0) + 0;
//scoutshipTorso.position.z = 10*Math.sin(0) + 0;
//scoutshipTorso.setMatrix(scoutshipTorsoMatrix);
scene.add(scoutshipTorso);

// trying to set the camera, but not work
/*
camera_ScoutShipMatrix = new THREE.Matrix4().set(1,0,0,-65, 0,1,0,0, 0,0,1,0, 0,0,0,1);
camera_ScoutShip.setMatrix(camera_ScoutShipMatrix);
camera_ScoutShip.parent = scoutshipTorso;
*/

//scoutshipTorso.parent = sun2;

var scoutshipWingGeo = new THREE.BoxGeometry(4,1,6);
var scoutshipWing1Matrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,5, 0,0,0,1);
var scoutshipWing2Matrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,-5, 0,0,0,1);
var scoutshipWing1 = new THREE.Mesh(scoutshipWingGeo,planetMat);
var scoutshipWing2 = new THREE.Mesh(scoutshipWingGeo,planetMat);
scoutshipWing1.setMatrix(scoutshipWing1Matrix);
scoutshipWing2.setMatrix(scoutshipWing2Matrix);
scene.add(scoutshipWing1);
scene.add(scoutshipWing2);
scoutshipWing1.parent = scoutshipTorso;
scoutshipWing2.parent = scoutshipTorso;


for (var ra=1;ra<100;ra++){
var segcount = 32;
var radius = 3.8+0.01*ra;
var linegeometry = new THREE.Geometry();
var linematerial = new THREE.LineBasicMaterial({ color: 0xFFFFFF});

for (var i = 0; i <= segcount; i++) {
   	var theta = (i / segcount) * Math.PI * 2;
    linegeometry.vertices.push(
    	new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
saturnring = new THREE.Line(linegeometry, linematerial)
scene.add(saturnring);
saturnring.parent=saturn;
}

// iniate 8 orbits
var t = 0;
var segmentCount = 32,
    radius = 10,
    geometry = new THREE.Geometry(),
    material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit1 = new THREE.Line(geometry, material)
scene.add(orbit1);
var segmentCount = 32,
    radius = 15;
for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit2 = new THREE.Line(geometry, material)
scene.add(orbit2);
var segmentCount = 32,
    radius = 20;
for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit3 = new THREE.Line(geometry, material)
scene.add(orbit3);
var segmentCount = 32,
    radius = 25;
for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit4 = new THREE.Line(geometry, material)
scene.add(orbit4);
var segmentCount = 32,
    radius = 30;
for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit5 = new THREE.Line(geometry, material)
scene.add(orbit5);
var segmentCount = 32,
    radius = 35;
for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit6 = new THREE.Line(geometry, material)
scene.add(orbit6);
var segmentCount = 32,
    radius = 40;
for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit7 = new THREE.Line(geometry, material)
scene.add(orbit7);
var segmentCount = 32,
    radius = 45;
for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
        new THREE.Vector3(
            Math.cos(theta) * radius,0,
            Math.sin(theta) * radius
            ));            
}
orbit8 = new THREE.Line(geometry, material)
scene.add(orbit8);

//Note: Use of parent attribute IS allowed.
//Hint: Keep hierarchies in mind! 

var clock = new THREE.Clock(true);
function updateSystem() 
{
	// set different sun's self rotation speed in order to set planet's rotation speed
	sun1.rotation.y += 0.02;
	sun2.rotation.y += 0.03;
	sun3.rotation.y += 0.01;
	sun4.rotation.y += 0.015;
	sun5.rotation.y += 0.025;
	sun6.rotation.y += 0.005;
	sun7.rotation.y += 0.009;
	sun8.rotation.y += 0.013;

	// set planets' self rotation speed
	mercury.rotation.y += 0.08;
	mars.rotation.y += 0.05;
	venus.rotation.y += 0.07;
	earth.rotation.y += 0.1;
	jupiter.rotation.y += 0.09;
	saturn.rotation.y += 0.075;
	uranus.rotation.y += 0.03;
	nepture.rotation.y += 0.11;

	// put planet into their own orbit
    mercury.position.x = 10*Math.cos(t) + 0;
    mercury.position.z = 10*Math.sin(t) + 0;
    venus.position.x = 15*Math.cos(t) + 0;
    venus.position.z = 15*Math.sin(t) + 0;
    earth.position.x = 20*Math.cos(t) + 0;
    earth.position.z = 20*Math.sin(t) + 0;
    mars.position.x = 25*Math.cos(t) + 0;
    mars.position.z = 25*Math.sin(t) + 0;
    jupiter.position.x = 30*Math.cos(t) + 0;
    jupiter.position.z = 30*Math.sin(t) + 0;
    saturn.position.x = 35*Math.cos(t) + 0;
    saturn.position.z = 35*Math.sin(t) + 0;
    uranus.position.x = 40*Math.cos(t) + 0;
    uranus.position.z = 40*Math.sin(t) + 0;
    nepture.position.x = 45*Math.cos(t) + 0;
    nepture.position.z = 45*Math.sin(t) + 0;
    moon.position.x = 2*Math.cos(t) + 0;
    moon.position.z = 2*Math.sin(t) + 0;
  
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
		

		

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
  updateSystem();

  test = requestAnimationFrame(update);
  
  // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
  for ( var ii = 0; ii < views.length; ++ii ) 
  {

		view = views[ii];
		camera_ = view.camera;

		view.updateCamera( camera_, scene, mouseX, mouseY );

		var left   = Math.floor( windowWidth  * view.left );
		var bottom = Math.floor( windowHeight * view.bottom );
		var width  = Math.floor( windowWidth  * view.width );
		var height = Math.floor( windowHeight * view.height );
		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( view.background );

		camera_.aspect = width / height;
		camera_.updateProjectionMatrix();

		renderer.render( scene, camera_ );
	}
}

  var counter = 1;
  var camM = 0;
  var camS = 0;
function resetCam(m,c){
    if(m+c==2){
        camera_MotherShip.position.x = views[0].eye[ 0 ];
        camera_MotherShip.position.y = views[0].eye[ 1 ];
        camera_MotherShip.position.z = views[0].eye[ 2 ];
        camera_MotherShip.up.x = views[0].up[ 0 ];
        camera_MotherShip.up.y = views[0].up[ 1 ];
        camera_MotherShip.up.z = views[0].up[ 2 ];
        camera_MotherShip.lookAt( scene.position );
        camera_ScoutShip.position.x = views[1].eye[ 0 ];
        camera_ScoutShip.position.y = views[1].eye[ 1 ];
        camera_ScoutShip.position.z = views[1].eye[ 2 ];
        camera_ScoutShip.up.x = views[1].up[ 0 ];
        camera_ScoutShip.up.y = views[1].up[ 1 ];
        camera_ScoutShip.up.z = views[1].up[ 2 ];
        camera_ScoutShip.lookAt( scene.position );
    }
    else if(m==1){
      if(camM==0){
        camM = 1;
        camera_MotherShip.position.x = mothershipTorso.position.x;
        camera_MotherShip.position.y = mothershipTorso.position.y;
        camera_MotherShip.position.z = mothershipTorso.position.z;
        camera_MotherShip.up.x = views[0].up[ 0 ];
        camera_MotherShip.up.y = views[0].up[ 1 ];
        camera_MotherShip.up.z = views[0].up[ 2 ];
        camera_MotherShip.lookAt( camera_MotherShip.position );
      }
      else{
        camM = 0;
        camera_MotherShip.position.x = views[0].eye[ 0 ];
        camera_MotherShip.position.y = views[0].eye[ 1 ];
        camera_MotherShip.position.z = views[0].eye[ 2 ];
        camera_MotherShip.up.x = views[0].up[ 0 ];
        camera_MotherShip.up.y = views[0].up[ 1 ];
        camera_MotherShip.up.z = views[0].up[ 2 ];
        camera_MotherShip.lookAt( scene.position );
      }
    }
    else{
      if(camS==0){
        camS = 1;
        camera_ScoutShip.position.x = scoutshipTorso.position.x;
        camera_ScoutShip.position.y = scoutshipTorso.position.y;
        camera_ScoutShip.position.z = scoutshipTorso.position.z;
        camera_ScoutShip.up.x = views[1].up[ 0 ];
        camera_ScoutShip.up.y = views[1].up[ 1 ];
        camera_ScoutShip.up.z = views[1].up[ 2 ];
        camera_ScoutShip.lookAt( camera_ScoutShip.position);
      }
      else{
        camS = 0;
        camera_ScoutShip.position.x = views[1].eye[ 0 ];
        camera_ScoutShip.position.y = views[1].eye[ 1 ];
        camera_ScoutShip.position.z = views[1].eye[ 2 ];
        camera_ScoutShip.up.x = views[1].up[ 0 ];
        camera_ScoutShip.up.y = views[1].up[ 1 ];
        camera_ScoutShip.up.z = views[1].up[ 2 ];
        camera_ScoutShip.lookAt( scene.position );
      }
    }
}
function onKeyDown(event)
{
  if(keyboard.eventMatches(event,"space")){
  	if (counter == 1) {
  	cancelAnimationFrame(test);
  	counter++;
  }
  	else {
    	requestAnimationFrame(update);
    	counter = 1;
  	}
  }
	// TO-DO: BIND KEYS TO YOUR CONTROLS	  
  else if(keyboard.eventMatches(event,"shift+g"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  } 
  else if (keyboard.eventMatches(event,"o")){
     resetCam(1,0);
  } 
  else if (keyboard.eventMatches(event,"p")){
     resetCam(0,1);
  } 
  else if(keyboard.eventMatches(event,"m")){
    resetCam(1,1);
  }  

}
keyboard.domElement.addEventListener('keydown', onKeyDown );
update();