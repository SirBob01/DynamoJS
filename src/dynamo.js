// Utility functions
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function clamp(x, min, max) {
    return Math.min(x, Math.max(x, min));
}

// Utility classes
class Color {
    constructor(r, g, b, a=255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    lerp(other, t) {
        var r = lerp(this.r, other.r, t);
        var g = lerp(this.g, other.g, t);
        var b = lerp(this.b, other.b, t);
        var a = lerp(this.a, other.a, t);
        return new Color(r, g, b, a);
    }

    str() {
        return "rgb("+this.r+","+this.g+","+this.b+")";
    }

    alpha() {
        return this.a/255.0;
    }
}


class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vec2D(this.x, this.y);
    }

    add(b) {
        return new Vec2D(this.x + b.x, this.y + b.y);
    }

    sub(b) {
        return new Vec2D(this.x - b.x, this.y - b.y);
    }

    scale(s) {
        return new Vec2D(this.x * s, this.y * s);
    }

    length_sq() {
        return this.x * this.x + this.y * this.y;
    }

    length() {
        return Math.sqrt(this.length_sq());
    }

    get() {
        return [this.x, this.y];
    }
}


class AABB {
    constructor(x, y, w, h) {
        this.center = new Vec2D(x, y);
        this.dim = new Vec2D(w, h);
    }

    copy() {
        return new AABB(
            this.center.x, this.center.y, 
            this.dim.x, this.dim.y
        );
    }

    min() {
        return this.center.sub(this.dim.scale(0.5));
    }

    max() {
        return this.center.add(this.dim.scale(0.5));
    }

    is_in_bounds(point) {
        var min = this.min();
        var max = this.max();

        var hor = point.x < max.x && point.x > min.x;
        var ver = point.y < max.y && point.y > min.y;
        return hor && ver;
    }

    is_colliding(other) {
        var min = this.min();
        var max = this.max();

        var other_min = other.min();
        var other_max = other.max();

        var hor = other_max.x > min.x && other_min.x < max.x;
        var ver = other_max.y > min.y && other_min.y < max.y;
        return hor && ver;
    }
}


class Sprite {
    constructor(file, frame_x=0, frame_y=0, nframes=0) {
        this.img = new Image();
        this.img.src = file;

        this.frames = [];

        this.accumulator = 0;
        this.current_frame = 0;
        this.finished = false;
        this.max_frames = nframes;

        // Drawing properties
        this.flip = new Vec2D(1, 1);
        this.opacity = 1.0;

        // Synchronize resource loading
        var _this = this;
        this.img.onload = function() {
            if(frame_x == 0 || frame_y == 0) {
                _this.size = new Vec2D(_this.img.width, _this.img.height);
            }
            else {
                _this.size = new Vec2D(frame_x, frame_y);
            }

            var hor_frames = _this.img.width/_this.size.x;
            var ver_frames = _this.img.height/_this.size.y;
            if(this.max_frames == 0) {
                this.max_frames = hor_frames * ver_frames;
            }

            // Calculate individual frame coordinates
            for(var i = 0; i < hor_frames; i++) {
                for(var j = 0; j < ver_frames; j++) {
                    _this.frames.push(new Vec2D(
                        i*_this.size.x, 
                        j*_this.size.y
                    ));
                }
            }
        }
    }

    animate(dt, fps, loop=false) {
        this.accumulator += dt;
        if(this.accumulator >= (1000.0/fps)) {
            this.current_frame++;
            this.accumulator = 0;
        }
        if(this.current_frame > this.max_frames - 1) {
            if(loop) {
                this.current_frame = 0;
            }
            else {
                this.current_frame = this.max_frames-1;
                this.finished = true;
            }
        }
    }
}


// Core Modules
class Display {
    constructor() {
        this.canvas = document.getElementById("display");
        this.display = this.canvas.getContext("2d");
    }

    get_size() {
        return new Vec2D(
            this.canvas.width,
            this.canvas.height
        );
    }

    draw_sprite(sprite, aabb) {
        this.display.globalAlpha = sprite.opacity;
        this.display.imageSmoothingEnabled = false;
        this.display.scale(sprite.flip.x, sprite.flip.y);

        var frame = sprite.frames[sprite.current_frame];
        if(aabb.dim.x && aabb.dim.y) {
            var point = aabb.center.copy();
            point.x -= aabb.dim.x * 0.5 * sprite.flip.x;
            point.y -= aabb.dim.y * 0.5 * sprite.flip.y;

            this.display.drawImage(
                sprite.img,
                frame.x, frame.y,
                sprite.size.x, sprite.size.y,
                point.x * sprite.flip.x, point.y * sprite.flip.y,
                aabb.dim.x, aabb.dim.y
            );
        }
        else {
            var point = aabb.center.copy();
            point.x -= sprite.size.x * 0.5 * sprite.flip.x;
            point.y -= sprite.size.y * 0.5 * sprite.flip.y;
            this.display.drawImage(
                sprite.img,
                frame.x, frame.y,
                sprite.size.x, sprite.size.y,
                point.x * sprite.flip.x, point.y * sprite.flip.y,
                sprite.size.x, sprite.size.y
            );
        }
        this.display.setTransform(1, 0, 0, 1, 0, 0);
        this.display.globalAlpha = 1.0;
    }

    draw_rect(aabb, color, fill=false, linewidth=1) {
        this.display.globalAlpha = color.alpha();
        
        // Offset drawing so it is centered
        var upperleft = aabb.min();
        if(fill) {
            this.display.fillStyle = color.str();
            this.display.fillRect(
                upperleft.x, upperleft.y, 
                aabb.dim.x, aabb.dim.y
            );
        }
        else {
            this.display.lineWidth = linewidth;
            this.display.strokeStyle = color.str();
            this.display.strokeRect(
                upperleft.x, upperleft.y,
                aabb.dim.x, aabb.dim.y
            );
        }
        this.display.globalAlpha = 1.0;
    }

    draw_circle(center, radius, color, fill=false, linewidth=1) {
        this.display.globalAlpha = color.alpha();
        this.display.beginPath();
        this.display.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        if(fill) {
            this.display.fillStyle = color.str();
            this.display.fill();
        }
        else {
            this.display.lineWidth = linewidth;
            this.display.strokeStyle = color.str();
            this.display.stroke();
        }
        this.display.globalAlpha = 1.0;
    }

    draw_text(string, font, size, color, pos) {
        this.display.fillStyle = color.str();
        this.display.globalAlpha = color.alpha();

        this.display.font = size + 'px ' + font;
        this.display.fillText(string, pos.x, pos.y);
        
        this.display.globalAlpha = 1.0;
    }

    refresh() {
        this.display.clearRect(
            0, 0, 
            this.canvas.width, this.canvas.height
        );
    }
}


class Jukebox {
    constructor() {
        this.context = new AudioContext();
        this.volume = 1.0;

        // id : bytestream
        this.sounds = {};
    }
    
    load_sound(url, id) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.responseType = 'arraybuffer';
        request.onreadystatechange = function() {
            if(request.status == 200 && request.readyState == 4) {
                _this.context.decodeAudioData(request.response, 
                    function(buffer) {
                        _this.sounds[id] = buffer;
                    },
                    function(e) {
                        console.log("Error decoding "+url+": "+e.err);
                    });
            }
        };
        request.open("GET", url, true);
        request.send();
    }

    play_sound(id, volume) {
        if(!(id in this.sounds)) {
            throw id+" sound is not loaded into Jukebox.";
        }
        var source_node = this.context.createBufferSource();
        var gain_node = this.context.createGain();

        source_node.connect(gain_node);
        gain_node.connect(this.context.destination);
        
        // Set initial values
        source_node.buffer = this.sounds[id];
        gain_node.gain.value = volume * this.volume;

        source_node.start(0);
    }
}


class Input {
    constructor() {
        this.state = {};
        this.mouse = new Vec2D(0, 0);
    }

    get_state(key) {
        if(key in this.state) {
            return this.state[key];
        }
        return false;
    }

    poll(canvas) {
        var _this = this;
        document.addEventListener('keydown', function(event) {
            _this.state[event.key] = true;
        });
        document.addEventListener('keyup', function(event) {
            _this.state[event.key] = false;
        });
        document.addEventListener('mousedown', function(event) {
            _this.state["Mouse"+event.which] = true;
        });
        document.addEventListener('mouseup', function(event) {
            _this.state["Mouse"+event.which] = false;
        });
        document.addEventListener('mousemove', function(event) {
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
        
            _this.mouse.x = (event.clientX - rect.left) * scaleX;
            _this.mouse.y = (event.clientY - rect.top) * scaleY;
        });
    }
}


class GameState {
    constructor() {
        this.next = null;
        this.kill = false;
    }

    set_next(next, kill) {
        this.next = next;
        this.kill = kill;
    }

    on_entry(core) {
        return;
    }

    on_exit(core) {
        return;
    }

    update(core) {
        return;
    }
}


class Engine {
    constructor(initial_state) {
        this.display = new Display();
        this.input = new Input();
        this.audio = new Jukebox();
        this.core = {
            display : this.display,
            audio : this.audio,
            input : this.input
        };

        this.states = [initial_state];
        initial_state.on_entry(this.core);
    }

    tick() {
        this.display.refresh();
        this.input.poll(this.display.canvas);

        var current_state = this.states[0];
        var next = current_state.next;

        if(next != null) {
            if(current_state.kill) {
                current_state.on_exit(this.core);
                this.states.pop();
            }
            next.on_entry(this.core);
            this.states.push(next);
        }
        else {
            current_state.update(this.core);
        }
    }

    run() {
        var _this = this;
        setInterval(function () {
            _this.tick();
        }, (1.0/60.0) * 1000.0);
    }
}