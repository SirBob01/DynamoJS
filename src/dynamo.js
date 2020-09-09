class Display {
    constructor() {
        this.canvas = document.getElementById("display");
        this.display = this.canvas.getContext("2d");
    }

    get_size() {
        return [
            this.canvas.width,
            this.canvas.height
        ];
    }

    draw_sprite(sprite) {
        this.display.fillStyle = sprite.color;
        this.display.fillRect(
            sprite.pos[0] - sprite.dim[0]/2.0, sprite.pos[1] - sprite.dim[1]/2.0, 
            sprite.dim[0], sprite.dim[1]
        );
    }

    draw_text(string, font, size, color, pos) {
        this.display.fillStyle = color;
        this.display.font = size + 'px ' + font;
        this.display.fillText(string, pos[0], pos[1]);
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
        this.xmlhttp = new XMLHttpRequest();
        this.xmlhttp.responseType = 'arraybuffer';
    }
    
    load_sound(url, id) {
        var _this = this;
        this.xmlhttp.onreadystatechange = function() {
            if(_this.xmlhttp.status == 200 && _this.xmlhttp.readyState == 4) {
                _this.context.decodeAudioData(_this.xmlhttp.response, 
                    function(buffer) {
                        _this.sounds[id] = buffer;
                    },
                    function(e) {
                        console.log("Error decoding "+url+": "+e.err);
                    });
            }
        };
        this.xmlhttp.open("GET", url, true);
        this.xmlhttp.send();
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
        this.mouse = [0, 0];
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
        
            _this.mouse[0] = (event.clientX - rect.left) * scaleX;
            _this.mouse[1] = (event.clientY - rect.top) * scaleY;
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