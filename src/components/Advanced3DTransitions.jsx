import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to calculate cube face transforms
const getCubeFaceTransform = (index) => {
	const size = 256; // 64 * 4
	const halfSize = size / 2;

	switch (index) {
		case 0: // Front
			return `translateZ(${halfSize}px)`;
		case 1: // Back
			return `rotateY(180deg) translateZ(${halfSize}px)`;
		case 2: // Right
			return `rotateY(90deg) translateZ(${halfSize}px)`;
		case 3: // Left
			return `rotateY(-90deg) translateZ(${halfSize}px)`;
		case 4: // Top
			return `rotateX(90deg) translateZ(${halfSize}px)`;
		case 5: // Bottom
			return `rotateX(-90deg) translateZ(${halfSize}px)`;
		default:
			return 'translateZ(0)';
	}
};

// 3D Flip Transition Component
export const Flip3DTransition = ({
	children,
	isActive = true,
	direction = 'horizontal',
	duration = 0.8
}) => {
	const [isVisible, setIsVisible] = useState(isActive);

	useEffect(() => {
		setIsVisible(isActive);
	}, [isActive]);

	const variants = {
		hidden: {
			opacity: 0,
			rotateY: direction === 'horizontal' ? 90 : 0,
			rotateX: direction === 'vertical' ? 90 : 0,
			scale: 0.8,
			transition: {
				duration: duration,
				ease: 'easeInOut'
			}
		},
		visible: {
			opacity: 1,
			rotateY: 0,
			rotateX: 0,
			scale: 1,
			transition: {
				duration: duration,
				ease: 'easeInOut'
			}
		},
		exit: {
			opacity: 0,
			rotateY: direction === 'horizontal' ? -90 : 0,
			rotateX: direction === 'vertical' ? -90 : 0,
			scale: 0.8,
			transition: {
				duration: duration,
				ease: 'easeInOut'
			}
		}
	};

	return (
		<AnimatePresence mode="wait">
			{isVisible && (
				<motion.div
					key="content"
					initial="hidden"
					animate="visible"
					exit="exit"
					variants={variants}
					style={{
						transformStyle: 'preserve-3d',
						perspective: 1000
					}}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

// 3D Cube Rotation Component
export const Cube3DRotator = ({
	children,
	autoRotate = true,
	interactive = true
}) => {
	const [rotation, setRotation] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);

	useEffect(() => {
		if (!autoRotate) return;

		const interval = setInterval(() => {
			setRotation(prev => ({
				x: prev.x + 0.5,
				y: prev.y + 1
			}));
		}, 50);

		return () => clearInterval(interval);
	}, [autoRotate]);

	const handleMouseMove = (e) => {
		if (!interactive) return;

		const rect = containerRef.current.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const deltaX = (mouseX - centerX) / centerX;
		const deltaY = (mouseY - centerY) / centerY;

		setRotation({
			x: deltaY * 30,
			y: -deltaX * 30
		});
	};

	const handleMouseLeave = () => {
		if (autoRotate) {
			setRotation({ x: 0, y: 0 });
		}
	};

	return (
		<div
			ref={containerRef}
			className="perspective-1000 flex items-center justify-center min-h-[400px]"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			<motion.div
				className="relative w-64 h-64"
				style={{
					transformStyle: 'preserve-3d',
					rotateX: rotation.x,
					rotateY: rotation.y
				}}
				transition={{
					type: 'spring',
					stiffness: 50,
					damping: 15
				}}
			>
				{/* Cube Faces */}
				{[0, 1, 2, 3, 4, 5].map((faceIndex) => (
					<motion.div
						key={faceIndex}
						className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 
                      dark:from-gray-900/90 dark:to-gray-900/70
                      backdrop-blur-xl border border-white/20 dark:border-white/10
                      rounded-xl shadow-2xl flex items-center justify-center"
						style={{
							transform: getCubeFaceTransform(faceIndex),
							backfaceVisibility: 'visible'
						}}
						whileHover={{
							scale: 1.05,
							boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
						}}
					>
						{faceIndex === 0 && children}
						{faceIndex > 0 && (
							<div className="text-center p-6">
								<div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br 
                              from-indigo-500 to-purple-500 flex items-center justify-center">
									<span className="text-white font-bold text-xl">{faceIndex}</span>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
									Section {faceIndex}
								</p>
							</div>
						)}
					</motion.div>
				))}
			</motion.div>
		</div>
	);
};

// 3D Stack Carousel Component
export const StackCarousel3D = ({
	items,
	currentIndex = 0,
	onIndexChange,
	autoPlay = false,
	autoPlayInterval = 3000
}) => {
	const [index, setIndex] = useState(currentIndex);

	useEffect(() => {
		setIndex(currentIndex);
	}, [currentIndex]);

	useEffect(() => {
		if (!autoPlay) return;

		const interval = setInterval(() => {
			setIndex(prev => {
				const newIndex = (prev + 1) % items.length;
				if (onIndexChange) {
					onIndexChange(newIndex);
				}
				return newIndex;
			});
		}, autoPlayInterval);

		return () => clearInterval(interval);
	}, [autoPlay, autoPlayInterval, items.length, onIndexChange]);

	const handleNext = () => {
		const newIndex = (index + 1) % items.length;
		setIndex(newIndex);
		if (onIndexChange) {
			onIndexChange(newIndex);
		}
	};

	const handlePrev = () => {
		const newIndex = (index - 1 + items.length) % items.length;
		setIndex(newIndex);
		if (onIndexChange) {
			onIndexChange(newIndex);
		}
	};

	return (
		<div className="relative perspective-2000 min-h-[500px] flex items-center justify-center">
			<div className="relative w-full max-w-4xl h-[400px]">
				{items.map((item, i) => {
					const position = (i - index + items.length) % items.length;
					const zIndex = items.length - position;
					const scale = Math.max(0.5, 1 - position * 0.2);
					const x = position * 200;
					const opacity = Math.max(0.3, 1 - position * 0.3);

					return (
						<motion.div
							key={i}
							className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md"
							style={{
								zIndex,
								scale,
								x,
								opacity,
								transformStyle: 'preserve-3d',
								rotateY: position * -15,
								rotateX: position * -5
							}}
							animate={{
								zIndex,
								scale,
								x,
								opacity,
								rotateY: position * -15,
								rotateX: position * -5
							}}
							transition={{
								duration: 0.8,
								ease: 'easeInOut'
							}}
							whileHover={{
								scale: scale * 1.05,
								zIndex: items.length + 1,
								boxShadow: '0 30px 60px rgba(99, 102, 241, 0.5)'
							}}
						>
							<div className="bg-gradient-to-br from-white/90 to-white/70 
                            dark:from-gray-900/90 dark:to-gray-900/70
                            backdrop-blur-xl border border-white/20 dark:border-white/10
                            rounded-2xl shadow-2xl p-8 min-h-[300px]">
								{item}
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Navigation Buttons */}
			<motion.button
				className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full 
                  bg-gradient-to-br from-indigo-600 to-purple-600 text-white
                  flex items-center justify-center shadow-lg hover:shadow-xl
                  transition-all duration-300 z-10"
				whileHover={{ scale: 1.1, x: -2 }}
				whileTap={{ scale: 0.9 }}
				onClick={handlePrev}
			>
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
				</svg>
			</motion.button>

			<motion.button
				className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full 
                  bg-gradient-to-br from-indigo-600 to-purple-600 text-white
                  flex items-center justify-center shadow-lg hover:shadow-xl
                  transition-all duration-300 z-10"
				whileHover={{ scale: 1.1, x: 2 }}
				whileTap={{ scale: 0.9 }}
				onClick={handleNext}
			>
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
				</svg>
			</motion.button>

			{/* Indicators */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
				{items.map((_, i) => (
					<motion.button
						key={i}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index ? 'bg-indigo-600 w-8 rounded' : 'bg-gray-300 dark:bg-gray-700'
							}`}
						whileHover={{ scale: 1.2 }}
						whileTap={{ scale: 0.8 }}
						onClick={() => {
							setIndex(i);
							if (onIndexChange) {
								onIndexChange(i);
							}
						}}
					/>
				))}
			</div>
		</div>
	);
};

// 3D Floating Elements Component
export const FloatingElements3D = ({
	children,
	count = 3,
	speed = 1,
	range = 20
}) => {
	return (
		<div className="relative w-full h-[400px] overflow-hidden">
			{Array.from({ length: count }).map((_, i) => {
				const delay = i * (2 / count);
				return (
					<motion.div
						key={i}
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
						animate={{
							x: [0, range, 0, -range, 0],
							y: [0, -range, 0, range, 0],
							z: [0, range / 2, 0, -range / 2, 0],
							rotateY: [0, 180, 360],
							rotateX: [0, 90, 0, -90, 0]
						}}
						transition={{
							duration: 8 / speed,
							delay,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
						style={{
							transformStyle: 'preserve-3d',
							perspective: 1000
						}}
					>
						<div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 
                          rounded-xl shadow-lg backdrop-blur-sm border border-white/20
                          flex items-center justify-center">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
									d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
							</svg>
						</div>
					</motion.div>
				);
			})}

			<div className="absolute inset-0 flex items-center justify-center">
				{children}
			</div>
		</div>
	);
};

// 3D Morphing Shape Component
export const MorphingShape3D = ({
	color = '#6366f1',
	size = 200,
	duration = 3
}) => {
	const shapes = [
		{ d: 'M100 50 L150 150 L50 150 Z', fill: `${color}80` }, // Triangle
		{ d: 'M100 50 L150 100 L150 150 L100 200 L50 150 L50 100 Z', fill: `${color}90` }, // Hexagon
		{ d: 'M100 50 A50 50 0 1 1 100 150 A50 50 0 1 1 100 50', fill: `${color}A0` }, // Circle
		{ d: 'M100 50 L150 50 L150 150 L100 200 L50 150 L50 50 Z', fill: `${color}B0` } // Irregular
	];

	return (
		<div className="flex items-center justify-center min-h-[300px]">
			<motion.svg
				width={size}
				height={size}
				viewBox="0 0 200 200"
				className="transform-style-preserve-3d"
				animate={{
					rotate: [0, 90, 180, 270, 360],
					perspective: [1000, 1500, 1000],
					scale: [1, 1.1, 1]
				}}
				transition={{
					duration: duration * 2,
					repeat: Infinity,
					ease: 'easeInOut'
				}}
			>
				<motion.path
					animate={{
						d: shapes.map(shape => shape.d),
						fill: shapes.map(shape => shape.fill)
					}}
					transition={{
						duration: duration,
						repeat: Infinity,
						ease: 'easeInOut',
						repeatType: 'mirror'
					}}
					stroke={color}
					strokeWidth="2"
				/>

				{/* Inner glow */}
				<motion.circle
					cx="100"
					cy="100"
					r="40"
					fill={color}
					animate={{
						opacity: [0.3, 0.6, 0.3],
						scale: [1, 1.2, 1]
					}}
					transition={{
						duration: duration,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
					style={{ filter: 'blur(10px)' }}
				/>
			</motion.svg>
		</div>
	);
};
