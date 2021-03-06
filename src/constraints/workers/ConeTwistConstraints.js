import Constraints from '@/constraints/Constraints';
import { Ammo } from '@/utils';

export default class ConeTwistConstraints extends Constraints {
  constructor (world) {
    super(world, 'ConeTwist');

    /* eslint-disable new-cap */
    this.motorTarget = new Ammo.btQuaternion();
    /* eslint-enable new-cap */
  }

  attachBodies (props) {
    /* eslint-disable new-cap */
    const transform0 = new Ammo.btTransform();
    const transform1 = new Ammo.btTransform();

    transform0.setIdentity();
    transform1.setIdentity();

    transform0.setOrigin(new Ammo.btVector3(props.position0.x, props.position0.y, props.position0.z));
    let rotation = transform0.getRotation();

    // rotation.setEulerZYX(-props.axis0.z, -props.axis0.y, -props.axis0.x);
    rotation.setEulerZYX(props.axis0.z, props.axis0.y, props.axis0.x);
    transform0.setRotation(rotation);

    transform1.setOrigin(new Ammo.btVector3(props.position1.x, props.position1.y, props.position1.z));
    rotation = transform1.getRotation();

    // rotation.setEulerZYX(-props.axis1.z, -props.axis1.y, -props.axis1.x);
    rotation.setEulerZYX(props.axis1.z, props.axis1.y, props.axis1.x);
    transform0.setRotation(rotation);

    const coneTwist = new Ammo.btConeTwistConstraint(
      props.body0, props.body1, transform0, transform1, true
    );
    /* eslint-enable new-cap */

    Ammo.destroy(transform0);
    Ammo.destroy(transform1);

    this.uuids.push(props.uuid);
    this.add(coneTwist);
  }

  setLimit (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setLimit(props.limit.z, props.limit.y, props.limit.x);
  }

  setMaxMotorImpulse (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setMaxMotorImpulse(props.impulse);
  }

  setMotorTarget (props) {
    const constraint = this.getConstraintByUUID(props.uuid);

    this.motorTarget.setValue(props.target._x, props.target._y, props.target._z, props.target._w);
    constraint.setMotorTarget(this.motorTarget);
  }

  enableMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.enableMotor(true);
  }

  disableMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.enableMotor(false);
  }
}
