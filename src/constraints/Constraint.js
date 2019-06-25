export default class Constraint {
  constructor (world, type) {
    this.type = type;
    this.world = world;
    this.constraints = [];
  }

  getConstraint (index) {
    return this.constraints[index] || null;
  }
}
