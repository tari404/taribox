/**
 * @author Almar Klein / http://almarklein.org
 *
 * Shaders to render 3D volumes using raycasting.
 * The applied techniques are based on similar implementations in the Visvis and Vispy projects.
 * This is not the only approach, therefore it's marked 1.
 */
import * as THREE from 'three'
import vs from './volume.vs'
import fs from './volume.fs'

export const volumeShader = {
  uniforms: {
    'u_size': { value: new THREE.Vector3(1, 1, 1) },
    'u_renderstyle': { value: 0 },
    'u_renderthreshold': { value: 0.5 },
    'u_clim': { value: new THREE.Vector2(1, 1) },
    'u_data': { value: null },
    'u_cmdata': { value: null }
  },
  vertexShader: vs,
  fragmentShader: fs
}
