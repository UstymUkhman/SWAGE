import { Vector3 } from 'three/src/math/Vector3';
import { HINGE_FORCE } from '@/constants';
import Constraint from './Constraint';
import Ammo from 'utils/Ammo';

export default class HingeConstraints extends Constraint {
  constructor (world, events) {
    super(world, 'hinge');

    this.events = events;
    this.force = HINGE_FORCE;
  }

  addBody (bodyMesh, axis, pivot = new Vector3()) {
    this.events.emit('getHingeBody',
      bodyMesh.uuid, {
        pivot: pivot,
        axis: axis
      }
    );

    return this.constraints.length - 1;
  }

  addBodies (pinMesh, armMesh, axis, pinPivot = new Vector3(), armPivot = new Vector3()) {
    this.events.emit('getHingeBodies',
      pinMesh.uuid, armMesh.uuid, {
        pinPivot: pinPivot,
        armPivot: armPivot,
        axis: axis
      }
    );

    return this.constraints.length - 1;
  }

  hingeBody (body, position) {
    /* eslint-disable new-cap */
    const hinge = new Ammo.btHingeConstraint(body,
      new Ammo.btVector3(position.pivot.x, position.pivot.y, position.pivot.z),
      new Ammo.btVector3(position.axis.x, position.axis.y, position.axis.z)
    );

    /* eslint-enable new-cap */
    this.add(hinge);
  }

  hingeBodies (pin, arm, position) {
    /* eslint-disable new-cap */
    const armAxis = new Ammo.btVector3(position.axis.x, position.axis.y, position.axis.z);

    const hinge = new Ammo.btHingeConstraint(
      pin, arm,
      new Ammo.btVector3(position.pinPivot.x, position.pinPivot.y, position.pinPivot.z),
      new Ammo.btVector3(position.armPivot.x, position.armPivot.y, position.armPivot.z),
      armAxis, armAxis, true
    );

    /* eslint-enable new-cap */
    this.add(hinge);
  }

  update (index, direction) {
    const constraint = this.constraints[index];

    if (constraint) {
      constraint.enableAngularMotor(true, direction, this.force);
    }
  }
}