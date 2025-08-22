document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    const stepCards = document.querySelectorAll('.step-card');

    // Function to apply card hover effects
    function applyCardHover(cards) {
        cards.forEach(card => {
            card.addEventListener('mouseover', () => {
                card.style.border = `1px solid ${getComputedStyle(document.documentElement).getPropertyValue('--hover-border')}`;
                card.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--hover-bg');
                card.style.boxShadow = `0px 0px 15px 0px ${getComputedStyle(document.documentElement).getPropertyValue('--accent-color')}`;
            });

            card.addEventListener('mouseout', () => {
                card.style.border = `1px solid ${getComputedStyle(document.documentElement).getPropertyValue('--glass-border')}`;
                card.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--glass-bg');
                card.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.1)`;
            });
        });
    }

    applyCardHover(featureCards);
    applyCardHover(stepCards);
});