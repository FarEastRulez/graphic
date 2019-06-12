window.onload = function() {

            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

            var geometry = new THREE.SphereGeometry(5, 32, 32);
            var material = new THREE.MeshPhysicalMaterial({
                color: 0xf0f0f0
            });
            var sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            var geometry1 = new THREE.SphereGeometry(5, 32, 32);
            var material1 = new THREE.MeshPhysicalMaterial({
                color: 0x50fd30
            });
            var sphere1 = new THREE.Mesh(geometry, material);

            scene.add(sphere1);
            sphere1.position.x = 10
            sphere1.position.z = 10

            sphere.receiveShadow = true; //default
            sphere.castShadow = true; //default is false
            sphere1.receiveShadow = true; //default
            sphere1.castShadow = true; //default is false

            var light = new THREE.DirectionalLight(0xffffff, 1, 100);
            light.position.set(1, 1, 2);
            light.castShadow = true;
            light.rotation.y = 100
            scene.add(light);

            light.shadow.mapSize.width = 512; // default
            light.shadow.mapSize.height = 512; // default

            camera.position.z = 30

            function render() {
                requestAnimationFrame(render);
                renderer.render(scene, camera);
            };

            render();

        }