// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Create fire effect elements
function createFireEffect() {
    const fireEffect = document.createElement('div');
    fireEffect.className = 'fire-effect';
    
    // Create multiple flame elements with different sizes and positions
    for (let i = 0; i < 8; i++) {
        const flame = document.createElement('div');
        flame.className = 'flame';
        const size = 15 + Math.random() * 20;
        flame.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #ff4d00 0%, #ff8c00 50%, transparent 100%);
            border-radius: 50%;
            animation: flicker ${1 + Math.random()}s infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            filter: blur(2px);
        `;
        fireEffect.appendChild(flame);
    }
    
    return fireEffect;
}

// Add fire effects to all product sections
document.querySelectorAll('.product-section').forEach(section => {
    const fireEffect = createFireEffect();
    section.querySelector('.product-image').appendChild(fireEffect);
});

// Handle quantity controls with dynamic pricing
document.querySelectorAll('.quantity-controls').forEach(control => {
    const input = control.querySelector('.quantity-input');
    const minusBtn = control.querySelector('.minus');
    const plusBtn = control.querySelector('.plus');
    const priceElement = control.closest('.card-content').querySelector('.price');
    
    // Extract the numeric price value, removing currency symbols and any whitespace
    const basePrice = parseFloat(priceElement.textContent.replace(/[^0-9.-]+/g, ''));
    const currencySymbol = priceElement.textContent.replace(/[0-9.-]+/g, '').trim();

    function updatePrice() {
        const quantity = parseInt(input.value);
        const totalPrice = (basePrice * quantity).toFixed(2);
        priceElement.textContent = `${currencySymbol}${totalPrice}`;
        
        // Add a flash effect when price updates
        gsap.fromTo(priceElement, 
            { scale: 1.1, color: 'var(--primary-color)' },
            { scale: 1, color: 'var(--secondary-color)', duration: 0.3, ease: 'power2.out' }
        );
    }

    minusBtn.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
            updateButtonState(control);
            updatePrice();
        }
    });

    plusBtn.addEventListener('click', () => {
        let value = parseInt(input.value);
        if (value < 99) {
            input.value = value + 1;
            updateButtonState(control);
            updatePrice();
        }
    });

    input.addEventListener('change', () => {
        let value = parseInt(input.value);
        if (value < 1) input.value = 1;
        if (value > 99) input.value = 99;
        updateButtonState(control);
        updatePrice();
    });

    function updateButtonState(control) {
        const value = parseInt(input.value);
        minusBtn.disabled = value <= 1;
        plusBtn.disabled = value >= 99;
    }

    // Initialize price display
    updatePrice();
});

// Scroll animations for products with parallax effect
document.querySelectorAll('.product-section').forEach((section, index) => {
    const display = section.querySelector('.product-display');
    const image = section.querySelector('.product-img');
    const card = section.querySelector('.card-content');
    const cardElements = card.querySelectorAll('h2, p, .price-container, .buy-btn');
    
    // Initial state
    gsap.set(display, { opacity: 0 });
    gsap.set(image, { scale: 0.8, opacity: 0 });
    gsap.set(card, { x: 100, opacity: 0 });
    gsap.set(cardElements, { x: 50, opacity: 0 });
    
    // Create timeline for each section
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top center+=20%',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        }
    });

    tl.to(display, {
        opacity: 1,
        duration: 0.3
    })
    .to(image, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.4)'
    }, '-=0.2')
    .to(card, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
    }, '-=0.3')
    .to(cardElements, {
        x: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out'
    }, '-=0.2');

    // Faster parallax effect for images
    gsap.to(image, {
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
        },
        y: -30
    });
});

// Create dynamic ember particles around images
function createImageEmbers() {
    document.querySelectorAll('.product-image').forEach(imageContainer => {
        // Create ember ring container
        const emberRing = document.createElement('div');
        emberRing.className = 'ember-ring';
        imageContainer.appendChild(emberRing);

        // Create ember particles around the image
        const numEmbers = 12;
        for (let i = 0; i < numEmbers; i++) {
            const ember = document.createElement('div');
            ember.className = 'image-ember';
            
            // Calculate position around the image
            const angle = (i / numEmbers) * Math.PI * 2;
            const radius = 100 + Math.random() * 50;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            ember.style.left = `calc(50% + ${x}px)`;
            ember.style.top = `calc(50% + ${y}px)`;
            
            emberRing.appendChild(ember);

            // Animate each ember
            gsap.to(ember, {
                opacity: 0.8,
                duration: 0.5,
                delay: i * 0.1
            });

            // Create floating animation
            gsap.to(ember, {
                y: `-=${20 + Math.random() * 30}`,
                x: `+=${-10 + Math.random() * 20}`,
                rotation: -180 + Math.random() * 360,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: Math.random()
            });

            // Create pulsing effect
            gsap.to(ember, {
                scale: 0.5 + Math.random() * 0.5,
                opacity: 0.3 + Math.random() * 0.5,
                duration: 1 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: Math.random()
            });
        }

        // Enhanced hover effect for image container
        imageContainer.addEventListener('mouseenter', () => {
            const embers = emberRing.querySelectorAll('.image-ember');
            
            embers.forEach(ember => {
                gsap.to(ember, {
                    scale: 1.5,
                    opacity: 1,
                    filter: 'blur(2px)',
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Speed up animations
                const tweens = gsap.getTweensOf(ember);
                tweens.forEach(tween => {
                    tween.timeScale(2);
                });
            });

            // Add trailing particles on hover
            const createTrail = () => {
                if (!imageContainer.matches(':hover')) return;
                
                const trail = document.createElement('div');
                trail.className = 'image-ember';
                trail.style.left = `${Math.random() * 100}%`;
                trail.style.top = `${Math.random() * 100}%`;
                emberRing.appendChild(trail);

                gsap.to(trail, {
                    y: -100,
                    x: -20 + Math.random() * 40,
                    rotation: -180 + Math.random() * 360,
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power1.out',
                    onComplete: () => trail.remove()
                });

                setTimeout(createTrail, 100);
            };

            createTrail();
        });

        imageContainer.addEventListener('mouseleave', () => {
            const embers = emberRing.querySelectorAll('.image-ember');
            
            embers.forEach(ember => {
                gsap.to(ember, {
                    scale: 1,
                    opacity: 0.8,
                    filter: 'blur(1px)',
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Reset animation speed
                const tweens = gsap.getTweensOf(ember);
                tweens.forEach(tween => {
                    tween.timeScale(1);
                });
            });
        });
    });
}

// Initialize ember particles for images
createImageEmbers();

// Enhanced hover animations for product cards
document.querySelectorAll('.card-content').forEach(card => {
    const cardElements = card.querySelectorAll('h2, p, .price-container');
    const dots = card.querySelectorAll('.heat-dot.active');
    const image = card.closest('.product-section').querySelector('.product-img');
    let hoverTimeout;
    
    card.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        
        gsap.to(card, {
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px var(--glow-color)',
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.to(image, {
            filter: 'drop-shadow(0 0 30px var(--glow-color))',
            scale: 1.05,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Animate heat dots with more intense glow
        dots.forEach((dot, index) => {
            gsap.to(dot, {
                scale: 1.3,
                boxShadow: '0 0 30px var(--primary-color), 0 0 60px var(--glow-color)',
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out'
            });

            // Increase particle animation speed smoothly
            const particles = dot.querySelectorAll('.ember-particle');
            particles.forEach(particle => {
                gsap.to(particle, {
                    timeScale: 2,
                    filter: 'blur(2px) brightness(1.5)',
                    duration: 0.8,
                    ease: 'power2.inOut'
                });
            });
        });
    });

    card.addEventListener('mouseleave', () => {
        // Add delay before reverting animations
        hoverTimeout = setTimeout(() => {
            gsap.to(card, {
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                duration: 1.2,
                ease: 'power2.inOut'
            });

            gsap.to(image, {
                filter: 'drop-shadow(0 0 20px var(--glow-color))',
                scale: 1,
                duration: 1.2,
                ease: 'power2.inOut'
            });

            dots.forEach(dot => {
                gsap.to(dot, {
                    scale: 1,
                    boxShadow: '0 0 15px var(--primary-color)',
                    duration: 1,
                    ease: 'power2.inOut'
                });

                const particles = dot.querySelectorAll('.ember-particle');
                particles.forEach(particle => {
                    gsap.to(particle, {
                        timeScale: 1,
                        filter: 'blur(1px) brightness(1)',
                        duration: 1.2,
                        ease: 'power2.inOut'
                    });
                });
            });
        }, 200); // Small delay before reverting
    });
});

// Enhanced button hover effect
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            boxShadow: '0 0 30px var(--glow-color), 0 0 60px rgba(255, 77, 0, 0.3)',
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            boxShadow: 'none',
            duration: 1,
            ease: 'power2.inOut'
        });
    });
});

// Enhanced parallax effect for product images
document.querySelectorAll('.image-wrapper').forEach(wrapper => {
    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 15;
        const rotateY = ((x - centerX) / centerX) * 15;
        
        gsap.to(wrapper, {
            rotationX: -rotateX,
            rotationY: rotateY,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    wrapper.addEventListener('mouseleave', () => {
        gsap.to(wrapper, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

// Add floating animation to product images
document.querySelectorAll('.product-img').forEach(img => {
    gsap.to(img, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}); 