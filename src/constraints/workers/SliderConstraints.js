import Constraints from '@/constraints/Constraints';
import { Ammo } from '@/utils';

export default class SliderConstraints extends Constraints {
  constructor (world) {
    super(world, 'Slider');
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

    const slider = new Ammo.btSliderConstraint(
      props.body, transform, true
    );

    /* eslint-enable new-cap */
    this.uuids.push(props.uuid);
    Ammo.destroy(transform);
    this.add(slider);
  }

  attachBodies (props) {
    /* eslint-disable new-cap */
    const transform0 = new Ammo.btTransform();
    const transform1 = new Ammo.btTransform();

    transform0.setIdentity();
    transform1.setIdentity();

    transform0.setOrigin(new Ammo.btVector3(props.position0.x, props.position0.y, props.position0.z));
    let rotation = transform0.getRotation();

    // rotation.setEulerZYX(-props.axis.z, -props.axis.y, -props.axis.x);
    rotation.setEulerZYX(props.axis.z, props.axis.y, props.axis.x);
    transform0.setRotation(rotation);

    transform1.setOrigin(new Ammo.btVector3(props.position1.x, props.position1.y, props.position1.z));
    rotation = transform1.getRotation();

    // rotation.setEulerZYX(-props.axis.z, -props.axis.y, -props.axis.x);
    rotation.setEulerZYX(props.axis.z, props.axis.y, props.axis.x);
    transform1.setRotation(rotation);

    const slider = new Ammo.btSliderConstraint(
      props.body0, props.body1, transform0, transform1, true
    );

    /* eslint-enable new-cap */
    Ammo.destroy(transform0);
    Ammo.destroy(transform1);

    this.uuids.push(props.uuid);
    this.add(slider);
  }

  enableAngularMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setTargetAngMotorVelocity(props.velocity);
    constraint.setMaxAngMotorForce(props.acceleration);
    constraint.setPoweredAngMotor(true);
  }

  enableLinearMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setTargetLinMotorVelocity(props.velocity);
    constraint.setMaxLinMotorForce(props.acceleration);
    constraint.setPoweredLinMotor(true);
  }

  disableAngularMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setPoweredAngMotor(false);
  }

  disableLinearMotor (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setPoweredLinMotor(false);
  }

  setSoftnessLimit (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setSoftnessLimAng(props.angular);
    constraint.setSoftnessLimLin(props.linear);
  }

  setAngularLimit (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setLowerAngLimit(props.lower);
    constraint.setUpperAngLimit(props.upper);
  }

  setLinearLimit (props) {
    const constraint = this.getConstraintByUUID(props.uuid);
    constraint.setLowerLinLimit(props.lower);
    constraint.setUpperLinLimit(props.upper);
  }
}
