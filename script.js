// 全局变量
let currentScene = 0;
let medalClickCount = 0;
let clickedMedals = new Set();
let pathClickCount = 0;
let isHeartRepaired = false;

// 音乐控制变量
let backgroundMusic;
let isMusicPlaying = false;
let isMuted = false;
let musicVolume = 0.3; // 默认音量30%

// 场景切换函数
function nextScene(sceneNumber) {
    console.log(`尝试切换到场景 ${sceneNumber}`);
    
    const currentSceneElement = document.querySelector('.scene.active');
    let nextSceneElement;
    
    // 特殊处理封面场景
    if (sceneNumber === 0) {
        nextSceneElement = document.getElementById('cover');
    } else {
        nextSceneElement = document.getElementById(`scene${sceneNumber}`);
    }
    
    console.log('当前场景元素:', currentSceneElement);
    console.log('下一场景元素:', nextSceneElement);
    
    if (currentSceneElement && nextSceneElement) {
        console.log('开始切换场景...');
        currentSceneElement.classList.remove('active');
        nextSceneElement.classList.add('active');
        currentScene = sceneNumber;
        
        console.log(`成功切换到场景 ${sceneNumber}`);
        
        // 根据场景执行特定动画
        switch(sceneNumber) {
            case 1:
                console.log('执行第一幕动画');
                startNumberAnimation();
                break;
            case 2:
                console.log('执行第二幕动画');
                startChatAnimation();
                break;
            case 3:
                console.log('执行第三幕动画');
                resetMedalClicks();
                break;
            case 4:
                console.log('执行第四幕动画');
                startPhotoAnimation();
                break;
            case 5:
                console.log('执行第五幕动画');
                resetPathClicks();
                break;
            case 6:
                console.log('执行第六幕动画');
                startConfessionAnimation();
                break;
        }
    } else {
        console.error('场景切换失败：找不到场景元素');
        if (!currentSceneElement) console.error('当前场景元素未找到');
        if (!nextSceneElement) console.error(`下一场景元素 scene${sceneNumber} 未找到`);
    }
}

// 开始故事
function startStory() {
    console.log('点击开始故事按钮');
    nextScene(1);
}

// 第一幕：数字跳动动画
function startNumberAnimation() {
    const numberDisplay = document.getElementById('numberDisplay');
    const continueHint = document.getElementById('continueHint1');
    const loadingHint = document.getElementById('loadingHint');
    let currentNumber = 0;
    const targetNumber = 61;
    const increment = 2;
    const speed = 30; // 毫秒
    
    // 确保元素存在
    if (!numberDisplay || !continueHint) {
        console.error('第一幕元素未找到');
        return;
    }
    
    console.log('开始数字跳动动画...');
    
    const numberInterval = setInterval(() => {
        currentNumber += increment;
        numberDisplay.textContent = currentNumber;
        
        if (currentNumber >= targetNumber) {
            clearInterval(numberInterval);
            numberDisplay.textContent = targetNumber;
            
            // 隐藏加载提示，显示继续提示
            setTimeout(() => {
                if (loadingHint) {
                    loadingHint.style.display = 'none';
                }
                
                // 确保按钮在正确位置显示
                continueHint.style.display = 'block';
                continueHint.style.cursor = 'pointer';
                
                // 使用requestAnimationFrame确保DOM更新后再添加动画类
                requestAnimationFrame(() => {
                    continueHint.classList.add('show');
                });
                
                console.log('数字跳动完成，显示继续按钮');
                
                // 添加点击事件
                continueHint.onclick = function() {
                    console.log('点击继续，进入第二幕');
                    nextScene(2);
                };
            }, 1500);
        }
    }, speed);
}

// 第二幕：聊天动画
function startChatAnimation() {
    const chatBubbles = document.querySelectorAll('.chat-bubble');
    chatBubbles.forEach((bubble, index) => {
        setTimeout(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateX(0)';
        }, index * 500);
    });
}

// 修复心形
function repairHeart() {
    if (isHeartRepaired) return;
    
    const heartPath = document.querySelector('.heart-path');
    const repairText = document.getElementById('repairText');
    const clickHint = document.querySelector('.heart-click-hint');
    
    // 隐藏点击提示
    if (clickHint) {
        clickHint.style.display = 'none';
    }
    
    // 停止破碎动画，开始修复动画
    heartPath.style.animation = 'none';
    heartPath.classList.add('healing');
    
    // 延迟添加repaired类，让颜色变化更自然
    setTimeout(() => {
        heartPath.classList.add('repaired');
    }, 1000);
    
    // 显示修复文字
    setTimeout(() => {
        repairText.style.display = 'block';
        isHeartRepaired = true;
    }, 2000);
}

// 第三幕：勋章故事
function showMedalStory(medalType) {
    // 隐藏所有其他勋章的文字
    const allTooltips = document.querySelectorAll('.medal-tooltip');
    allTooltips.forEach(tooltip => {
        tooltip.classList.remove('show');
    });
    
    // 移除所有勋章的激活状态
    const allMedals = document.querySelectorAll('.medal');
    allMedals.forEach(medal => {
        medal.classList.remove('active');
        medal.classList.remove('bandaid', 'umbrella', 'medicine');
    });
    
    // 激活当前勋章
    const currentMedal = document.querySelector(`[onclick="showMedalStory('${medalType}')"]`);
    const tooltip = document.getElementById(`${medalType}-tooltip`);
    
    if (currentMedal && tooltip) {
        currentMedal.classList.add('active');
        currentMedal.classList.add(medalType);
        tooltip.classList.add('show');
        
        // 记录已点击的勋章类型（去重）
        clickedMedals.add(medalType);
        console.log(`点击了${medalType}勋章，当前已点击的勋章:`, Array.from(clickedMedals));

        // 兼容旧计数逻辑（保留，避免回归）
        medalClickCount++;

        // 当三种都点击过时，立刻显示继续按钮
        if (clickedMedals.size >= 3) {
            const continueHint = document.getElementById('continueHint3');
            console.log('显示第三幕继续按钮，当前点击的勋章数量:', clickedMedals.size);
            console.log('继续按钮元素:', continueHint);
            if (continueHint) {
                continueHint.style.display = 'block';
                
                // 使用requestAnimationFrame确保DOM更新后再添加动画类
                requestAnimationFrame(() => {
                    continueHint.classList.add('show');
                });
                
                console.log('第三幕继续按钮已显示');
            } else {
                console.error('找不到第三幕继续按钮元素');
            }
        }
    }
}

function resetMedalClicks() {
    medalClickCount = 0;
    clickedMedals.clear();
    
    // 隐藏所有文字提示
    const tooltips = document.querySelectorAll('.medal-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.classList.remove('show');
    });
    
    // 移除所有勋章的激活状态
    const allMedals = document.querySelectorAll('.medal');
    allMedals.forEach(medal => {
        medal.classList.remove('active');
        medal.classList.remove('bandaid', 'umbrella', 'medicine');
    });
    
    const continueHint = document.getElementById('continueHint3');
    if (continueHint) {
        continueHint.style.display = 'none';
        continueHint.classList.remove('show');
    }
}

// 第四幕：照片相册
let currentPhotoIndex = 0;
const photos = [
    { src: '第四幕_1.jpg' },
    { src: '第四幕_2.jpg' },
    { src: '第四幕_3.jpg' },
    { src: '第四幕_4.jpg' }
];
let viewedPhotos = new Set();

function startPhotoAnimation() {
    // 初始化相册
    updatePhotoDisplay();
}

function updatePhotoDisplay() {
    const photoImage = document.getElementById('photoImage');
    const indicators = document.querySelectorAll('.indicator');
    
    if (photoImage) {
        // 添加淡出效果
        photoImage.style.opacity = '0';
        
        setTimeout(() => {
            // 更新图片
            photoImage.src = photos[currentPhotoIndex].src;
            
            // 添加淡入效果
            photoImage.style.opacity = '1';
        }, 200);
    }
    
    // 更新指示器
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentPhotoIndex);
    });
    
    // 记录已查看的照片
    viewedPhotos.add(currentPhotoIndex);
    
    // 检查是否所有照片都看过了
    if (viewedPhotos.size >= photos.length) {
        setTimeout(() => {
            const galleryContinue = document.getElementById('galleryContinue');
            if (galleryContinue) {
                galleryContinue.style.display = 'block';
            }
        }, 1000);
    }
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updatePhotoDisplay();
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updatePhotoDisplay();
}

function goToPhoto(index) {
    if (index >= 0 && index < photos.length) {
        currentPhotoIndex = index;
        updatePhotoDisplay();
    }
}

// 第五幕：路径故事
function showPathStory(stage) {
    const storyText = document.getElementById('storyText');
    const finalMessage = document.getElementById('finalMessage');
    const pathLine = document.querySelector('.path-line');
    const meCharacter = document.getElementById('meCharacter');
    const herCharacter = document.getElementById('herCharacter');
    
    let story = '';
    let characterPosition = '';
    
    switch(stage) {
        case 'initial':
            story = '坦白说，以前我对小鞠并不感冒，觉得那是另一个世界的故事。';
            characterPosition = '5%';
            break;
        case 'later':
            story = '但因为总听你提起，看你分享，我慢慢开始听她的歌，看她的舞台。我发现，她的努力和优秀，确实闪闪发光。';
            characterPosition = '50%';
            pathLine.classList.add('active');
            break;
        case 'now':
            story = '现在，我不仅欣赏她，更感谢她。因为她的存在，让我看到了更多你开心的、着迷的样子。爱屋及乌，原来这么自然。';
            characterPosition = '95%';
            pathLine.classList.add('active');
            break;
    }
    
    storyText.textContent = story;
    meCharacter.style.left = characterPosition;
    
    pathClickCount++;
    
    if (pathClickCount >= 3) {
        setTimeout(() => {
            finalMessage.style.display = 'block';
        }, 2000);
    }
}

function resetPathClicks() {
    pathClickCount = 0;
    const pathLine = document.querySelector('.path-line');
    const meCharacter = document.getElementById('meCharacter');
    const finalMessage = document.getElementById('finalMessage');
    
    pathLine.classList.remove('active');
    meCharacter.style.left = '5%';
    finalMessage.style.display = 'none';
}

// 第六幕：告白动画
function startConfessionAnimation() {
    const confessionLines = document.querySelectorAll('.confession-line');
    confessionLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, 500 + (index * 500));
    });
    
    // 显示礼物盒
    setTimeout(() => {
        const giftBox = document.getElementById('giftBox');
        giftBox.style.display = 'block';
    }, 5000);
}

// 打开礼物
function openGift() {
    const giftEmoji = document.querySelector('.gift-emoji');
    const giftMessage = document.getElementById('giftMessage');
    
    console.log('点击礼物盒，开始打开动画');
    
    if (giftEmoji) {
        // 添加打开动画效果
        giftEmoji.style.animation = 'none';
        giftEmoji.style.transform = 'scale(1.2) rotate(-15deg) translateY(-20px)';
        giftEmoji.style.transition = 'all 0.8s ease-out';
        
        // 添加闪烁效果
        giftEmoji.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1.2)';
    }
    
    setTimeout(() => {
        if (giftMessage) {
            giftMessage.style.display = 'block';
            giftMessage.style.animation = 'fadeInUp 1s ease-out';
            console.log('显示惊喜消息');
            
            // 显示消息后，让礼物盒回正
            setTimeout(() => {
                if (giftEmoji) {
                    giftEmoji.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
                    giftEmoji.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))';
                    giftEmoji.style.transition = 'all 0.6s ease-out';
                    console.log('礼物盒已回正');
                }
            }, 500);
        } else {
            console.error('找不到惊喜消息元素');
        }
    }, 800);
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 初始化音乐
    initMusic();
    
    // 为第四幕的照片添加点击事件
    const photos = document.querySelectorAll('.polaroid-photo');
    photos.forEach(photo => {
        photo.addEventListener('click', () => nextScene(5));
    });
    
    // 确保只有封面场景是激活状态
    const coverScene = document.getElementById('cover');
    const otherScenes = document.querySelectorAll('.scene:not(#cover)');
    
    if (coverScene) {
        coverScene.classList.add('active');
        console.log('封面场景已激活');
    }
    
    otherScenes.forEach(scene => {
        scene.classList.remove('active');
    });
    
    console.log('其他场景已隐藏');
    
    console.log('初始化完成，当前场景:', currentScene);
});

// 添加键盘导航支持
document.addEventListener('keydown', function(event) {
    if (currentScene === 4) {
        // 第四幕：相册导航
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextPhoto();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevPhoto();
        }
    } else {
        // 其他场景：场景切换
        if (event.key === 'ArrowRight' || event.key === ' ') {
            event.preventDefault();
            if (currentScene < 6) {
                nextScene(currentScene + 1);
            }
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            if (currentScene > 1) {
                nextScene(currentScene - 1);
            }
        }
    }
});

// 添加触摸支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动，下一幕
            if (currentScene < 6) {
                nextScene(currentScene + 1);
            }
        } else {
            // 向右滑动，上一幕
            if (currentScene > 1) {
                nextScene(currentScene - 1);
            }
        }
    }
}

// 音乐控制函数
function initMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        backgroundMusic.volume = musicVolume;
        console.log('音乐初始化完成');
    }
}

function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        document.getElementById('musicToggle').classList.remove('playing');
        console.log('音乐已暂停');
    } else {
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            document.getElementById('musicToggle').classList.add('playing');
            console.log('音乐已开始播放');
        }).catch(error => {
            console.error('音乐播放失败:', error);
            // 如果自动播放被阻止，显示提示
            showMusicPermissionPrompt();
        });
    }
}

function toggleMute() {
    if (!backgroundMusic) return;
    
    isMuted = !isMuted;
    const volumeBtn = document.getElementById('musicVolume');
    
    if (isMuted) {
        backgroundMusic.volume = 0;
        volumeBtn.classList.add('muted');
        volumeBtn.querySelector('.volume-icon').textContent = '🔇';
    } else {
        backgroundMusic.volume = musicVolume;
        volumeBtn.classList.remove('muted');
        volumeBtn.querySelector('.volume-icon').textContent = '🔊';
    }
    
    console.log(`音乐${isMuted ? '已静音' : '已取消静音'}`);
}

function showMusicPermissionPrompt() {
    // 可以添加一个提示用户点击播放音乐的对话框
    const prompt = document.createElement('div');
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    prompt.innerHTML = `
        <p>🎵 点击右上角的音乐按钮开始播放背景音乐</p>
        <button onclick="this.parentElement.remove()" style="
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            margin-top: 10px;
            cursor: pointer;
        ">知道了</button>
    `;
    document.body.appendChild(prompt);
    
    // 5秒后自动消失
    setTimeout(() => {
        if (prompt.parentElement) {
            prompt.remove();
        }
    }, 5000);
}

// 添加粒子效果（可选）
function createParticles() {
    const scene = document.querySelector('.scene.active');
    if (!scene) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        scene.appendChild(particle);
    }
}

// 添加粒子动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
`;
document.head.appendChild(style);
