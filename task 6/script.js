window.onload = function() {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0xfffff,
        wireframe: true
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 3;

    function render() {
        requestAnimationFrame(render);
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };




    render();

}