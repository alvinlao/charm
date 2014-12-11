function Controls(canvas) {
    this.canvas = canvas;
    this.key_map = {up:38, down:40, left:37, right:39, space:32}

    this.isControlDown = function(key) {
        return $.inArray(key, this.canvas.keyboard.getKeysDown()) >= 0;
    }
}
