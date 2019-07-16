import { Ammo, webWorker } from '@/utils';

export default class PhysicsRay {
  constructor (world) {
    this.world = world;
    this.worker = webWorker();

    /* eslint-disable new-cap */
    this.origin = new Ammo.btVector3();
    this.target = new Ammo.btVector3();
    this.closestResult = new Ammo.ClosestRayResultCallback(this.origin, this.target);
    /* eslint-enable new-cap */
  }

  cast (origin, target, hitPoint = null, hitNormal = null) {
    const rayCallBack = Ammo.castObject(this.closestResult, Ammo.RayResultCallback);

    rayCallBack.set_m_closestHitFraction(1);
    rayCallBack.set_m_collisionObject(null);

    // Add filter functions:
    // rayCallBack.set_m_collisionFilterGroup
    // rayCallBack.set_m_collisionFilterMask

    this.origin.setValue(origin.x, origin.y, origin.z);
    this.target.setValue(target.x, target.y, target.z);

    this.closestResult.get_m_rayToWorld().setValue(target.x, target.y, target.z);
    this.closestResult.get_m_rayFromWorld().setValue(origin.x, origin.y, origin.z);

    this.world.rayTest(this.origin, this.target, this.closestResult);

    const hasHit = this.closestResult.hasHit();

    if (hasHit && hitNormal) {
      const normal = this.closestResult.get_m_hitNormalWorld();

      hitNormal.x = normal.x();
      hitNormal.y = normal.y();
      hitNormal.z = normal.z();
    }

    if (hasHit && hitPoint) {
      const point = this.closestResult.get_m_hitPointWorld();

      hitPoint.x = point.x();
      hitPoint.y = point.y();
      hitPoint.z = point.z();
    }

    return !this.worker ? hasHit : self.postMessage({
      action: 'setRayResult',
      normal: hitNormal,
      point: hitPoint,
      hasHit: hasHit
    });
  }
}