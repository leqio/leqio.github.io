const container = document.querySelector('.container');
const cards = document.querySelectorAll('.card');

container.addEventListener('mousemove', (e) => {
    for(const card of cards) {
        // 获取卡片的边界信息（包括位置和大小）
        const rect = card.getBoundingClientRect();
        // console.log('card--', card, rect);
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    }
})