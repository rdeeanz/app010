const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = mobileMenu.querySelectorAll('a');

const toggleMenu = () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
};

navToggle.addEventListener('click', toggleMenu);
navLinks.forEach(link => link.addEventListener('click', () => {
    if (window.innerWidth < 992) {
        toggleMenu();
    }
}));

document.addEventListener('click', (event) => {
    if (!mobileMenu.hidden && !event.target.closest('.nav-toggle') && !event.target.closest('#mobile-menu')) {
        toggleMenu();
    }
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('[data-animation="zoom"]').forEach(item => observer.observe(item));

const heroCanvas = document.getElementById('hero-chart');
const heroCtx = heroCanvas.getContext('2d');

const generateData = () => {
    const points = [];
    let value = 50;
    for (let i = 0; i < 120; i += 1) {
        const drift = Math.sin(i / 12) * 1.8;
        const noise = (Math.random() - 0.5) * 2.2;
        value = Math.max(10, value + drift + noise);
        points.push({ x: i, y: value });
    }
    return points;
};

const renderHeroChart = () => {
    const points = generateData();
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    const gradient = heroCtx.createLinearGradient(0, 0, heroCanvas.width, heroCanvas.height);
    gradient.addColorStop(0, 'rgba(44, 177, 161, 0.85)');
    gradient.addColorStop(1, 'rgba(6, 18, 37, 0.75)');

    heroCtx.beginPath();
    points.forEach((point, index) => {
        const x = (point.x / 120) * heroCanvas.width;
        const y = heroCanvas.height - (point.y / 100) * heroCanvas.height;
        if (index === 0) {
            heroCtx.moveTo(x, y);
        } else {
            heroCtx.lineTo(x, y);
        }
    });
    heroCtx.strokeStyle = 'rgba(227, 232, 242, 0.95)';
    heroCtx.lineWidth = 3;
    heroCtx.shadowColor = 'rgba(44, 177, 161, 0.45)';
    heroCtx.shadowBlur = 16;
    heroCtx.stroke();

    heroCtx.lineTo(heroCanvas.width, heroCanvas.height);
    heroCtx.lineTo(0, heroCanvas.height);
    heroCtx.closePath();
    heroCtx.fillStyle = gradient;
    heroCtx.fill();
};

renderHeroChart();
setInterval(renderHeroChart, 4000);

const buildChart = (elementId, config) => new Chart(document.getElementById(elementId), config);

const performanceChart = buildChart('performanceChart', {
    type: 'line',
    data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'CAPPY Optimized',
                data: [100, 118, 156, 172, 198, 234],
                tension: 0.4,
                borderColor: '#2cb1a1',
                backgroundColor: 'rgba(44, 177, 161, 0.15)',
                fill: true,
                pointRadius: 0,
            },
            {
                label: 'Benchmark Index',
                data: [100, 110, 132, 140, 159, 176],
                tension: 0.4,
                borderColor: '#c0c7d6',
                backgroundColor: 'rgba(192, 199, 214, 0.05)',
                fill: true,
                pointRadius: 0,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#e3e8f2' } },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: {
                ticks: { color: '#c0c7d6' },
                grid: { color: 'rgba(192, 199, 214, 0.08)' }
            },
            y: {
                ticks: { color: '#c0c7d6' },
                grid: { color: 'rgba(192, 199, 214, 0.08)' }
            }
        }
    }
});

const regimeChart = buildChart('regimeChart', {
    type: 'doughnut',
    data: {
        labels: ['Expansion', 'Correction', 'Volatile', 'Recession'],
        datasets: [{
            data: [42, 23, 21, 14],
            backgroundColor: ['#2cb1a1', '#1f9b82', '#3ac4c0', '#c0c7d6'],
            borderColor: '#030910',
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#e3e8f2' } }
        }
    }
});

const volatilityChart = buildChart('volatilityChart', {
    type: 'bar',
    data: {
        labels: ['Drawdown', 'Recovery', 'Return'],
        datasets: [
            {
                label: 'Traditional Portfolio',
                data: [-22, 14, 8],
                backgroundColor: 'rgba(192, 199, 214, 0.5)'
            },
            {
                label: 'CAPPY Adaptive',
                data: [-12, 18, 15],
                backgroundColor: 'rgba(44, 177, 161, 0.7)'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#e3e8f2' } },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#c0c7d6' },
                grid: { display: false }
            },
            y: {
                ticks: {
                    color: '#c0c7d6',
                    callback: value => `${value}%`
                },
                grid: { color: 'rgba(192, 199, 214, 0.08)' }
            }
        }
    }
});

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
}).format(value);

const simulationForm = document.getElementById('simulationForm');
const simulationResults = document.getElementById('simulationResults');

const riskProfiles = {
    conservative: { growth: 0.06, volatility: 0.08, downside: 0.09 },
    balanced: { growth: 0.095, volatility: 0.12, downside: 0.14 },
    growth: { growth: 0.14, volatility: 0.18, downside: 0.2 }
};

simulationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = Number(simulationForm.investmentAmount.value);
    const risk = simulationForm.riskTolerance.value;
    const years = Number(simulationForm.timeHorizon.value);

    const profile = riskProfiles[risk];
    const projectedValue = amount * Math.pow(1 + profile.growth, years);
    const stressValue = amount * Math.pow(1 + (profile.growth - profile.downside), Math.max(years - 1, 1));

    simulationResults.innerHTML = `
        <h4>Simulation Summary</h4>
        <p>Projected value after ${years} years: <strong>${formatCurrency(projectedValue)}</strong></p>
        <p>Stress-tested scenario: <strong>${formatCurrency(stressValue)}</strong></p>
        <p>Expected annualized volatility: <strong>${(profile.volatility * 100).toFixed(1)}%</strong></p>
        <p class="micro-copy">Outputs are hypothetical and not guarantees of future performance.</p>
    `;
});

const roiForm = document.getElementById('roiForm');
const roiResults = document.getElementById('roiResults');

roiForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = Number(roiForm.roiAmount.value);
    const years = Number(roiForm.roiYears.value);

    const cappyReturn = amount * Math.pow(1.118, years);
    const traditionalReturn = amount * Math.pow(1.073, years);
    const uplift = ((cappyReturn - traditionalReturn) / traditionalReturn) * 100;

    roiResults.innerHTML = `
        <h4>Return Comparison</h4>
        <p>CAPPY optimized projection: <strong>${formatCurrency(cappyReturn)}</strong></p>
        <p>Traditional model projection: <strong>${formatCurrency(traditionalReturn)}</strong></p>
        <p>Potential uplift: <strong>${uplift.toFixed(1)}%</strong></p>
        <p class="micro-copy">Assumes reinvested returns and does not include fees or taxes.</p>
    `;
});

const marketForm = document.getElementById('marketForm');
const marketResponse = document.getElementById('marketResponse');

const marketPlaybooks = {
    bull: {
        heading: 'Bull Market Momentum',
        summary: 'Amplify factor rotations and lean into momentum while capping leverage.',
        actions: [
            'Increase cyclical sector weighting by up to 12%.',
            'Tilt toward quality growth names with improving earnings revisions.',
            'Lock-in gains via trailing stop logic to protect recent alpha.'
        ]
    },
    bear: {
        heading: 'Defensive Shield Deployment',
        summary: 'Conserve capital with low-volatility tilts and tactical hedging.',
        actions: [
            'Shift 18% into minimum-variance equity sleeves and protective puts.',
            'Deploy machine-learning signals to identify short-term relief rallies.',
            'Harvest tax losses to redeploy into correlated alternatives.'
        ]
    },
    volatile: {
        heading: 'Volatility Harvest Strategy',
        summary: 'Exploit dispersion with adaptive risk budgets and spread trades.',
        actions: [
            'Allocate to statistical arbitrage sleeves to monetize dispersion.',
            'Widen guardrail corridors and shorten rebalancing windows to 24 hours.',
            'Dynamically adjust cash buffers to stabilize portfolio beta.'
        ]
    },
    sideways: {
        heading: 'Market Neutral Precision',
        summary: 'Seek idiosyncratic alpha via factor neutralization.',
        actions: [
            'Deploy market-neutral pairs to capture micro-structure dislocations.',
            'Optimize dividend capture and factor neutrality for low drift.',
            'Reinvest tax alpha into underweight secular growth themes.'
        ]
    }
};

marketForm.addEventListener('change', () => {
    const selection = marketForm.marketCondition.value;
    const playbook = marketPlaybooks[selection];
    marketResponse.innerHTML = `
        <h4>${playbook.heading}</h4>
        <p>${playbook.summary}</p>
        <ul>${playbook.actions.map(action => `<li>${action}</li>`).join('')}</ul>
    `;
});

const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
        mobileMenu.hidden = true;
        navToggle.setAttribute('aria-expanded', 'false');
    }
});
