import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Mouse-following Background Effect
export const MouseFollowerBackground = ({
	children,
	color = '#6366f1',
	size = 300
}) => {
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springX = useSpring(x, { stiffness: 50, damping: 20 });
	const springY = useSpring(y, { stiffness: 50, damping: 20 });

	const handleMouseMove = (e) => {
		const { clientX, clientY } = e;
		x.set(clientX);
		y.set(clientY);
	};

	return (
		<div
			className="relative min-h-screen overflow-hidden"
			onMouseMove={handleMouseMove}
		>
			{/* Follower Gradient */}
			<motion.div
				className="absolute rounded-full pointer-events-none opacity-20"
				style={{
					width: size,
					height: size,
					x: useTransform(springX, (val) => val - size / 2),
					y: useTransform(springY, (val) => val - size / 2),
					background: `
            radial-gradient(circle, 
              ${color} 0%, 
              ${color}40 40%, 
              transparent 70%
            )
          `,
					filter: 'blur(40px)',
					transform: 'translate3d(0, 0, 0)'
				}}
			/>

			{/* Secondary Follower */}
			<motion.div
				className="absolute rounded-full pointer-events-none opacity-15"
				style={{
					width: size * 0.6,
					height: size * 0.6,
					x: useTransform(springX, (val) => val - (size * 0.6) / 2),
					y: useTransform(springY, (val) => val - (size * 0.6) / 2),
					background: `
            radial-gradient(circle, 
              #a855f7 0%, 
              #a855f740 40%, 
              transparent 70%
            )
          `,
					filter: 'blur(30px)',
					transform: 'translate3d(0, 0, 0)'
				}}
				animate={{
					scale: [1, 1.1, 1],
					opacity: [0.15, 0.2, 0.15]
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			/>

			{/* Tertiary Follower */}
			<motion.div
				className="absolute rounded-full pointer-events-none opacity-10"
				style={{
					width: size * 0.8,
					height: size * 0.8,
					x: useTransform(springX, (val) => val - (size * 0.8) / 2),
					y: useTransform(springY, (val) => val - (size * 0.8) / 2),
					background: `
            radial-gradient(circle, 
              #22d3ee 0%, 
              #22d3ee40 40%, 
              transparent 70%
            )
          `,
					filter: 'blur(35px)',
					transform: 'translate3d(0, 0, 0)'
				}}
				animate={{
					scale: [1, 0.9, 1],
					opacity: [0.1, 0.15, 0.1]
				}}
				transition={{
					duration: 2.5,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			/>

			{/* Content Layer */}
			<div className="relative z-10">
				{children}
			</div>
		</div>
	);
};

// Parallax Scroll Container
export const ParallaxContainer = ({
	children,
	intensity = 0.2,
	className = ''
}) => {
	const ref = useRef(null);
	const y = useMotionValue(0);

	const handleScroll = useCallback(() => {
		if (ref.current) {
			const rect = ref.current.getBoundingClientRect();
			const scrollY = window.scrollY;
			const elementY = rect.top + scrollY;
			const centerY = window.innerHeight / 2;
			const distance = (elementY - scrollY - centerY) * intensity;
			y.set(distance);
		}
	}, [intensity, y]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial position

		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	return (
		<motion.div
			ref={ref}
			className={className}
			style={{
				y,
				willChange: 'transform'
			}}
		>
			{children}
		</motion.div>
	);
};

// Interactive Card with Tilt Effect
export const TiltCard = ({
	children,
	className = '',
	tiltAngle = 15,
	scale = 1.02
}) => {
	const [rotate, setRotate] = useState({ x: 0, y: 0 });
	const [isHovered, setIsHovered] = useState(false);
	const containerRef = useRef(null);

	const handleMouseMove = (e) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const deltaX = (mouseX - centerX) / centerX;
		const deltaY = (mouseY - centerY) / centerY;

		setRotate({
			x: deltaY * tiltAngle,
			y: -deltaX * tiltAngle
		});
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setRotate({ x: 0, y: 0 });
	};

	return (
		<motion.div
			ref={containerRef}
			className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/80 to-white/60
        dark:from-gray-900/80 dark:to-gray-900/60
        backdrop-blur-xl border border-white/20
        dark:border-white/10 shadow-lg
        ${className}
      `}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			animate={{
				rotateX: rotate.x,
				rotateY: rotate.y,
				scale: isHovered ? scale : 1,
				boxShadow: isHovered ? '0 25px 50px rgba(99, 102, 241, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.1)'
			}}
			transition={{
				type: 'spring',
				stiffness: 150,
				damping: 20
			}}
			style={{
				transformStyle: 'preserve-3d',
				perspective: 1000
			}}
		>
			<div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
				{children}
			</div>
		</motion.div>
	);
};

// Sound-Reactive Visualizer (Simulated)
export const SoundReactiveVisualizer = ({
	isPlaying = false,
	color = '#6366f1',
	height = 80
}) => {
	const [bars, setBars] = useState(
		Array.from({ length: 30 }, (_, i) => ({
			id: i,
			height: 0.5
		}))
	);

	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setBars(prev =>
				prev.map(bar => ({
					...bar,
					height: Math.max(0.2, Math.min(1, bar.height + (Math.random() - 0.5) * 0.3))
				}))
			);
		}, 100);

		return () => clearInterval(interval);
	}, [isPlaying]);

	return (
		<div className="flex items-end justify-center gap-1 h-full">
			{bars.map(bar => (
				<motion.div
					key={bar.id}
					className="w-2 rounded-t-lg"
					style={{
						height: `${bar.height * height}px`,
						backgroundColor: color
					}}
					animate={{
						height: `${bar.height * height}px`,
						opacity: [0.6, 0.8, 0.6]
					}}
					transition={{
						duration: 0.1,
						ease: 'easeInOut'
					}}
				/>
			))}
		</div>
	);
};

// Particle Emitter Component
export const ParticleEmitter = ({
	x,
	y,
	count = 20,
	color = '#6366f1',
	duration = 1,
	onComplete
}) => {
	const [particles] = useState(() =>
		Array.from({ length: count }, (_, i) => ({
			id: i,
			angle: (Math.PI * 2 / count) * i,
			distance: 50 + 20,
			duration: 0.5 + 0.5
		}))
	);

	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				if (onComplete) onComplete();
			}, duration * 1000);
			return () => clearTimeout(timer);
		}
	}, [duration, onComplete]);

	return (
		<div
			className="absolute pointer-events-none"
			style={{
				left: x,
				top: y,
				transform: 'translate(-50%, -50%)'
			}}
		>
			{particles.map(particle => (
				<motion.div
					key={particle.id}
					className="absolute w-2 h-2 rounded-full"
					style={{
						backgroundColor: color,
						boxShadow: `0 0 10px ${color}`
					}}
					initial={{
						x: 0,
						y: 0,
						opacity: 1,
						scale: 1
					}}
					animate={{
						x: Math.cos(particle.angle) * particle.distance,
						y: Math.sin(particle.angle) * particle.distance,
						opacity: 0,
						scale: 0
					}}
					transition={{
						duration: particle.duration,
						ease: 'easeOut'
					}}
				/>
			))}
		</div>
	);
};

// Gravity Well Effect
export const GravityWell = ({
	children,
	radius = 200,
	strength = 0.5,
	color = '#6366f1'
}) => {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [isActive, setIsActive] = useState(false);

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePos({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		});
	};

	const handleMouseEnter = () => {
		setIsActive(true);
	};

	const handleMouseLeave = () => {
		setIsActive(false);
	};

	return (
		<div
			className="relative overflow-hidden"
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Gravity Well Visualization */}
			{isActive && (
				<motion.div
					className="absolute rounded-full pointer-events-none"
					style={{
						width: radius * 2,
						height: radius * 2,
						left: mousePos.x - radius,
						top: mousePos.y - radius,
						background: `
              radial-gradient(circle,
                ${color}20 0%,
                ${color}10 30%,
                transparent 70%
              )
            `,
						filter: 'blur(20px)'
					}}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					transition={{ duration: 0.3 }}
				/>
			)}

			{/* Content with Gravity Effect */}
			<motion.div
				style={{
					x: isActive
						? (mousePos.x - radius) * strength * 0.1
						: 0,
					y: isActive
						? (mousePos.y - radius) * strength * 0.1
						: 0,
					rotate: isActive
						? (mousePos.x - radius) * strength * 0.05
						: 0
				}}
				transition={{
					type: 'spring',
					stiffness: 50,
					damping: 20
				}}
			>
				{children}
			</motion.div>
		</div>
	);
};

// Touch Wave Effect
export const TouchWave = ({
	children,
	color = '#6366f1',
	waveCount = 3
}) => {
	const [waves, setWaves] = useState([]);

	const handleClick = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const newWave = {
			id: Date.now(),
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
		setWaves(prev => [...prev, newWave]);

		setTimeout(() => {
			setWaves(prev => prev.filter(w => w.id !== newWave.id));
		}, 2000);
	};

	return (
		<div
			className="relative touch-none"
			onClick={handleClick}
		>
			{/* Waves */}
			{waves.map(wave => (
				<div key={wave.id} className="absolute">
					{Array.from({ length: waveCount }).map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full border-2"
							style={{
								left: wave.x,
								top: wave.y,
								borderColor: color,
								width: i * 40,
								height: i * 40,
								x: -i * 20,
								y: -i * 20
							}}
							initial={{ scale: 0, opacity: 0.8 }}
							animate={{ scale: 1, opacity: 0 }}
							transition={{
								duration: 2,
								ease: 'easeOut',
								delay: i * 0.2
							}}
						/>
					))}
				</div>
			))}

			<div className="relative z-10">
				{children}
			</div>
		</div>
	);
};
