class Input {
    constructor() {
        this.state = {};
    }

    get_state(key) {
        if(key in this.state) {
            return this.state[key];
        }
        return false;
    }

    poll() {
        var _this = this;
        document.addEventListener('keydown', function(event) {
            _this.state[event.key] = true;
        });
        document.addEventListener('keyup', function(event) {
            _this.state[event.key] = false;
        });
    }
}


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
        this.core = {
            'display' : this.display,
            'input' : this.input
        };

        this.states = [initial_state];
        initial_state.on_entry(this.core);
    }

    tick() {
        this.display.refresh();
        this.input.poll();

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
}