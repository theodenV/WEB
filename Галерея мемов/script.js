const memes = [
    {
        id: 1,
        title: "Апельсин",
        description: "Грустная история об одиноком апельсине",
        image: "Мемы/prehistoric1.jpg",
        category: "prehistoric",
        year: "~2012",
        likes: 0,
        dislikes: 0
    },
    {
        id: 2,
        title: "Нельзя просто так взять и...",
        description: "Ну вот правда, нельзя",
        image: "Мемы/prehistoric2.jpg",
        category: "prehistoric",
        year: "2010",
        likes: 0,
        dislikes: 0
    },
    {
        id: 3,
        title: "Троллинг",
        description: "Все очень понятно!",
        image: "Мемы/prehistoric3.jpg",
        category: "prehistoric",
        year: "~2011",
        likes: 0,
        dislikes: 0
    },
    {
        id: 4,
        title: "Сейчас/раньше",
        description: "Раньше было лучше",
        image: "Мемы/student1.png",
        category: "student",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 5,
        title: "Самый лучший план",
        description: "Надежный как швйецарские часы",
        image: "Мемы/student2.jpg",
        category: "student",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 6,
        title: "Эволюция студента",
        description: "Со всеми так",
        image: "Мемы/student3.jpg",
        category: "student",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 7,
        title: "Почему?",
        description: "Основной вопрос программирования",
        image: "Мемы/programmer1.jpg",
        category: "programming",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 8,
        title: "Не мой код",
        description: "Не украл, а адаптировал",
        image: "Мемы/programmer2.webp",
        category: "programming",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 9,
        title: "Все дороги ведут в Гугл",
        description: "А что, разве нет?",
        image: "Мемы/programmer3.jpg",
        category: "programming",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 10,
        title: "Безопасность",
        description: "Добренько",
        image: "Мемы/kind1.jpg",
        category: "kind",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 11,
        title: "Меньше негатива",
        description: "Спасибо, хороший песик!",
        image: "Мемы/kind2.jfif",
        category: "kind",
        year: "2023",
        likes: 0,
        dislikes: 0
    },
    {
        id: 12,
        title: "Майнкрафт dog",
        description: "По-другому играть нельзя",
        image: "Мемы/kind3.jpg",
        category: "kind",
        year: "2023",
        likes: 0,
        dislikes: 0
    }
];

const memeGallery = document.getElementById('memeGallery');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const modal = document.getElementById('memeModal');
const closeModal = document.querySelector('.close-modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalYear = document.getElementById('modalYear');
const logo = document.querySelector('.logo');

let currentMeme = null;

function loadRatings() {
    const savedRatings = localStorage.getItem('memeRatings');
    if (savedRatings) {
        const ratings = JSON.parse(savedRatings);
        memes.forEach(meme => {
            if (ratings[meme.id]) {
                meme.likes = ratings[meme.id].likes || 0;
                meme.dislikes = ratings[meme.id].dislikes || 0;
                meme.userVote = ratings[meme.id].userVote || null;
            }
        });
    }
}

function saveRatings() {
    const ratings = {};
    memes.forEach(meme => {
        ratings[meme.id] = {
            likes: meme.likes,
            dislikes: meme.dislikes,
            userVote: meme.userVote
        };
    });
    localStorage.setItem('memeRatings', JSON.stringify(ratings));
}

function updateRatingDisplay(meme) {
    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');
    
    likeBtn.querySelector('span').textContent = meme.likes;
    dislikeBtn.querySelector('span').textContent = meme.dislikes;

    likeBtn.classList.remove('active', 'disabled');
    dislikeBtn.classList.remove('active', 'disabled');

    if (meme.userVote === 'like') {
        likeBtn.classList.add('active');
        dislikeBtn.classList.add('disabled');
    } else if (meme.userVote === 'dislike') {
        dislikeBtn.classList.add('active');
        likeBtn.classList.add('disabled');
    }
}

function openModal(meme) {
    if (!meme) return;
    
    currentMeme = meme;
    const modal = document.getElementById('memeModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalYear = document.getElementById('modalYear');
    
    if (modal && modalImage && modalTitle && modalDescription && modalYear) {
        modalImage.src = meme.image;
        modalTitle.textContent = meme.title;
        modalDescription.textContent = meme.description;
        modalYear.textContent = `Год: ${meme.year}`;
        modal.style.display = 'block';
        updateRatingDisplay(meme);
    }
}

function closeModalWindow() {
    modal.style.display = 'none';
    currentMeme = null;
}

function filterByCategory(category) {
    const memeCards = document.querySelectorAll('.meme-card:not(.easter-egg)');
    const easterEgg = document.querySelector('.easter-egg');
    
    if (easterEgg) {
        easterEgg.style.display = 'none';
    }
    
    memeCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchMemes(query) {
    query = query.toLowerCase();
    const memeCards = document.querySelectorAll('.meme-card:not(.easter-egg)');
    const easterEgg = document.querySelector('.easter-egg');
    
    if (query === 'пасхалка') {
        if (easterEgg) {
            easterEgg.style.display = 'block';
        }
    } else {
        if (easterEgg) {
            easterEgg.style.display = 'none';
        }
    }

    memeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.meme-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            openModal(memes[index]);
        });
    });

    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterByCategory(button.dataset.category);
        });
    });
    
    searchInput.addEventListener('input', (e) => {
        searchMemes(e.target.value);
    });

    closeModal.addEventListener('click', closeModalWindow);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalWindow();
        }
    });

    document.querySelector('.like-btn').addEventListener('click', () => {
        if (currentMeme) {
            if (currentMeme.userVote === 'like') {
                currentMeme.likes--;
                currentMeme.userVote = null;
            } else if (currentMeme.userVote === 'dislike') {
                currentMeme.dislikes--;
                currentMeme.likes++;
                currentMeme.userVote = 'like';
            } else {
                currentMeme.likes++;
                currentMeme.userVote = 'like';
            }
            updateRatingDisplay(currentMeme);
            saveRatings();
        }
    });

    document.querySelector('.dislike-btn').addEventListener('click', () => {
        if (currentMeme) {
            if (currentMeme.userVote === 'dislike') {
                currentMeme.dislikes--;
                currentMeme.userVote = null;
            } else if (currentMeme.userVote === 'like') {
                currentMeme.likes--;
                currentMeme.dislikes++;
                currentMeme.userVote = 'dislike';
            } else {
                currentMeme.dislikes++;
                currentMeme.userVote = 'dislike';
            }
            updateRatingDisplay(currentMeme);
            saveRatings();
        }
    });
});

loadRatings();
