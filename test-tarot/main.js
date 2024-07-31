document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from({ length: 78 }, (_, i) => `src/${i + 1}.png`); // Sửa lại đường dẫn
    const cardsContainer = document.querySelector('.cards-container');
    const cardSelection = document.getElementById('card-selection');
    const selectedCards = new Set();
    const spreadCards = document.querySelectorAll('.card');

    // Tạo hình ảnh lá bài
    cards.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Card ${index + 1}`;
        img.dataset.index = index + 1;
        img.addEventListener('click', () => selectCard(index + 1));
        cardsContainer.appendChild(img);
    });

    spreadCards.forEach(card => {
        card.addEventListener('click', () => {
            if (!selectedCards.has(card.dataset.index)) {
                cardSelection.style.display = 'flex';
                cardSelection.dataset.target = card.dataset.index;
            }
        });
    });

    function selectCard(cardIndex) {
        const targetCard = document.querySelector(`.card[data-index="${cardSelection.dataset.target}"]`);
        if (targetCard) {
            const img = new Image();
            img.src = cards[cardIndex - 1];
            img.onload = () => {
                const isHorizontal = targetCard.dataset.index == 5 || targetCard.dataset.index == 11;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (isHorizontal) {
                    canvas.width = 150;
                    canvas.height = 100;
                    ctx.translate(75, 50);
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(img, -50, -75, 100, 150);
                } else {
                    canvas.width = 100;
                    canvas.height = 150;
                    ctx.drawImage(img, 0, 0, 100, 150);
                }

                targetCard.style.backgroundImage = `url(${canvas.toDataURL()})`;
                targetCard.style.backgroundSize = 'cover';
                targetCard.style.backgroundPosition = 'center';
                targetCard.classList.add('selected');
                selectedCards.add(cardIndex);
                cardSelection.style.display = 'none';

                // Vô hiệu hóa lựa chọn các lá bài đã chọn
                spreadCards.forEach(card => {
                    if (selectedCards.has(card.dataset.index)) {
                        card.classList.add('selected');
                    }
                });
            };
        }
    }

    // Cho phép nhấp đúp để xóa lá bài
    spreadCards.forEach(card => {
        card.addEventListener('dblclick', () => {
            const cardIndex = card.dataset.index;
            if (selectedCards.has(cardIndex)) {
                card.style.backgroundImage = '';
                card.classList.remove('selected');
                selectedCards.delete(cardIndex);
            }
        });
    });
});