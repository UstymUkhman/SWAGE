import Constraints from '@/constraints/Constraints';
import { Ammo } from '@/utils';

export default class GenericConstraints extends Constraints {
  constructor (world, events) {
    super(world, 'Generic');
    this.events = events;
  }

  attachBody (props) {
    /* eslint-disable new-cap */
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(props.position.x, props.position.y, props.position.z));

    const rotation = transform.getRotation();
    // rotation.setEulerZYX(-props.axis.z, -props.axis.y, -props.axis.x);
    rotation.setEulerZYX(props.axis.z, props.axis.y, props.axis.x);
    transform.setRotation(rotation);

    const generic = new Ammo.btGeneric6DofConstraint(
      props.body, transform, true
    );

    /* eslint-enable new-cap */
    this.uuids.push(props.uuid);
    Ammo.destroy(transform);
    this.add(generic);
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
    transform1.setRotation(rotation);

    const generic = new Ammo.btGeneric6DofConstraint(
      props.body0, props.body1, transform0, transform1, true
    );

    /* eslint-enable new-cap */
    Ammo.destroy(transform0);
    Ammo.destroy(transform1);

    this.uuids.push(props.uuid);
    this.add(generic);
  }

  setAngularMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    const motor = constraint.getRotationalLimitMotor(props.index);

    motor.set_m_targetVelocity(props.velocity);
    motor.set_m_maxMotorForce(props.maxForce);

    motor.set_m_hiLimit(props.highLimit);
    motor.set_m_loLimit(props.lowLimit);
  }

  enableAngularMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.getRotationalLimitMotor(props.index).set_m_enableMotor(true);
  }

  disableAngularMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.getRotationalLimitMotor(props.index).set_m_enableMotor(false);
  }

  setAngularLimit (props) {
    const constraint = this.getConstraintByUUID(props.uuid);

    this.limit.setValue(props.lower.x, props.lower.y, props.lower.z);
    constraint.setAngularLowerLimit(this.limit);

    this.limit.setValue(props.upper.x, props.upper.y, props.upper.z);
    constraint.setAngularUpperLimit(this.limit);
  }

  setLinearLimit (props) {
    const constraint = this.getConstraintByUUID(props.uuid);

    this.limit.setValue(props.lower.x, props.lower.y, props.lower.z);
    constraint.setLinearLowerLimit(this.limit);

    this.limit.setValue(props.upper.x, props.upper.y, props.upper.z);
    constraint.setLinearUpperLimit(this.limit);
  }
}
