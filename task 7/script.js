        window.onload = function() {

            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);



            var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
            var material = new THREE.MeshBasicMaterial({
                color: 0xfffff,
                wireframe: true
            });
            var cylinder = new THREE.Mesh(geometry, material);
            scene.add(cylinder);

            camera.position.z = 30
            cylinder.rotation.x = 40
            cylinder.rotation.z = 30


            function render() {
                requestAnimationFrame(render);
                renderer.render(scene, camera);
            };

            render();

        }