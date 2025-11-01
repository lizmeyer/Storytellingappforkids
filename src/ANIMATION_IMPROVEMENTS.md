# Card Animation Improvements

## Overview

Enhanced the card swipe animation system to match the smooth, spring-based physics from the reference video, creating a more fluid and natural interaction.

---

## Key Improvements

### 1. **Spring-Based Physics**

**Before:**
- Simple linear transitions
- Fixed duration animations
- Abrupt stops and starts

**After:**
- Spring physics with proper stiffness and damping
- Natural momentum and bounce
- Smooth, organic feeling

```typescript
transition: {
  type: "spring",
  stiffness: 400,
  damping: 30
}
```

---

### 2. **Improved Drag Physics**

**Enhanced drag parameters:**
- Reduced `dragElastic` from 0.7 → 0.2 (less stretchy, more controlled)
- Added `dragTransition` with bounceStiffness: 600, bounceDamping: 20
- Added `whileTap` scale effect (0.98) for tactile feedback

**Smarter swipe detection:**
```typescript
// Consider both distance AND velocity
const shouldSwipe = distance > threshold || (velocity > 500 && distance > 50);
```

This allows quick flicks to trigger swipes even with shorter distances.

---

### 3. **Smoother Transform Values**

**Before:**
```typescript
rotate = useTransform(x, [-200, 200], [-15, 15]);
opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
```

**After:**
```typescript
rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.3, 1, 1, 1, 0.3]);
```

Changes:
- Wider range (-300 to 300) for smoother rotation curve
- More pronounced rotation (-20° to +20°)
- Deeper opacity fade (0.3 minimum) for better visual feedback

---

### 4. **Background Card Stack Animation**

**Before:**
- CSS transitions only
- Static positioning

**After:**
- Spring-based motion for all cards
- Cards smoothly animate into position when deck changes
- Proper stacking with scale and vertical offset

```typescript
<motion.div
  animate={{
    scale: 0.95 - index * 0.025,
    y: (index + 1) * 10,
    opacity: 0.7 - index * 0.2,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8
  }}
>
```

---

### 5. **Card Entry Animation**

**New cards now:**
- Enter with scale animation (0.9 → 1.0)
- Fade in smoothly
- Spring into place naturally

```typescript
initial={{ scale: 0.9, opacity: 0 }}
animate={{
  scale: 1,
  opacity: 1,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 30
  }
}}
```

---

### 6. **Exit Animations**

**Enhanced exit behavior:**
- Cards rotate while exiting (25° for save, -25° for skip)
- Scale down slightly (0.9) during exit
- Spring physics for natural motion

```typescript
animate={exitDirection ? {
  x: exitDirection === 'right' ? 1000 : -1000,
  opacity: 0,
  rotate: exitDirection === 'right' ? 25 : -25,
  scale: 0.9,
  transition: { 
    type: "spring",
    stiffness: 300,
    damping: 30
  }
}
```

---

### 7. **Indicator Animations**

**Skip/Save indicators now:**
- Scale up as they fade in (0.8 → 1.0)
- More dynamic appearance
- Better visual feedback

```typescript
scale: useTransform(opacity, [0, 1], [0.8, 1])
```

---

### 8. **Improved Timing**

**Before:**
- 200ms timeout for card transitions

**After:**
- 300ms timeout for smoother card stack reorganization
- Better synchronization with exit animations
- More natural pacing

---

## Technical Details

### Spring Physics Parameters:

**Active Card:**
- stiffness: 400 (responsive but smooth)
- damping: 30 (controlled bounce)

**Background Cards:**
- stiffness: 300 (slightly slower)
- damping: 30
- mass: 0.8 (lighter feel)

**Exit Animation:**
- stiffness: 300
- damping: 30

### Transform Ranges:

**Rotation:** -300px to +300px → -20° to +20°
**Opacity:** Fades to 0.3 at extremes
**Skip Indicator:** Appears at -150px, full at -50px
**Save Indicator:** Appears at +50px, full at +150px

---

## Result

The card animations now feel:
- ✅ **Smooth** - Spring physics create natural motion
- ✅ **Responsive** - Quick flicks are detected properly
- ✅ **Fluid** - No jarring transitions or abrupt stops
- ✅ **Polished** - Professional-quality interaction
- ✅ **Natural** - Feels like physical cards with momentum

The experience closely matches the reference video with smooth, physics-based card interactions! 🃏✨
