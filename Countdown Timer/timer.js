class CountdownTimer {
    constructor() {
        this.container = document.querySelector('.timer-container');
        this.FIXED_TIME = parseInt(this.container.dataset.timerDuration) || 20;
        this.timeLeft = this.FIXED_TIME;
        this.timerId = null;
        this.display = document.getElementById('timer');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.progressBar = document.getElementById('progressBar');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && document.fullscreenElement) {
                document.exitFullscreen();
            }
        });
    }

    updateDisplay(time) {
        let displayText;
        
        if (time >= 3600) { // 超过1小时
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;
            displayText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            // 当显示小时时，增加字体大小类
            this.timeDisplay.classList.add('show-hours');
        } else {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.timeDisplay.classList.remove('show-hours');
        }
        
        this.timeDisplay.textContent = displayText;
        
        const progress = (this.FIXED_TIME - time) / this.FIXED_TIME;
        this.progressBar.style.transform = `translateX(${-100 * (1 - progress)}%)`;
        
        if (time <= 0) {
            this.timeDisplay.classList.add('time-up');
            this.progressBar.style.transform = 'translateX(0)';
        } else {
            this.timeDisplay.classList.remove('time-up');
        }
    }

    setTimer() {
        this.stopTimer();
        this.timeLeft = this.FIXED_TIME;
        this.timeDisplay.classList.remove('time-up');
        this.updateDisplay(this.timeLeft);
    }

    startTimer() {
        if (this.timerId === null && this.timeLeft > 0) {
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay(this.timeLeft);
                if (this.timeLeft <= 0) this.stopTimer();
            }, 1000);
        }
    }

    stopTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    toggleMirrorH() {
        this.timeDisplay.classList.toggle('mirror-h');
    }

    toggleMirrorV() {
        this.timeDisplay.classList.toggle('mirror-v');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.display.requestFullscreen().catch(err => {
                console.log(`Error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// 初始化定时器
window.onload = () => {
    const timer = new CountdownTimer();
    timer.setTimer();

    // 绑定按钮事件
    window.setTimer = () => timer.setTimer();
    window.startTimer = () => timer.startTimer();
    window.stopTimer = () => timer.stopTimer();
    window.toggleMirrorH = () => timer.toggleMirrorH();
    window.toggleMirrorV = () => timer.toggleMirrorV();
    window.toggleFullscreen = () => timer.toggleFullscreen();
}; 