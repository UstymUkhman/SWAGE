import { Quaternion } from 'three/src/math/Quaternion';
import { Vector3 } from 'three/src/math/Vector3';

import { CONETWIST_IMPULSE } from '@/constants';
import Constraints from '@/workers/Constraints';

export default class ConeTwistConstraints extends Constraints {
  constructor (worker) {
    super('ConeTwist', worker);
  }

  addBodies (body0, body1, axis0, axis1, position0 = new Vector3(), position1 = new Vector3()) {
    return super.add({
      method: 'attachBodies',
      position0: position0,
      position1: position1,
      body0: body0.uuid,
      body1: body1.uuid,
      axis0: axis0,
      axis1: axis1
    });
  }

  setLimit (uuid, limit = new Vector3(Math.PI, 0, Math.PI)) {
    this.worker.postMessage({
      action: 'setLimit',

      params: {
        type: this.type,
        limit: limit,
        uuid: uuid
      }
    });
  }

  setMaxMotorImpulse (uuid, impulse = CONETWIST_IMPULSE) {
    this.worker.postMessage({
      action: 'setMaxMotorImpulse',

      params: {
        impulse: impulse,
        type: this.type,
        uuid: uuid
      }
    });
  }

  setMotorTarget (uuid, target = new Quaternion()) {
    this.worker.postMessage({
      action: 'setMotorTarget',

      params: {
        target: target.clone(),
        type: this.type,
        uuid: uuid
      }
    });
  }

  enableMotor (uuid) {
    this.worker.postMessage({
      action: 'enableMotor',

      params: {
        type: this.type,
        uuid: uuid
      }
    });
  }

  disableMotor (uuid) {
    this.worker.postMessage({
      action: 'disableMotor',

      params: {
        type: this.type,
        uuid: uuid
      }
    });
  }
}
