function VisualParticles() {
	this.pool = [];
	this.active_pool = [];
}

VisualParticles.prototype.init = function(pool_size) {
	for (var i=0; i<pool_size; i++) {
		this.pool.push(new VisualParticle(this));
	}
}

VisualParticles.prototype.spawn = function(x, y, vx, vy, r, duration, color) {
	if(this.pool.length > 0) {
		particle = this.pool.pop();
		this.active_pool.push(particle);

		particle.init(x, y, vx, vy, r, duration, color);
	}
}

VisualParticles.prototype.update = function(step) {
	this.active_pool.forEach(function(particle) {
		particle.update(step);
	});
}

VisualParticles.prototype.complete = function(particle) {
	if( $.inArray(particle, this.active_pool) != -1 ) {
		this.active_pool.splice( $.inArray(particle, this.active_pool), 1 );
		this.pool.push(particle);
	}
}

VisualParticles.prototype.clear = function() {
	// NOTE: will wipe this whole object perminently.
	this.pool.forEach(function(particle) {
        particle.remove();
    });
    this.active_pool.forEach(function(particle) {
        particle.remove();
    });

    while(this.pool.length > 0) {
        this.pool.pop();
    }
    while(this.active_pool.length > 0) {
        this.active_pool.pop();
    }
}

function VisualParticle(controller) {
	this.controller = controller;
	this.drawable = canvas.display.ellipse({x: -20, y: -20, radius:5, fill:"red"}).add();
	this.drawable.opacity = 0.7;
}

VisualParticle.prototype.init = function(x, y, vx, vy, r, duration, color) {
	this.elapsed = 0;
	this.duration = duration;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.drawable.radius = r;
	this.drawable.fill = color;
}

VisualParticle.prototype.update = function(step) {
	this.elapsed += step;
	if(this.elapsed > this.duration) {
		this.reset();
	} else {
		this.x += this.vx*step;
		this.y += this.vy*step;
		this.drawable.moveTo(this.x, this.y);
		this.drawable.opacity = ((this.duration-this.elapsed)/this.duration);
	}
}

VisualParticle.prototype.reset = function() {
	this.vx = 0;
	this.vy = 0;
	this.x = -20;
	this.y = -20;
	this.drawable.moveTo(this.x, this.y);
	this.drawable.radius = 5;

	this.controller.complete(this);
}

VisualParticle.prototype.remove = function() {
	this.drawable.remove();
}
