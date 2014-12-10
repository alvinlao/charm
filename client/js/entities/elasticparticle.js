ElasticParticle.prototype = new Particle();
ElasticParticle.prototype.constructor = ElasticParticle;

function ElasticParticle(x, y, m, k) {
	Particle.prototype.constructor.call(this, x, y, m);
  this.k = k; // Elasticity
}

/*
	@other ElasticParticle
 */
ElasticParticle.prototype.hookesLaw = function(other, equilibriumDistance) {
	equilibriumDistance = equilibriumDistance || CONSTANTS.EPSILON;
	if(this.distToCentre(other) != equilibriumDistance) {
		var X_l = equilibriumDistance - this.distToCentre(other),
		    X_v = other.directionToCentre(this),
		    F = X_v.scale(-this.k * X_l);
		this.applyForce(F);

		// apply linear damping force
		this.applyForce(this.V.scale(-CONSTANTS.DAMPING_COEFFICIENT));
	}
}
