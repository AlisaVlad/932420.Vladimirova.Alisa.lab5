document.addEventListener('DOMContentLoaded', () => {

    const trackerBtn = document.getElementById('start-tracker-btn');

    if (trackerBtn) {
        trackerBtn.addEventListener('click', function () {
            const userName = prompt("Введите ваше имя:");
            alert(`Привет, ${userName || 'Эко-активист'}! Добро пожаловать в трекер потребления воды.`);

            const waterConsumption = [3.2, 1.2, 4.0, 1.5, 2.8, 1.1, 3.5];

            function findMax(arr) {
                return Math.max(...arr);
            }

            function filterHighConsumption(arr) {
                return arr.filter(days => days > 3);
            }

            function calculateSum(arr) {
                return arr.reduce((total, current) => total + current, 0);
            }

            let lowConsumptionDaysCount = 0;
            for (let i = 0; i < waterConsumption.length; i++) {
                if (waterConsumption[i] <= 1.5) {
                    lowConsumptionDaysCount++;
                }
            }

            const lowConsumptionPercentage = (lowConsumptionDaysCount / waterConsumption.length) * 100;
            const totalWater = calculateSum(waterConsumption);
            const averageWater = totalWater / waterConsumption.length;
            const exceededDaysCount = filterHighConsumption(waterConsumption).length;

            alert(`За неделю вы выпили ${totalWater.toFixed(1)} литров воды, в ${exceededDaysCount} днях норма была превышена.`);

            console.log(`Процент дней с низким потреблением: ${lowConsumptionPercentage.toFixed(1)}%`);
            console.log(`Количество дней с низким потреблением: ${lowConsumptionDaysCount}`);

            if (averageWater < 2) {
                console.log("Рекомендуется увеличить потребление воды до 2–2,5 литров в день.");
            }
        });
    }

    const habitsContainer = document.getElementById('habits-container');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const newHabitInput = document.getElementById('new-habit-input');
    const resetBtn = document.getElementById('reset-progress-btn');
    const themeBtn = document.getElementById('theme-toggle-btn');
    const hideBtn = document.getElementById('hide-habits-btn');

    if (!habitsContainer) {
        console.error("Ошибка: Контейнер для привычек (id='habits-container') не найден на странице!");
        return;
    }

    function saveState() {
        localStorage.setItem('ecoHabitsHTML', habitsContainer.innerHTML);
        localStorage.setItem('ecoTheme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        localStorage.setItem('ecoHabitsHidden', habitsContainer.classList.contains('hidden') ? 'true' : 'false');
    }

    function loadState() {
        const savedHTML = localStorage.getItem('ecoHabitsHTML');
        if (savedHTML) {
            habitsContainer.innerHTML = savedHTML;
        }

        const savedTheme = localStorage.getItem('ecoTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        const isHidden = localStorage.getItem('ecoHabitsHidden');
        if (isHidden === 'true') {
            habitsContainer.classList.add('hidden');
        }

        attachMarkButtons();
        attachDeleteButtons();
    }

    function attachMarkButtons() {
        const markBtns = document.querySelectorAll('.mark-btn');

        markBtns.forEach(btn => {
            btn.onclick = function () {
                const card = this.closest('.eco-card');
                const progressBar = card.querySelector('.progress');
                const progressContainer = card.querySelector('.progress-bar');

                let currentValue = parseInt(progressBar.style.width) || 0;

                let newValue = currentValue + 10;
                if (newValue > 100) newValue = 100;

                progressBar.style.width = newValue + '%';
                progressBar.textContent = newValue + '%';
                progressContainer.setAttribute('aria-valuenow', newValue);

                saveState();
            };
        });
    }

    function attachDeleteButtons() {
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.onclick = function () {
                const card = this.closest('.eco-card');
                card.remove();
                saveState();
            };
        });
    }

    addHabitBtn.addEventListener('click', () => {
        const habitName = newHabitInput.value.trim();
        if (!habitName) {
            alert("Пожалуйста, введите название привычки!");
            return;
        }

        const newCard = document.createElement('article');
        newCard.className = 'eco-card';

        newCard.innerHTML = `
            <h3>${habitName}</h3>
            <p>Новая полезная привычка</p>
            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress" style="width: 0%;">0%</div>
            </div>
            <button class="mark-btn">Отметить</button>
            <button class="delete-btn">Удалить</button>
        `;

        habitsContainer.appendChild(newCard);

        newHabitInput.value = '';

        attachMarkButtons();
        attachDeleteButtons();
        saveState();
    });

    resetBtn.addEventListener('click', () => {
        const allProgressBars = document.querySelectorAll('.progress');
        const allProgressContainers = document.querySelectorAll('.progress-bar');

        allProgressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.textContent = '0%';
        });

        allProgressContainers.forEach(container => {
            container.setAttribute('aria-valuenow', '0');
        });

        saveState();
    });

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        saveState();
    });

    hideBtn.addEventListener('click', () => {
        habitsContainer.classList.toggle('hidden');
        saveState();
    });

    loadState();
});