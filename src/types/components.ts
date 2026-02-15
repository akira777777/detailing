/**
 * Component Prop Types
 */

import type { ReactNode, MouseEventHandler } from 'react';

// Button component
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

// Input component
export interface InputProps {
  label?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Select component
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  name?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Modal component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Toast component
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

// Card component
export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

// Loading component
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Image component
export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  lazy?: boolean;
}

// Section Header component
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}
 * Component Prop Types
 */

import type { ReactNode, MouseEventHandler } from 'react';

// Button component
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

// Input component
export interface InputProps {
  label?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Select component
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  name?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Modal component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Toast component
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

// Card component
export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

// Loading component
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Image component
export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  lazy?: boolean;
}

// Section Header component
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

