window.addEventListener("DOMContentLoaded", () => {
    if (!window.gsap || !window.ScrollTrigger || !window.Lenis) {
        document.body.classList.remove("is-loading");
        document.getElementById("preloader")?.remove();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    function initMicroInteractions() {
        if (!window.matchMedia("(pointer: fine)").matches) {
            return;
        }

        const cursorDot = document.getElementById("cursor-dot");
        const cursorFrame = document.getElementById("cursor-frame");
        if (!cursorDot || !cursorFrame) {
            return;
        }

        document.body.classList.add("has-custom-cursor");
        gsap.set([cursorDot, cursorFrame], { xPercent: -50, yPercent: -50 });

        const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.12, ease: "power3.out" });
        const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.12, ease: "power3.out" });
        const frameX = gsap.quickTo(cursorFrame, "x", { duration: 0.38, ease: "power3.out" });
        const frameY = gsap.quickTo(cursorFrame, "y", { duration: 0.38, ease: "power3.out" });

        window.addEventListener("mousemove", (event) => {
            dotX(event.clientX);
            dotY(event.clientY);
            frameX(event.clientX);
            frameY(event.clientY);
        });

        const magneticTargets = gsap.utils.toArray(
            ".callout-engine, .callout-wheels, .engine-hud .glass-panel, .hud-left .glass-panel, .chassis-note .glass-panel"
        );

        magneticTargets.forEach((target) => {
            target.style.transformStyle = "preserve-3d";
            target.style.willChange = "transform";

            target.addEventListener("mouseenter", () => {
                gsap.to(cursorFrame, {
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    borderColor: "rgba(213, 0, 0, 0.76)",
                    duration: 0.22,
                    ease: "power3.out"
                });
                gsap.to(cursorDot, {
                    scale: 0.75,
                    duration: 0.22,
                    ease: "power3.out"
                });
            });

            target.addEventListener("mousemove", (event) => {
                const rect = target.getBoundingClientRect();
                const relativeX = event.clientX - rect.left - rect.width / 2;
                const relativeY = event.clientY - rect.top - rect.height / 2;

                gsap.to(target, {
                    x: relativeX * 0.08,
                    y: relativeY * 0.08,
                    rotateX: gsap.utils.clamp(-5, 5, -relativeY / 22),
                    rotateY: gsap.utils.clamp(-5, 5, relativeX / 22),
                    duration: 0.32,
                    ease: "power3.out",
                    overwrite: true
                });
            });

            target.addEventListener("mouseleave", () => {
                gsap.to(target, {
                    x: 0,
                    y: 0,
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                    overwrite: true
                });
                gsap.to(cursorFrame, {
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    borderColor: "rgba(255, 255, 255, 0.32)",
                    duration: 0.24,
                    ease: "power3.out"
                });
                gsap.to(cursorDot, {
                    scale: 1,
                    duration: 0.24,
                    ease: "power3.out"
                });
            });
        });
    }

    initMicroInteractions();

    const lenis = new Lenis({
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.1
    });
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const preloader = document.getElementById("preloader");
    const preloaderPercent = document.getElementById("preloader-percent");
    const canvas = document.getElementById("car-sequence");
    const context = canvas.getContext("2d");
    const frameCount = 240;
    const sequence = { frame: 0 };
    const images = [];
    const framePath = (index) => `IMG/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;
    const minimumPreloaderTime = new Promise((resolve) => window.setTimeout(resolve, 1800));
    const soundToggle = document.getElementById("sound-toggle");
    const soundIcon = document.getElementById("sound-icon");
    const soundLabel = document.getElementById("sound-label");
    let audioContext;
    let soundEnabled = false;
    let explodedCueArmed = true;
    let lastRenderedFrame = -1;
    let loadedFrames = 0;

    function getAudioContext() {
        if (!audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                return null;
            }
            audioContext = new AudioContextClass();
        }
        return audioContext;
    }

    function playExplodedCue() {
        if (!soundEnabled) {
            return;
        }

        const ctx = getAudioContext();
        if (!ctx) {
            return;
        }

        const start = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, start);
        master.gain.exponentialRampToValueAtTime(0.18, start + 0.03);
        master.gain.exponentialRampToValueAtTime(0.0001, start + 0.85);
        master.connect(ctx.destination);

        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();
        click.type = "triangle";
        click.frequency.setValueAtTime(420, start);
        click.frequency.exponentialRampToValueAtTime(96, start + 0.12);
        clickGain.gain.setValueAtTime(0.0001, start);
        clickGain.gain.exponentialRampToValueAtTime(0.16, start + 0.01);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        click.connect(clickGain).connect(master);
        click.start(start);
        click.stop(start + 0.18);

        const hum = ctx.createOscillator();
        const humGain = ctx.createGain();
        hum.type = "sine";
        hum.frequency.setValueAtTime(48, start);
        hum.frequency.exponentialRampToValueAtTime(34, start + 0.72);
        humGain.gain.setValueAtTime(0.0001, start);
        humGain.gain.exponentialRampToValueAtTime(0.12, start + 0.08);
        humGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.78);
        hum.connect(humGain).connect(master);
        hum.start(start);
        hum.stop(start + 0.82);

        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.55, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let index = 0; index < noiseData.length; index += 1) {
            noiseData[index] = (Math.random() * 2 - 1) * (1 - index / noiseData.length);
        }

        const swoosh = ctx.createBufferSource();
        const swooshFilter = ctx.createBiquadFilter();
        const swooshGain = ctx.createGain();
        swoosh.buffer = noiseBuffer;
        swooshFilter.type = "bandpass";
        swooshFilter.frequency.setValueAtTime(1200, start + 0.05);
        swooshFilter.frequency.exponentialRampToValueAtTime(280, start + 0.5);
        swooshFilter.Q.setValueAtTime(0.8, start);
        swooshGain.gain.setValueAtTime(0.0001, start + 0.05);
        swooshGain.gain.exponentialRampToValueAtTime(0.065, start + 0.14);
        swooshGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.58);
        swoosh.connect(swooshFilter).connect(swooshGain).connect(master);
        swoosh.start(start + 0.04);
        swoosh.stop(start + 0.62);
    }

    function updateSoundButton() {
        if (!soundToggle) {
            return;
        }
        soundToggle.setAttribute("aria-pressed", String(soundEnabled));
        if (soundIcon) {
            soundIcon.textContent = soundEnabled ? "volume_up" : "volume_off";
        }
        if (soundLabel) {
            soundLabel.textContent = soundEnabled ? "Sound On" : "Enable Sound";
        }
    }

    soundToggle?.addEventListener("click", async () => {
        const ctx = getAudioContext();
        if (!ctx) {
            return;
        }

        if (ctx.state === "suspended") {
            await ctx.resume();
        }

        soundEnabled = !soundEnabled;
        updateSoundButton();
    });

    updateSoundButton();

    function updatePreloader() {
        const progress = Math.round((loadedFrames / frameCount) * 100);
        const display = String(progress).padStart(3, "0");
        if (preloader) {
            preloader.style.setProperty("--loader-progress", `${progress}%`);
        }
        if (preloaderPercent) {
            preloaderPercent.textContent = `${display}%`;
        }
    }

    const windowLoaded = new Promise((resolve) => {
        if (document.readyState === "complete") {
            resolve();
            return;
        }
        window.addEventListener("load", resolve, { once: true });
    });

    function drawCover(image) {
        const canvasRatio = canvas.width / canvas.height;
        const imageRatio = image.width / image.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imageRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imageRatio;
            offsetX = (canvas.width - drawWidth) / 2;
        } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imageRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    }

    function render() {
        const frame = Math.min(frameCount - 1, Math.max(0, Math.round(sequence.frame)));
        const image = images[frame];
        if (!image || !image.complete || frame === lastRenderedFrame) {
            return;
        }

        drawCover(image);
        lastRenderedFrame = frame;

        if (frame >= frameCount - 8 && explodedCueArmed) {
            explodedCueArmed = false;
            playExplodedCue();
        }

        if (frame < frameCount - 40) {
            explodedCueArmed = true;
        }
    }

    updatePreloader();
    const imageCacheReady = [];

    for (let index = 0; index < frameCount; index += 1) {
        const image = new Image();
        const imageReady = new Promise((resolve) => {
            image.onload = () => {
                loadedFrames += 1;
                updatePreloader();
                if (index === 0) {
                    render();
                }
                resolve();
            };
            image.onerror = () => {
                loadedFrames += 1;
                updatePreloader();
                resolve();
            };
        });
        image.src = framePath(index);
        images.push(image);
        imageCacheReady.push(imageReady);
    }

    const heroTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            trigger: ".exploded-scroll",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true
        }
    });

    heroTimeline
        .to(sequence, {
            frame: frameCount - 1,
            snap: "frame",
            onUpdate: render
        }, 0)
        .fromTo("#car-sequence", {
            "--depth-shadow-x": "0px",
            "--depth-shadow-y": "10px",
            "--depth-shadow-blur": "12px",
            "--depth-shadow-opacity": 0.34,
            "--ambient-shadow-blur": "18px",
            "--ambient-shadow-opacity": 0.18
        }, {
            "--depth-shadow-x": "-18px",
            "--depth-shadow-y": "44px",
            "--depth-shadow-blur": "54px",
            "--depth-shadow-opacity": 0.14,
            "--ambient-shadow-blur": "64px",
            "--ambient-shadow-opacity": 0.08,
            duration: 1
        }, 0)
        .fromTo(".sequence-card", {
            "--panel-shadow-y": "12px",
            "--panel-shadow-blur": "28px",
            "--panel-shadow-opacity": 0.34,
            "--panel-red-opacity": 0.04,
            autoAlpha: 0,
            x: 240,
            y: 70,
            scale: 0.64,
            rotateX: 10,
            rotateY: -38,
            rotateZ: 3,
            filter: "brightness(0.48) saturate(0.78) blur(8px)"
        }, {
            "--panel-shadow-y": "34px",
            "--panel-shadow-blur": "86px",
            "--panel-shadow-opacity": 0.5,
            "--panel-red-opacity": 0.14,
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: -8,
            rotateZ: 0,
            filter: "brightness(1.04) saturate(1.12) blur(0px)",
            duration: 0.28,
            ease: "power3.out"
        }, 0.12)
        .to(".sequence-card", {
            "--panel-shadow-y": "48px",
            "--panel-shadow-blur": "110px",
            "--panel-shadow-opacity": 0.38,
            "--panel-red-opacity": 0.09,
            y: -24,
            rotateY: 7,
            rotateX: -2,
            duration: 0.56,
            ease: "none"
        }, 0.4)
        .fromTo(".hud-left .glass-panel", {
            x: -38,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            stagger: 0.07,
            duration: 0.25
        }, 0.05)
        .fromTo(".chassis-note", {
            y: 70,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.26
        }, 0.16)
        .fromTo(".callout-engine", {
            x: 120,
            y: -30,
            opacity: 0
        }, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.2
        }, 0.42)
        .fromTo(".engine-hud", {
            x: -72,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.24,
            ease: "power3.out"
        }, 0.5)
        .fromTo(".callout-wheels", {
            x: -140,
            y: 35,
            opacity: 0
        }, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.2
        }, 0.62)
        .fromTo(".bg-911", {
            y: 90,
            opacity: 0.55
        }, {
            y: -90,
            opacity: 1,
            duration: 1
        }, 0)
        .fromTo(".scroll-meter", {
            scaleY: 0.2
        }, {
            scaleY: 1,
            duration: 1
        }, 0);

    gsap.from(".grid .glass-panel", {
        scrollTrigger: {
            trigger: ".grid",
            start: "top 78%",
            toggleActions: "play none none reverse"
        },
        y: 42,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08
    });

    window.addEventListener("resize", () => {
        lastRenderedFrame = -1;
        render();
        ScrollTrigger.refresh();
    });

    function unlockExperience() {
        preloader?.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        lenis.start();
    }

    Promise.all([windowLoaded, Promise.all(imageCacheReady), minimumPreloaderTime]).then(() => {
        loadedFrames = frameCount;
        updatePreloader();
        lastRenderedFrame = -1;
        render();
        ScrollTrigger.refresh();

        if (!preloader) {
            unlockExperience();
            return;
        }

        gsap.to(preloader, {
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.inOut",
            onComplete: unlockExperience
        });
    });
});
