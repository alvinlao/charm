ElasticParticle.prototype = new Particle();
ElasticParticle.prototype.constructor = ElasticParticle;

function ElasticParticle(x, y, m) {
	Particle.prototype.constructor.call(this, x, y, m);
}

/*
	@other ElasticParticle
 */
ElasticParticle.prototype.hookslaw = function(other) {
	// TODO
}