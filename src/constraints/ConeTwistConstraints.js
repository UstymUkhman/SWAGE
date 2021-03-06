import { Quaternion } from 'three/src/math/Quaternion';
import { Vector3 } from 'three/src/math/Vector3';

import Constraints from '@/constraints/Constraints';
import { CONETWIST_IMPULSE } from '@/constants';
import { Ammo } from '@/utils';

export default class ConeTwistConstraints extends Constraints {
  constructor (world, events) {
    super(world, 'ConeTwist');
    this.events = events;

    /* eslint-disable new-cap */
    this.motorTarget = new Ammo.btQuaternion();
    /* eslint-enable new-cap */
  }

  addBodies (body0, body1, axis0, axis1, position0 = new Vector3(), position1 = new Vector3()) {
    this.events.emit('getConeTwistBodies',
      body0.uuid, body1.uuid, {
        positions: [position0, position1],
        axis: [axis0, axis1]
      }
    );

    return this._uuid;
  }

  attachBodies (body0, body1, pivot) {
    /* eslint-disable new-cap */
    const transform0 = new Ammo.btTransform();
    const transform1 = new Ammo.btTransform();

    transform0.setIdentity();
    transform1.setIdentity();

    transform0.setOrigin(new Ammo.btVector3(pivot.positions[0].x, pivot.positions[0].y, pivot.positions[0].z));
    let rotation = transform0.getRotation();

    // rotation.setEulerZYX(-pivot.axis[0].z, -pivot.axis[0].y, -pivot.axis[0].x);
    rotation.setEulerZYX(pivot.axis[0].z, pivot.axis[0].y, pivot.axis[0].x);
    transform0.setRotation(rotation);

    transform1.setOrigin(new Ammo.btVector3(pivot.positions[1].x, pivot.positions[1].y, pivot.positions[1].z));
    rotation = transform1.getRotation();

    // rotation.setEulerZYX(-pivot.axis[1].z, -pivot.axis[1].y, -pivot.axis[1].x);
    rotation.setEulerZYX(pivot.axis[1].z, pivot.axis[1].y, pivot.axis[1].x);
    transform0.setRotation(rotation);

    const coneTwist = new Ammo.btConeTwistConstraint(
      body0, body1, transform0, transform1, true
    );
    /* eslint-enable new-cap */

    Ammo.destroy(transform0);
    Ammo.destroy(transform1);
    this.add(coneTwist);
  }

  setLimit (uuid, limit = new Vector3(Math.PI, 0, Math.PI)) {
    const constraint = this.getConstraintByUUID(uuid);
    constraint.setLimit(limit.z, limit.y, limit.x);
  }

  setMaxMotorImpulse (uuid, impulse = CONETWIST_IMPULSE) {
    const constraint = this.getConstraintByUUID(uuid);
    constraint.setMaxMotorImpulse(impulse);
  }

  setMotorTarget (uuid, target = new Quaternion()) {
    const constraint = this.getConstraintByUUID(uuid);

    this.motorTarget.setValue(target._x, target._y, target._z, target._w);
    constraint.setMotorTarget(this.motorTarget);
  }

  enableMotor (uuid) {
    const constraint = this.getConstraintByUUID(uuid);
    constraint.enableMotor(true);
  }

  disableMotor (uuid) {
    const constraint = this.getConstraintByUUID(uuid);
    constraint.enableMotor(false);
  }
}
