import { Vector3 } from 'three/src/math/Vector3';
import FlexBodies from '@/bodies/FlexBodies';
import { Ammo } from '@/utils';

import {
  SOFT_DAMPING,
  CLOTH_MARGIN,
  SOFT_FRICTION,
  SOFT_STIFFNESS,
  SOFT_COLLISION,
  CLOTH_PITERATIONS,
  CLOTH_VITERATIONS,
  DISABLE_DEACTIVATION
} from '@/constants';

export default class ClothBodies extends FlexBodies {
  constructor (world, events) {
    super(world, 'Cloth');
    this.events = events;

    this.margin = CLOTH_MARGIN;
    this.damping = SOFT_DAMPING;
    this.friction = SOFT_FRICTION;
    this.stiffness = SOFT_STIFFNESS;
    this.collisions = SOFT_COLLISION;
    this.piterations = CLOTH_PITERATIONS;
    this.viterations = CLOTH_VITERATIONS;
  }

  addBody (mesh, mass, position = new Vector3(0, 0, 0)) {
    const heightSegments = mesh.geometry.parameters.heightSegments;
    const widthSegments = mesh.geometry.parameters.widthSegments;

    const height = mesh.geometry.parameters.height;
    const width = mesh.geometry.parameters.width;

    /* eslint-disable new-cap */
    const clothCorner00 = new Ammo.btVector3(position.x, position.y + height, position.z);
    const clothCorner01 = new Ammo.btVector3(position.x, position.y + height, position.z - width);
    const clothCorner10 = new Ammo.btVector3(position.x, position.y, position.z);
    const clothCorner11 = new Ammo.btVector3(position.x, position.y, position.z - width);
    /* eslint-enable new-cap */

    const body = this.helpers.CreatePatch(
      this.world.getWorldInfo(),
      clothCorner00, clothCorner01,
      clothCorner10, clothCorner11,
      widthSegments + 1, heightSegments + 1,
      0, true
    );

    const bodyConfig = body.get_m_cfg();

    bodyConfig.set_piterations(this.piterations);
    bodyConfig.set_viterations(this.viterations);
    bodyConfig.set_collisions(this.collisions);

    bodyConfig.set_kDF(this.friction);
    bodyConfig.set_kDP(this.damping);

    Ammo.castObject(body, Ammo.btCollisionObject).getCollisionShape().setMargin(this.margin);
    body.get_m_materials().at(0).set_m_kLST(this.stiffness);
    body.get_m_materials().at(0).set_m_kAST(this.stiffness);

    body.setTotalMass(mass, false);
    body.setActivationState(DISABLE_DEACTIVATION);
    this.world.addSoftBody(body, this.group, this.mask);

    this.bodies.push({
      geometry: mesh.geometry,
      uuid: mesh.uuid,
      body: body
    });
  }

  append (mesh, point, target, influence = 0.5) {
    this.events.emit('getClothAnchor', target.uuid, {
      influence: influence,
      uuid: mesh.uuid,
      point: point
    });
  }

  appendAnchor (target, cloth) {
    const body = this.getBodyByUUID(cloth.uuid).body;
    body.appendAnchor(cloth.point, target, false, cloth.influence);
  }

  update () {
    for (let i = 0; i < this.bodies.length; i++) {
      this.updateBody(i);
    }
  }

  updateBody (index) {
    const geometry = this.bodies[index].geometry;
    const positions = geometry.attributes.position.array;

    const nodes = this.bodies[index].body.get_m_nodes();
    const vertices = positions.length / 3;

    for (let j = 0, p = 0; j < vertices; j++, p += 3) {
      const nodePosition = nodes.at(j).get_m_x();

      positions[p] = nodePosition.x();
      positions[p + 1] = nodePosition.y();
      positions[p + 2] = nodePosition.z();
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.normal.needsUpdate = true;
    geometry.computeVertexNormals();
  }
}
