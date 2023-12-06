import { motion } from 'framer-motion'

export default function Page() {
  return (
    <div className={'p-16 text-3xl'}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        hello
      </motion.div>
      <motion.div
        className={'bg-blue-500 w-32 h-32 mb-4'}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3 }}
      />

      <motion.div
        className={'bg-blue-500 w-32 h-32 mb-16'}
        animate={{
          // array -> keyframes -> [from, to]
          scale: [1, 2, 2, 1, 1],  // [1, 2, 2, 1, 1] means that the scale will be 1 at the beginning, then 2, then 2 again, then 1, then 1 again
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          loop: Infinity,
          repeatDelay: 1
        }}
      />

      {/* scroll-triggered animations */}
      {/*<motion.div*/}
      {/*  initial={{ opacity: 0 }}*/}
      {/*  whileInView={{ opacity: 1 }}*/}
      {/*  viewport={{ once: true }} // viewport means the browser window*/}
      {/*/>*/}

      {/*
        Two types of scroll animations:
          - scroll-triggered animations: the animation is triggered when the element enters (or leave) the viewport.

            `whileInView` is a shorthand for `while` and `viewport` props.
            The `viewport` prop is used to configure the viewport behavior of the animation.
            The `once` option means that the animation will only be triggered once, when the element enters the viewport for the first time. The `once` option is `false` by default, which means that the animation will be triggered every time the element enters the viewport.

          - Scroll-linked animations: the progress of the animation is linked to the scroll progress.
       */}

      <motion.div
        className={'bg-blue-500 w-32 h-32 mt-96'}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 5 }}
        viewport={{ once: true }}
      />

    </div>
  )
}
