document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    const canvas = document.getElementById('threejs-canvas');
    const heroSection = document.getElementById('hero');
    let heroEndY = heroSection.offsetHeight;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load textures
    const surfaceTextureEarth = new THREE.TextureLoader().load('./assets/images/earth_surface.jpg');
    const cloudsTextureEarth = new THREE.TextureLoader().load('./assets/images/earth_clouds.jpg');
    const surfaceTextureMoon1 = new THREE.TextureLoader().load('./assets/images/moon_1.jpg');
    const surfaceTextureMars = new THREE.TextureLoader().load('./assets/images/mars_surface.jpg'); // Mars texture

    // Materials
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: surfaceTextureEarth,
        roughness: 0.5,
        metalness: 0.1
    });

    const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: cloudsTextureEarth,
        transparent: true,
        opacity: 0.5
    });

    const moonMaterial = new THREE.MeshStandardMaterial({
        map: surfaceTextureMoon1,
        roughness: 0.5,
        metalness: 0.1
    });

    const marsMaterial = new THREE.MeshStandardMaterial({
        map: surfaceTextureMars,
        roughness: 0.7,
        metalness: 0.1
    });

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(25, 32, 32);
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Create Clouds
    const cloudsGeometry = new THREE.SphereGeometry(25.2, 32, 32);
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Create Moon
    const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // Create Mars
    const marsGeometry = new THREE.SphereGeometry(15, 32, 32);
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);
    scene.add(mars);

    // Sunlight as a fixed directional light
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(100, 50, 50); // Fixed position for the Sun
    sunLight.target.position.set(0, 0, 0); // Light always points to the center
    scene.add(sunLight);
    scene.add(sunLight.target);

    camera.position.z = 50;

    function updateScenePositions() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        earth.position.set(0, -25, 0);
        clouds.position.set(0, -25, 0);
        moon.position.set(20, 10, -25);

        // Mars starts far left and behind the camera
        mars.position.set(-200, 0, -200);
    }

    updateScenePositions();
    window.addEventListener('resize', updateScenePositions);

    window.addEventListener('resize', () => {
        heroEndY = heroSection.offsetHeight;
    });


    let lastScrollY = 0;
    let moonAngle = 0;
    const moonOrbitSpeed = 0.01;
    let moonActive = true;


    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const deltaScroll = scrollY - lastScrollY;
        lastScrollY = scrollY;

        /* ===== EARTH ===== */
        earth.position.x = scrollY / 20;
        earth.position.y = -25 + scrollY / 20;
        earth.position.z = -scrollY / 10;
        clouds.position.copy(earth.position);

        /* ===== MOON (solo en hero) ===== */
        if (scrollY <= heroEndY) {

            if (!moonActive) {
                moon.visible = true;
                moonActive = true;
            }

            moonAngle += deltaScroll * moonOrbitSpeed;

            moon.position.x = 20 + earth.position.x - 50 * Math.sin(moonAngle);
            moon.position.y = 10 - scrollY / 100 - 10 * Math.sin(moonAngle);
            moon.position.z = -25 + earth.position.z + 70 * Math.sin(moonAngle / 2);

        } else {

            if (moonActive) {
                moon.visible = false;
                moonActive = false;
            }
        }

        /* ===== MARS ===== */
        mars.position.x = -200 + scrollY / 2;
        mars.position.z = -200 + scrollY / 2;
    });


    function resizeRendererToDisplaySize() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        const needResize =
            canvas.width !== width || canvas.height !== height;

        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        resizeRendererToDisplaySize();

        earth.rotation.y += 0.001;
        clouds.rotation.y -= 0.0005;
        moon.rotation.y -= 0.001;
        mars.rotation.y += 0.0008;

        renderer.render(scene, camera);
    }


    animate();

    const hamburgerButton = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    hamburgerButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });



});
