// Circular "reveal" used by the theme toggle and the hero video: a circle grows
// from the click point until it covers the whole box.

export const CIRCLE_REVEAL_TIMING = {
  duration: 600,
  easing: 'cubic-bezier(.76,.32,.29,.99)'
}

/** clip-path keyframes for a circle growing from (x, y) until it covers a width × height box */
export function circleRevealKeyframes(x: number, y: number, width: number, height: number) {
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
  return {
    clipPath: [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${radius}px at ${x}px ${y}px)`
    ]
  }
}
