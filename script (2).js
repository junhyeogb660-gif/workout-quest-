const routineData = [
    {
        id: "chest_triceps",
        dayTag: "가슴 & 삼두 공략 날 🦍",
        color: "#ef4444",
        missions: [
            "체스트 프레스 머신 (12회씩 3세트)",
            "덤벨 벤치 프레스 (12회씩 3세트)",
            "케이블 크로스 오버 (15회씩 3세트)",
            "케이블 푸시 다운 (12회씩 3세트)",
            "덤벨 라잉 트라이셉스 익스텐션 (12회씩 3세트)",
            "인클라인 덤벨 프레스 (12회씩 3세트)"
        ]
    },
    {
        id: "back_biceps",
        dayTag: "등 & 이두 공략 날 🦅",
        color: "#10b981",
        missions: [
            "랫 풀 다운 머신 (12회씩 3세트)",
            "시티드 로우 머신 (12회씩 3세트)",
            "원 암 덤벨 로우 (부위별 12회씩 3세트)",
            "바벨 로우 (12회씩 3세트)",
            "덤벨 바이셉스 컬 (12회씩 3세트)",
            "해머 컬 (전완 및 이두 외측 12회씩 3세트)"
        ]
    },
    {
        id: "shoulders",
        dayTag: "어깨 파괴 날 (델토이드) 🛡️",
        color: "#f59e0b",
        missions: [
            "숄더 프레스 머신 (12회씩 3세트)",
            "사이드 레터럴 레이즈 (측면 집중 20회씩 4세트)",
            "덤벨 숄더 프레스 (12회씩 3세트)",
            "리어 델트 후면 머신 (15회씩 3세트)",
            "프론트 덤벨 레이즈 (전면 12회씩 3세트)",
            "바벨 슈러그 (승모근 타겟 12회씩 3세트)"
        ]
    },
    {
        id: "legs",
        dayTag: "하체 지옥 날 (레그 데이) 🦵",
        color: "#8b5cf6",
        missions: [
            "레그 프레스 머신 (12회씩 4세트)",
            "레그 익스텐션 머신 (앞허벅지 12회씩 3세트)",
            "레그 컬 머신 (뒷허벅지 12회씩 3세트)",
            "맨몸 또는 고블릿 스쿼트 (천천히 15회씩 3세트)",
            "덤벨 런지 (다리당 10회씩 3세트)",
            "맨몸 카프 레이즈 (종아리 집중 20회씩 3세트)"
        ]
    }
];

const cardioMissions = [
    "🏃‍♂️ 마무리 유산소: 러닝머신(트레드밀) 속도 6.0으로 15분간 가볍게 타기",
    "🧗‍♂️ 마무리 유산소: 천국의 계단(스텝밀) 레벨 5로 10분간 오르기",
    "🚴‍♂️ 마무리 유산소: 실내 사이클 저항을 높여 15분간 속도 유지하며 타기"
];

const dayIndicator = document.getElementById('day-indicator');
const missionText = document.getElementById('mission-text');
const nextBtn = document.getElementById('next-btn');
const completeBtn = document.getElementById('complete-btn');
const countNumber = document.getElementById('count-number');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const badgeText = document.getElementById('badge-text');

let totalMissions = 0;
const targetMissions = 6;
let selectedRoutine = null;
let currentMissionIndex = 0;
let isCardioPhase = false;
let savedCardioMission = "";

let timerInterval = null;
const REST_TIME = 60;
let timeRemaining = REST_TIME;
let isResting = false;


function playSoundEffect(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        switch (type) {
            case 'select':
                {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
                    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.08);
                }
                break;

            case 'next':
                {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                    osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.1);
                    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                }
                break;

            case 'complete':
                {
                    const now = audioCtx.currentTime;
                    const osc1 = audioCtx.createOscillator();
                    const gain1 = audioCtx.createGain();
                    osc1.connect(gain1); gain1.connect(audioCtx.destination);
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(659.25, now);
                    gain1.gain.setValueAtTime(0.07, now);
                    gain1.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);
                    osc1.start(); osc1.stop(now + 0.15);

                    setTimeout(() => {
                        const osc2 = audioCtx.createOscillator();
                        const gain2 = audioCtx.createGain();
                        osc2.connect(gain2); gain2.connect(audioCtx.destination);
                        osc2.type = 'sine';
                        osc2.frequency.setValueAtTime(830.61, audioCtx.currentTime);
                        gain2.gain.setValueAtTime(0.07, audioCtx.currentTime);
                        gain2.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.25);
                        osc2.start(); osc2.stop(audioCtx.currentTime + 0.25);
                    }, 80);
                }
                break;

            case 'restEnd':
                {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
                    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.35);
                    osc.start(); osc.stop(audioCtx.currentTime + 0.35);
                }
                break;

            case 'victory':
                {
                    const now = audioCtx.currentTime;
                    const notes = [523.25, 587.33, 659.25, 783.99, 1046.50];
                    const durations = [0.1, 0.1, 0.1, 0.1, 0.4];
                    let timeAccumulator = 0;

                    notes.forEach((freq, idx) => {
                        setTimeout(() => {
                            const osc = audioCtx.createOscillator();
                            const gain = audioCtx.createGain();
                            osc.connect(gain); gain.connect(audioCtx.destination);
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + durations[idx]);
                            osc.start(); osc.stop(audioCtx.currentTime + durations[idx]);
                        }, timeAccumulator * 1000);
                        timeAccumulator += 0.09;
                    });
                }
                break;
        }
    } catch (e) {
        console.log("오디오 플레이어 접근 브라우저 제한 우회 제어");
    }
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderStreakBoard();
});

function saveProgress() {
    const dataToSave = {
        routineId: selectedRoutine ? selectedRoutine.id : null,
        currentMissionIndex: currentMissionIndex,
        totalMissions: totalMissions,
        isCardioPhase: isCardioPhase,
        savedCardioMission: savedCardioMission
    };
    localStorage.setItem('healthQuestProgress', JSON.stringify(dataToSave));
}

function loadProgress() {
    const savedData = localStorage.getItem('healthQuestProgress');
    if (!savedData) return;

    const parsed = JSON.parse(savedData);
    if (!parsed.routineId) return;

    const routineIndex = routineData.findIndex(r => r.id === parsed.routineId);
    if (routineIndex === -1) return;

    selectedRoutine = routineData[routineIndex];
    currentMissionIndex = parsed.currentMissionIndex;
    totalMissions = parsed.totalMissions;
    isCardioPhase = parsed.isCardioPhase;
    savedCardioMission = parsed.savedCardioMission || "";

    nextBtn.disabled = false;
    completeBtn.disabled = false;

    const buttons = document.querySelectorAll('.routine-selector .selector-btn');
    buttons.forEach((btn, idx) => {
        if (idx === routineIndex) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    dayIndicator.textContent = selectedRoutine.dayTag;
    dayIndicator.style.backgroundColor = selectedRoutine.color;
    dayIndicator.style.color = "#ffffff";

    countNumber.textContent = totalMissions;
    const progressPercent = Math.min((totalMissions / targetMissions) * 100, 100);
    progressBarFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${Math.min(totalMissions, targetMissions)} / ${targetMissions} 종목`;

    updateBadge();

    if (isCardioPhase) {
        if (totalMissions > targetMissions) {
            missionText.textContent = "🏅 마무리 유산소 퀘스트까지 완벽 돌파! 오늘 계획한 모든 운동을 정복했습니다. 고생하셨습니다!";
            completeBtn.disabled = true;
            nextBtn.disabled = true;
        } else {
            missionText.textContent = `🎉 근력 운동 6종목 클리어! 체지방 연소를 위한 고정 마무리 유산소 퀘스트가 활성화되었습니다.\n\n${savedCardioMission}`;
            completeBtn.textContent = "유산소 완료 및 오운완! 🏁";
            nextBtn.disabled = true;
        }
    } else {
        화면운동갱신();
    }
}

function updateBadge() {
    if (isCardioPhase && totalMissions > targetMissions) {
        badgeText.textContent = "진정한 헬창 💀";
        badgeText.style.color = "#090d16";
        badgeText.style.backgroundColor = "#ccff00";
    } else if (totalMissions >= 6) {
        badgeText.textContent = "근손실 방지 완료 💪";
        badgeText.style.color = "#38bdf8";
        badgeText.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
    } else if (totalMissions >= 3) {
        badgeText.textContent = "중량 가보자고 🔥";
        badgeText.style.color = "#f59e0b";
        badgeText.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
    } else {
        badgeText.textContent = "헬린이 탈출 시급 🐣";
        badgeText.style.color = "#ccff00";
        badgeText.style.backgroundColor = "rgba(204, 255, 0, 0.07)";
    }
}

function 부위선택(index) {
    resetTimer();
    playSoundEffect('select');
    selectedRoutine = routineData[index];
    currentMissionIndex = 0;
    totalMissions = 0;
    isCardioPhase = false;
    savedCardioMission = "";

    countNumber.textContent = totalMissions;
    progressBarFill.style.width = "0%";
    progressText.textContent = `0 / ${targetMissions} 종목`;
    completeBtn.textContent = "현재 종목 완료 ✔️";

    dayIndicator.textContent = selectedRoutine.dayTag;
    dayIndicator.style.backgroundColor = selectedRoutine.color;
    dayIndicator.style.color = "#ffffff";

    const buttons = document.querySelectorAll('.routine-selector .selector-btn');
    buttons.forEach((btn, idx) => {
        if (idx === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    nextBtn.disabled = false;
    completeBtn.disabled = false;

    updateBadge();
    화면운동갱신();
    saveProgress();
}

function 화면운동갱신() {
    if (!selectedRoutine) return;
    const 현재운동 = selectedRoutine.missions[currentMissionIndex];
    missionText.textContent = `▶ 현재 종목: ${현재운동}`;
}

function startRestTimer() {
    isResting = true;
    timeRemaining = REST_TIME;

    nextBtn.disabled = false;
    nextBtn.textContent = "휴식 건너뛰기 ⚡";
    completeBtn.disabled = true;

    missionText.innerHTML = `⏳ <span class="timer-highlight">세트 간 휴식 중: ${timeRemaining}초</span><br><br><span class="timer-subtext">지친 근섬유가 회복되고 있습니다. 다음 퀘스트를 준비하세요!</span>`;

    timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
            endRestTimer();
        } else {
            missionText.innerHTML = `⏳ <span class="timer-highlight">세트 간 휴식 중: ${timeRemaining}초</span><br><br><span class="timer-subtext">지친 근섬유가 회복되고 있습니다. 다음 퀘스트를 준비하세요!</span>`;
        }
    }, 1000);
}

function endRestTimer() {
    clearInterval(timerInterval);
    isResting = false;
    playSoundEffect('restEnd');

    nextBtn.textContent = "다음 종목으로 넘기기 ➡️";
    completeBtn.disabled = false;
    nextBtn.disabled = false;

    화면운동갱신();
    saveProgress();
}

function resetTimer() {
    clearInterval(timerInterval);
    isResting = false;
    nextBtn.textContent = "다음 종목으로 넘기기 ➡️";
}

function saveStreakDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${date}`;

    let currentStreaks = JSON.parse(localStorage.getItem('healthQuestStreak')) || [];

    if (!currentStreaks.includes(dateString)) {
        currentStreaks.push(dateString);
        localStorage.setItem('healthQuestStreak', JSON.stringify(currentStreaks));
    }
    renderStreakBoard();
}

function renderStreakBoard() {
    const currentStreaks = JSON.parse(localStorage.getItem('healthQuestStreak')) || [];
    const today = new Date();
    const currentDayOfWeek = today.getDay();

    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() + distanceToMonday);
    mondayOfThisWeek.setHours(0, 0, 0, 0);

    const dayElements = document.querySelectorAll('.streak-board .streak-day');

    dayElements.forEach(el => {
        const targetDayNum = parseInt(el.getAttribute('data-day'));
        const targetDate = new Date(mondayOfThisWeek);
        const dayOffset = targetDayNum === 0 ? 6 : targetDayNum - 1;
        targetDate.setDate(mondayOfThisWeek.getDate() + dayOffset);

        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, '0');
        const d = String(targetDate.getDate()).padStart(2, '0');
        const targetDateStr = `${y}-${m}-${d}`;

        const dotElement = el.querySelector('.dot');

        if (currentStreaks.includes(targetDateStr)) {
            el.classList.add('completed');
            if (dotElement) dotElement.textContent = "✔";
        } else {
            el.classList.remove('completed');
            if (dotElement) dotElement.textContent = "";
        }
    });
}

nextBtn.addEventListener('click', () => {
    if (!selectedRoutine) return;
    if (isResting) { endRestTimer(); return; }
    if (isCardioPhase) return;

    playSoundEffect('next');
    currentMissionIndex = (currentMissionIndex + 1) % selectedRoutine.missions.length;
    화면운동갱신();

    missionText.style.opacity = 0.5;
    setTimeout(() => { missionText.style.opacity = 1; }, 60);
    saveProgress();
});

completeBtn.addEventListener('click', () => {
    if (!selectedRoutine) return;

    if (isCardioPhase) {
        totalMissions++;
        missionText.textContent = "🏅 마무리 유산소 퀘스트까지 완벽 돌파! 오늘 계획한 모든 운동을 정복했습니다. 고생하셨습니다!";
        completeBtn.disabled = true;
        nextBtn.disabled = true;

        updateBadge();
        triggerConfetti();
        playSoundEffect('victory');
        saveStreakDate();
        saveProgress();
        return;
    }

    totalMissions++;
    countNumber.textContent = totalMissions;

    const progressPercent = Math.min((totalMissions / targetMissions) * 100, 100);
    progressBarFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${Math.min(totalMissions, targetMissions)} / ${targetMissions} 종목`;

    updateBadge();

    if (totalMissions >= targetMissions) {
        if (selectedRoutine.id === "legs") {
            totalMissions++;
            missionText.textContent = "🎉 하체 6종목 완전 정복! 오늘 배정된 고강도 하체 루틴을 완수했습니다. 안전한 근성장을 위해 얼른 단백질을 섭취하고 휴식하세요!";
            completeBtn.disabled = true;
            nextBtn.disabled = true;
            updateBadge();
            triggerConfetti();
            playSoundEffect('victory');
            saveStreakDate();
        } else {
            isCardioPhase = true;
            playSoundEffect('complete');
            savedCardioMission = cardioMissions[Math.floor(Math.random() * cardioMissions.length)];
            missionText.textContent = `🎉 근력 운동 6종목 클리어! 체지방 연소를 위한 고정 마무리 유산소 퀘스트가 활성화되었습니다.\n\n${savedCardioMission}`;

            completeBtn.textContent = "유산소 완료 및 오운완! 🏁";
            nextBtn.disabled = true;
        }
        saveProgress();
    } else {
        playSoundEffect('complete');
        currentMissionIndex = (currentMissionIndex + 1) % selectedRoutine.missions.length;
        startRestTimer();
    }
});

function 리셋초기화() {
    if (confirm("오늘의 운동 진행 상황과 저장된 기록을 모두 초기화하고 새로 시작하시겠습니까? 🔥\n(주의: 주간 오운완 스트릭 달성 내역은 유지됩니다)")) {
        localStorage.removeItem('healthQuestProgress');
        if (timerInterval) clearInterval(timerInterval);
        location.reload();
    }
}
