import { ICONS } from './icons.jsx'

export const R_ROOMS = [
  { id: 'ps', title: 'PS Room', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee', icon: ICONS.psRoomIcon },
  { id: 'pc', title: 'PC Room', glow: 'linear-gradient(90deg,#7C3AED,#D946EF)', iconBg: 'rgba(124,58,237,0.13)', iconBorder: 'rgba(124,58,237,0.28)', iconStroke: '#a78bfa', icon: ICONS.pcRoomIcon },
  { id: 'vip-standard', title: 'VIP Standard', glow: 'linear-gradient(90deg,#F59E0B,#F97316)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24', icon: ICONS.starIcon },
  { id: 'vip-elite', title: 'VIP Elite', glow: 'linear-gradient(90deg,#F97316,#EF4444)', iconBg: 'rgba(249,115,22,0.12)', iconBorder: 'rgba(249,115,22,0.28)', iconStroke: '#fb923c', icon: ICONS.starIcon2 },
  { id: 'vip-royal', title: 'VIP Royal', glow: 'linear-gradient(90deg,#D946EF,#7C3AED)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9', icon: ICONS.crownIcon },
]

export const TT_SECTIONS = [
  { emoji: '🏓', name: 'Ping Pong', color: '#06B6D4', cols: 4, items: [
    { id: 'pp-t1', title: 'Table 1', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee', icon: ICONS.ppIcon },
    { id: 'pp-t2', title: 'Table 2', glow: 'linear-gradient(90deg,#7C3AED,#D946EF)', iconBg: 'rgba(124,58,237,0.12)', iconBorder: 'rgba(124,58,237,0.28)', iconStroke: '#a78bfa', icon: ICONS.ppIcon },
    { id: 'pp-t3', title: 'Table 3', glow: 'linear-gradient(90deg,#D946EF,#06B6D4)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9', icon: ICONS.ppIcon },
    { id: 'pp-t4', title: 'Table 4', glow: 'linear-gradient(90deg,#06B6D4,#10B981)', iconBg: 'rgba(6,182,212,0.10)', iconBorder: 'rgba(6,182,212,0.22)', iconStroke: '#22d3ee', icon: ICONS.ppIcon },
  ]},
  { emoji: '🎱', name: 'Billiard', color: '#F59E0B', cols: 4, items: [
    { id: 'bi-t1', title: 'Table 1', glow: 'linear-gradient(90deg,#F59E0B,#10B981)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24', icon: ICONS.bilIcon },
    { id: 'bi-t2', title: 'Table 2', glow: 'linear-gradient(90deg,#10B981,#F59E0B)', iconBg: 'rgba(16,185,129,0.12)', iconBorder: 'rgba(16,185,129,0.28)', iconStroke: '#34d399', icon: ICONS.bilIcon },
    { id: 'bi-vb', title: 'VIP Blue', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee', icon: ICONS.bilIcon },
    { id: 'bi-vr', title: 'VIP Red', glow: 'linear-gradient(90deg,#EF4444,#D946EF)', iconBg: 'rgba(239,68,68,0.12)', iconBorder: 'rgba(239,68,68,0.28)', iconStroke: '#f87171', icon: ICONS.bilIcon },
  ]},
  { emoji: '⚽', name: 'Baby Foot', color: '#D946EF', cols: 2, items: [
    { id: 'bf-solo', title: 'Solo (1v1)', glow: 'linear-gradient(90deg,#F97316,#D946EF)', iconBg: 'rgba(249,115,22,0.12)', iconBorder: 'rgba(249,115,22,0.28)', iconStroke: '#fb923c', icon: ICONS.bfIcon },
    { id: 'bf-team', title: 'Team (2v2)', glow: 'linear-gradient(90deg,#D946EF,#F97316)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9', icon: ICONS.bfIcon },
  ]},
]

export const LOUNGE_BARS = [
  { id: 'bar-1', title: 'Bar 1', glow: 'linear-gradient(90deg,#F97316,#F59E0B)', iconBg: 'rgba(249,115,22,0.12)', iconBorder: 'rgba(249,115,22,0.28)', iconStroke: '#fb923c' },
  { id: 'bar-2', title: 'Bar 2', glow: 'linear-gradient(90deg,#F59E0B,#D946EF)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24' },
  { id: 'bar-3', title: 'Bar 3', glow: 'linear-gradient(90deg,#D946EF,#7C3AED)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9' },
]
export const LOUNGE_TABLES = [
  { id: 'lounge-table-1', title: 'Table 1', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee' },
  { id: 'lounge-table-2', title: 'Table 2', glow: 'linear-gradient(90deg,#7C3AED,#D946EF)', iconBg: 'rgba(124,58,237,0.12)', iconBorder: 'rgba(124,58,237,0.28)', iconStroke: '#a78bfa' },
  { id: 'lounge-table-3', title: 'Table 3', glow: 'linear-gradient(90deg,#10B981,#06B6D4)', iconBg: 'rgba(16,185,129,0.12)', iconBorder: 'rgba(16,185,129,0.28)', iconStroke: '#34d399' },
  { id: 'lounge-table-4', title: 'Table 4', glow: 'linear-gradient(90deg,#F59E0B,#10B981)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24' },
]
