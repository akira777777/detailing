import React, { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Holographic Card Component
export const HolographicCard = ({
	children,
	className = '',
	hoverEffect = true,
	clickEffect = true,
	glowIntensity = 0.5,
	rotationIntensity = 10
}) => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);
	const [isClicked, setIsClicked] = useState(false);

	const rotateX = useSpring(useMotionValue(0), {
		stiffness: 100,
		damping: 15
	});

	const rotateY = useSpring(useMotionValue(0), {
		stiffness: 100,
		damping: 15
	});

	const scale = useSpring(useMotionValue(1), {
		stiffness: 200,
		damping: 20
	});

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const deltaX = (mouseX - centerX) / centerX;
		const deltaY = (mouseY - centerY) / centerY;

		setMousePosition({ x: deltaX, y: deltaY });

		if (hoverEffect) {
			rotateX.set(deltaY * rotationIntensity);
			rotateY.set(-deltaX * rotationIntensity);
		}
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
		scale.set(1.02);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		scale.set(1);
		rotateX.set(0);
		rotateY.set(0);
	};

	const handleMouseDown = () => {
		if (clickEffect) {
			setIsClicked(true);
			scale.set(0.98);
		}
	};

	const handleMouseUp = () => {
		if (clickEffect) {
			setIsClicked(false);
			scale.set(1.02);
		}
	};

	const handleMouseLeaveClick = () => {
		if (clickEffect) {
			setIsClicked(false);
			scale.set(1);
		}
	};

	return (
		<motion.div
			className={`
        relative overflow-hidden rounded-2xl 
        bg-gradient-to-br from-white/80 to-white/60 
        dark:from-gray-900/80 dark:to-gray-900/60
        backdrop-blur-xl border border-white/20 
        dark:border-white/10
        ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
        ${isClicked ? 'shadow-inner' : ''}
        ${className}
      `}
			style={{
				transformStyle: 'preserve-3d',
				perspective: 1000,
				scale,
				rotateX,
				rotateY
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={() => {
				handleMouseLeave();
				handleMouseLeaveClick();
			}}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			{/* Holographic Glow Effect */}
			<motion.div
				className="absolute inset-0 opacity-0 transition-opacity duration-300"
				animate={{ opacity: isHovered ? glowIntensity : 0 }}
				style={{
					background: `
            radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, 
              rgba(99, 102, 241, 0.3) 0%, 
              rgba(168, 85, 247, 0.2) 30%, 
              transparent 60%
            ),
            radial-gradient(circle at ${50 - mousePosition.x * 20}% ${50 - mousePosition.y * 20}%, 
              rgba(34, 211, 238, 0.2) 0%, 
              transparent 50%
            )
          `,
					transform: 'translateZ(1px)'
				}}
			/>

			{/* Holographic Grid Pattern */}
			<motion.div
				className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
				animate={{ opacity: isHovered ? 0.15 : 0 }}
				style={{
					backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
					backgroundSize: '20px 20px',
					transform: 'translateZ(2px)'
				}}
			/>

			{/* Content */}
			<div className="relative z-10 p-6" style={{ transform: 'translateZ(3px)' }}>
				{children}
			</div>

			{/* Border Glow */}
			<div className="absolute inset-0 rounded-2xl p-px pointer-events-none">
				<div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
          from-indigo-500/50 via-purple-500/50 to-cyan-500/50
          opacity-0 transition-opacity duration-300
          hover:opacity-100"
				/>
			</div>
		</motion.div>
	);
};

// Holographic Button Component
export const HolographicButton = ({
	children,
	onClick,
	className = '',
	variant = 'primary',
	size = 'medium'
}) => {
	const [isPressed, setIsPressed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const sizes = {
		small: 'px-4 py-2 text-sm',
		medium: 'px-6 py-3 text-base',
		large: 'px-8 py-4 text-lg'
	};

	const variants = {
		primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
		secondary: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
		accent: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white',
		ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
	};

	return (
		<motion.button
			className={`
        relative overflow-hidden rounded-xl font-semibold 
        transition-all duration-300
        ${sizes[size]}
        ${variants[variant]}
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${isHovered ? 'shadow-lg' : 'shadow-md'}
        ${className}
      `}
			whileHover={{
				scale: 1.05,
				boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
			}}
			whileTap={{ scale: 0.95 }}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => {
				setIsPressed(false);
				setIsHovered(false);
			}}
			onMouseEnter={() => setIsHovered(true)}
			onClick={onClick}
		>
			{/* Shine Effect */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
				animate={{
					x: isHovered ? ['-100%', '100%'] : '-100%'
				}}
				transition={{
					duration: 1.5,
					repeat: isHovered ? Infinity : 0,
					ease: 'linear'
				}}
				style={{ transform: 'skewX(-20deg)' }}
			/>

			{/* Inner Glow */}
			<motion.div
				className="absolute inset-0 opacity-0 transition-opacity duration-300"
				animate={{ opacity: isHovered ? 0.4 : 0 }}
				style={{
					background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
				}}
			/>

			<span className="relative z-10 flex items-center justify-center gap-2">
				{children}
			</span>
		</motion.button>
	);
};

// Holographic Text Component
export const HolographicText = ({
	children,
	className = '',
	glowColor = '#6366f1',
	animation = 'pulse'
}) => {

	const animations = {
		pulse: {
			textShadow: [
				`0 0 5px ${glowColor}, 0 0 10px ${glowColor}, 0 0 15px ${glowColor}`,
				`0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
				`0 0 5px ${glowColor}, 0 0 10px ${glowColor}, 0 0 15px ${glowColor}`
			]
		},
		wave: {
			backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
		},
		flicker: {
			opacity: [1, 0.8, 1, 0.9, 1]
		}
	};

	return (
		<motion.span
			className={`
        relative inline-block bg-clip-text text-transparent
        bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500
        ${className}
      `}
			initial={{ opacity: 0, y: 20 }}
			animate={{
				opacity: 1,
				y: 0,
				...animations[animation]
			}}
			transition={{
				duration: animation === 'pulse' ? 2 : animation === 'wave' ? 3 : 0.5,
				repeat: Infinity,
				ease: 'easeInOut'
			}}
		>
			{children}

			{/* Additional glow layer */}
			<span className="absolute inset-0 -z-10 blur-xl opacity-20"
				style={{
					background: `linear-gradient(to right, ${glowColor}, #a855f7, #22d3ee)`,
					filter: 'blur(10px)'
				}}
			/>
		</motion.span>
	);
};

// Holographic Badge Component
export const HolographicBadge = ({
	children,
	className = '',
	color = 'indigo'
}) => {
	const colors = {
		indigo: 'from-indigo-500 to-purple-500',
		cyan: 'from-cyan-500 to-blue-500',
		pink: 'from-pink-500 to-rose-500',
		green: 'from-emerald-500 to-teal-500',
		orange: 'from-orange-500 to-red-500'
	};

	return (
		<motion.div
			className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full
        bg-gradient-to-r ${colors[color]} text-white
        backdrop-blur-sm border border-white/20
        shadow-lg hover:shadow-xl transition-all duration-300
        ${className}
      `}
			whileHover={{ scale: 1.05, rotate: 2 }}
			whileTap={{ scale: 0.95 }}
		>
			{/* Animated border pulse */}
			<motion.div
				className="absolute inset-0 rounded-full opacity-0"
				animate={{ opacity: [0, 0.3, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				style={{
					background: `
            radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)
          `
				}}
			/>

			<span className="relative z-10 font-semibold text-sm">
				{children}
			</span>
		</motion.div>
	);
};
