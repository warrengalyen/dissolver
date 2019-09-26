const glslify = require('glslify');

export default class Dissolve {
  constructor() {
    this.uniforms = {};
    this.textures = {};
    this.time = 1;
    this.interval = 4;
    this.prev_num = 0;
    this.next_num = 1;
    this.mesh = null;
  }
  loadTexture(images, callback) {
    let count = 0;
    for (var i = 0; i < images.length; i++) {
      const index = i;
      const loader = new THREE.TextureLoader();
      loader.load(images[index], (texture) => {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        this.textures[index] = texture;
        count++;
        if (count === images.length) {
          this.mesh = this.createMesh();
          callback();
        }
      });
    }
  }
  createMesh() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0,
      },
      interval: {
        type: 'f',
        value: this.interval,
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      imageResolution: {
        type: 'v2',
        value: new THREE.Vector2(2048, 1356),
      },
      texPrev: {
        type: 't',
        value: this.textures[0],
      },
      texNext: {
        type: 't',
        value: this.textures[1]
      },
    };
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../glsl/dissolve.vs'),
        fragmentShader: glslify('../../glsl/dissolve.fs'),
      })
    );
  }
  render(time) {
    this.uniforms.time.value += time * this.time;
    if (this.uniforms.time.value > this.interval) {
      this.uniforms.time.value = 0;
      this.prev_num = this.next_num;
      this.uniforms.texPrev.value = this.textures[this.next_num];
      while (this.next_num === this.prev_num) {
        this.next_num = Math.floor(Math.random() * this.textures.length);
      }
      this.uniforms.texNext.value = this.textures[this.next_num];
    }
  }
  resize() {
    this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  }
}