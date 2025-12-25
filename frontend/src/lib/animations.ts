import { Variants } from 'framer-motion'

/**
 * Spring configuration for natural, bouncy animations
 */
export const springConfig = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 0.8
}

/**
 * Smooth spring for subtle interactions
 */
export const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.5
}

/**
 * Fast spring for quick interactions
 */
export const fastSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 17,
  mass: 0.3
}

/**
 * Fade in from bottom animation
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

/**
 * Simple fade in animation
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springConfig
  }
}

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springConfig
  }
}

/**
 * Stagger container for cascading animations
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

/**
 * Stagger container with faster timing
 */
export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

/**
 * Scale animation for cards
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springConfig
  }
}

/**
 * Hover scale interaction
 */
export const hoverScale = {
  scale: 1.05,
  transition: smoothSpring
}

/**
 * Tap scale interaction
 */
export const tapScale = {
  scale: 0.95,
  transition: {
    duration: 0.1
  }
}

/**
 * Hover lift effect for cards
 */
export const hoverLift = {
  y: -4,
  transition: smoothSpring
}

/**
 * Header entrance animation
 */
export const headerVariants: Variants = {
  hidden: {
    y: -20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}
