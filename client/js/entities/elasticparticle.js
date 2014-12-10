ElasticParticle.prototype = new Particle();
ElasticParticle.prototype.constructor = ElasticParticle;

function ElasticParticle(x, y) {
	Particle.prototype.constructor.call(this, x, y);
}

ElasticParticle.prototype.hooks = function(other_elastic_particle) {
	// TODO
}