import { Surface } from './Surface';
import { Color } from './Color';
import { Vec2D } from '../Math';

/**
 * Linear gradient parameters
 */
interface LinearGradient {
  type: 'linear';

  /**
   * Start position of the gradient
   */
  start: Vec2D;

  /**
   * End position of the gradient
   */
  end: Vec2D;
}

/**
 * Radial gradient parameters
 */
interface RadialGradient {
  type: 'radial';

  /**
   * Inner radial center
   */
  inPos: Vec2D;

  /**
   * Outer radial center
   */
  outPos: Vec2D;

  /**
   * Inner radius
   */
  inR: number;

  /**
   * Outer radius
   */
  outR: number;
}

class ColorGradient {
  readonly grad: CanvasGradient;

  /**
   * Alpha value between [0, 255]
   */
  a: number;

  /**
   * A wrapper for a canvas color gradient. It can
   * implement both LinearGradient and RadialGradient types.
   *
   * The parameters are dependent on gradient type:
   *     "linear" - {start (Vec2D), end (Vec2D)}
   *     "radial" - {inPos (Vec2D), inR (Number),
   *                 outPos (Vec2D), outR (Number)}
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
        parameters.inPos.x,
        parameters.inPos.y,
        parameters.inR,
        parameters.outPos.x,
        parameters.outPos.y,
        parameters.outR
      );
    }
    this.a = alpha;
  }

  /**
   * Set a color at a position in the gradient.
   *
   * @param color Target color value
   * @param t     Position in gradient between [0, 1]
   */
  addValue(color: Color, t: number) {
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
