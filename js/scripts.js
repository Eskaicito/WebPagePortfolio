

class CarouselPortfolio {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.container = document.getElementById('slider-container');
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupThumbnails();
        this.setupKeyboard();
        this.setupTouch();
        this.setupProjectCarousels();
        this.updateUI();
        this.initBauhausBackground();
    }
    
    // ========== NAVEGACIÓN PRINCIPAL ==========
    setupNavigation() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        prevBtn.addEventListener('click', () => this.goToPrevSlide());
        nextBtn.addEventListener('click', () => this.goToNextSlide());
    }
    
    goToSlide(index) {
        if (this.isAnimating) return;
        if (index < 0 || index >= this.totalSlides) return;
        
        this.isAnimating = true;
        this.currentSlide = index;
        
        const offset = -index * 100;
        this.container.style.transform = `translateX(${offset}vw)`;
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
        
        this.updateUI();
    }
    
    goToNextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    goToPrevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    // ========== THUMBNAILS ==========
    setupThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }
    
    // ========== TECLADO ==========
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.goToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                this.goToNextSlide();
            }
        });
    }
    
    // ========== TOUCH/SWIPE ==========
    setupTouch() {
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.goToNextSlide();
            } else {
                this.goToPrevSlide();
            }
        }
    }
    
    // ========== UPDATE UI ==========
    updateUI() {
        // Update counter
        document.getElementById('current-slide').textContent = 
            String(this.currentSlide + 1).padStart(2, '0');
        document.getElementById('total-slides').textContent = 
            String(this.totalSlides).padStart(2, '0');
        
        // Update thumbnails
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
    
    // ========== CARRUSELES DE PROYECTOS ==========
    setupProjectCarousels() {
        const projectSlides = document.querySelectorAll('.project-slide');
        
        projectSlides.forEach(slide => {
            const carousel = slide.querySelector('.media-carousel');
            if (!carousel) return;
            
            const items = carousel.querySelectorAll('.media-item');
            const prevBtn = slide.querySelector('.media-prev');
            const nextBtn = slide.querySelector('.media-next');
            const dotsContainer = slide.querySelector('.media-dots');
            
            let currentItem = 0;
            
            // Crear dots
            items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'media-dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => showItem(index));
                dotsContainer.appendChild(dot);
            });
            
            const dots = dotsContainer.querySelectorAll('.media-dot');
            
            function showItem(index) {
                items.forEach(item => item.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                items[index].classList.add('active');
                dots[index].classList.add('active');
                currentItem = index;
            }
            
            prevBtn.addEventListener('click', () => {
                const newIndex = currentItem > 0 ? currentItem - 1 : items.length - 1;
                showItem(newIndex);
            });
            
            nextBtn.addEventListener('click', () => {
                const newIndex = currentItem < items.length - 1 ? currentItem + 1 : 0;
                showItem(newIndex);
            });
        });
    }
    
    // ========== BAUHAUS ANIMATED BACKGROUND ==========
    initBauhausBackground() {
        const canvas = document.getElementById('background-canvas');
        const ctx = canvas.getContext('2d');
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resize();
        window.addEventListener('resize', resize);
        
        const shapes = [];
        const colors = ['#FF6600', '#00FFFF', '#FFD100', '#C8102E'];
        
        // Crear formas
        function createShapes() {
            // Círculos
            for (let i = 0; i < 3; i++) {
                shapes.push({
                    type: 'circle',
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: 80 + Math.random() * 120,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0.03 + Math.random() * 0.05,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    strokeOnly: true
                });
            }
            
            // Rectángulos
            for (let i = 0; i < 4; i++) {
                shapes.push({
                    type: 'rect',
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    width: 60 + Math.random() * 100,
                    height: 60 + Math.random() * 100,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0.04 + Math.random() * 0.06,
                    rotation: Math.random() * Math.PI,
                    rotationSpeed: (Math.random() - 0.5) * 0.002,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    strokeOnly: Math.random() > 0.5
                });
            }
            
            // Líneas
            for (let i = 0; i < 5; i++) {
                shapes.push({
                    type: 'line',
                    x1: Math.random() * canvas.width,
                    y1: Math.random() * canvas.height,
                    length: 100 + Math.random() * 200,
                    angle: Math.random() * Math.PI * 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0.03 + Math.random() * 0.04,
                    vx: (Math.random() - 0.5) * 0.15,
                    vy: (Math.random() - 0.5) * 0.15
                });
            }
            
            // Triángulos
            for (let i = 0; i < 3; i++) {
                shapes.push({
                    type: 'triangle',
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 60 + Math.random() * 80,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0.03 + Math.random() * 0.05,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.003,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    strokeOnly: true
                });
            }
        }
        
        createShapes();
        
        function drawCircle(shape) {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            ctx.globalAlpha = shape.opacity;
            
            if (shape.strokeOnly) {
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                ctx.fillStyle = shape.color;
                ctx.fill();
            }
        }
        
        function drawRect(shape) {
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation);
            ctx.globalAlpha = shape.opacity;
            
            if (shape.strokeOnly) {
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = 2;
                ctx.strokeRect(-shape.width/2, -shape.height/2, shape.width, shape.height);
            } else {
                ctx.fillStyle = shape.color;
                ctx.fillRect(-shape.width/2, -shape.height/2, shape.width, shape.height);
            }
            
            ctx.restore();
        }
        
        function drawLine(shape) {
            const x2 = shape.x1 + Math.cos(shape.angle) * shape.length;
            const y2 = shape.y1 + Math.sin(shape.angle) * shape.length;
            
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(x2, y2);
            ctx.globalAlpha = shape.opacity;
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        function drawTriangle(shape) {
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation);
            ctx.beginPath();
            ctx.moveTo(0, -shape.size/2);
            ctx.lineTo(-shape.size/2, shape.size/2);
            ctx.lineTo(shape.size/2, shape.size/2);
            ctx.closePath();
            ctx.globalAlpha = shape.opacity;
            
            if (shape.strokeOnly) {
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                ctx.fillStyle = shape.color;
                ctx.fill();
            }
            
            ctx.restore();
        }
        
        function update() {
            shapes.forEach(shape => {
                if (shape.type === 'line') {
                    shape.x1 += shape.vx;
                    shape.y1 += shape.vy;
                    
                    if (shape.x1 < -100) shape.x1 = canvas.width + 100;
                    if (shape.x1 > canvas.width + 100) shape.x1 = -100;
                    if (shape.y1 < -100) shape.y1 = canvas.height + 100;
                    if (shape.y1 > canvas.height + 100) shape.y1 = -100;
                } else {
                    shape.x += shape.vx;
                    shape.y += shape.vy;
                    
                    if (shape.x < -200) shape.x = canvas.width + 200;
                    if (shape.x > canvas.width + 200) shape.x = -200;
                    if (shape.y < -200) shape.y = canvas.height + 200;
                    if (shape.y > canvas.height + 200) shape.y = -200;
                }
                
                if (shape.rotationSpeed) {
                    shape.rotation += shape.rotationSpeed;
                }
            });
        }
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            shapes.forEach(shape => {
                switch(shape.type) {
                    case 'circle':
                        drawCircle(shape);
                        break;
                    case 'rect':
                        drawRect(shape);
                        break;
                    case 'line':
                        drawLine(shape);
                        break;
                    case 'triangle':
                        drawTriangle(shape);
                        break;
                }
            });
            
            ctx.globalAlpha = 1;
        }
        
        function animate() {
            update();
            draw();
            requestAnimationFrame(animate);
        }
        
        animate();
    }
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new CarouselPortfolio();
    
    // Mostrar hint de teclado
    const hint = document.createElement('div');
    hint.className = 'keyboard-hint';
    hint.textContent = 'Use ← → arrows to navigate';
    document.body.appendChild(hint);
});