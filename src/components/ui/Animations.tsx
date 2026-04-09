"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    duration?: number;
}

export function FadeIn({
    children,
    delay = 0,
    direction = "up",
    distance = 20,
    duration = 0.5,
    ...props
}: FadeInProps) {
    const directions = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[direction],
            }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function FadeInStagger({
    children,
    staggerDelay = 0.05,
    delayChildren = 0,
    ...props
}: {
    children: ReactNode;
    staggerDelay?: number;
    delayChildren?: number;
} & HTMLMotionProps<"div">) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                initial: {},
                animate: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren,
                    },
                },
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function FadeInStaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
    return (
        <motion.div
            variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
            }}
            transition={{
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function SlideIn({
    children,
    delay = 0,
    duration = 0.3,
    ...props
}: {
    children: ReactNode;
    delay?: number;
    duration?: number;
} & HTMLMotionProps<"div">) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
