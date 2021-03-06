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
  constructor (world) {
    super(world, 'Cloth');

    this.margin = CLOTH_MARGIN;
    this.damping = SOFT_DAMPING;
    this.friction = SOFT_FRICTION;
    this.stiffness = SOFT_STIFFNESS;
    this.collisions = SOFT_COLLISION;
    this.piterations = CLOTH_PITERATIONS;
    this.viterations = CLOTH_VITERATIONS;
  }

  addBody (props) {
    const heightSegments = props.geometry.parameters.heightSegments;
    const widthSegments = props.geometry.parameters.widthSegments;

    const height = props.geometry.parameters.height;
    const width = props.geometry.parameters.width;

    /* eslint-disable new-cap */
    const clothCorner00 = new Ammo.btVector3(props.position.x, props.position.y + height, props.position.z);
    const clothCorner01 = new Ammo.btVector3(props.position.x, props.position.y + height, props.position.z - width);
    const clothCorner10 = new Ammo.btVector3(props.position.x, props.position.y, props.position.z);
    const clothCorner11 = new Ammo.btVector3(props.position.x, props.position.y, props.position.z - width);
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

    body.setTotalMass(props.mass, false);
    body.setActivationState(DISABLE_DEACTIVATION);
    this.world.addSoftBody(body, this.group, this.mask);

    this.bodies.push({
      geometry: props.geometry,
      uuid: props.uuid,
      body: body
    });
  }

  append (props) {
    const body = this.getBodyByUUID(props.uuid).body;
    body.appendAnchor(props.point, props.target, false, props.influence);
  }

  update () {
    const update = [];

    for (let i = 0; i < this.bodies.length; i++) {
      const positions = this.updateBody(i);

      update.push({
        uuid: this.bodies[i].uuid,
        positions: positions
      });
    }

    self.postMessage({
      action: 'updateBodies',
      bodies: update,
      type: 'Cloth'
    });
  }

  updateBody (index) {
    const positions = this.bodies[index].geometry.attributes.position.array;
    const nodes = this.bodies[index].body.get_m_nodes();
    const vertices = positions.length / 3;

    for (let j = 0, p = 0; j < vertices; j++, p += 3) {
      const nodePosition = nodes.at(j).get_m_x();

      positions[p] = nodePosition.x();
      positions[p + 1] = nodePosition.y();
      positions[p + 2] = nodePosition.z();
    }

    return positions;
  }
}
