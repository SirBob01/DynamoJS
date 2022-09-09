import { Surface } from './Surface';
import { Color } from './Color';
import { Vec2D } from '../Math';

/**
 * Linear gradient parameters
 */
interface LinearGradient {
  type: 'linear';
  start: Vec2D;
  end: Vec2D;
}

/**
 * Radial gradient parameters
 */
interface RadialGradient {
  type: 'radial';
  in_pos: Vec2D;
  out_pos: Vec2D;
  in_r: number;
  out_r: number;
}

class ColorGradient {
  readonly grad: CanvasGradient;
  a: number;

  /**
   * A wrapper for a canvas color gradient. It can
   * implement both LinearGradient and RadialGradient types.
   *
   * The parameters are dependent on gradient type:
   *     "linear" - {start (Vec2D), end (Vec2D)}
   *     "radial" - {in_pos (Vec2D), in_r (Number),
   *                 out_pos (Vec2D), out_r (Number)}
   *
   * @param surface    Target Surface object
   * @param parameters Gradient type-dependent parameters
   * @param alpha      Alpha value between [0, 255]
   * @return New ColorGradient object
   */
  constructor(
    surface: Surface,
    parameters: LinearGradient | RadialGradient,
    alpha = 255
  ) {
    if (parameters.type == 'linear') {
      this.grad = surface.surface.createLinearGradient(
        parameters.start.x,
        parameters.start.y,
        parameters.end.x,
        parameters.end.y
      );
    } else {
      this.grad = surface.surface.createRadialGradient(
        parameters.in_pos.x,
        parameters.in_pos.y,
        parameters.in_r,
        parameters.out_pos.x,
        parameters.out_pos.y,
        parameters.out_r
      );
    }
    this.a = alpha;
  }

  /**
   * Set a color at a position in the gradient.
   *
   * @param color Target color value
   * @param t    Position in gradient between [0, 1]
   */
  add_value(color: Color, t: number) {
    this.grad.addColorStop(t, color.get());
  }

  /**
   * Get the underlying canvas gradient object.
   *
   * @return Target CanvasGradient object
   */
  get() {
    return this.grad;
  }

  /**
   * Get the normalized alpha value.
   *
   * @return Alpha value between [0, 1]
   */
  alpha() {
    return this.a / 255.0;
  }
}

export { ColorGradient };
export type { LinearGradient, RadialGradient };
