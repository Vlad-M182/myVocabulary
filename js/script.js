"use strict";

const fetchedWords = [
	{
		"word": "conclusion",
		"translation": "висновок",
		"Other_translations": "завершення, закінчення, результат",
		"Use_examples": [
			"the conclusion of a free-trade accord",
			"the conclusion of World War Two",
			"the conclusion of a free-trade accord",
			"each research group came to a similar conclusion"
		],
		"Synonyms": "end, finish, close, termination"
	},
	{
		"word": "pillow",
		"translation": "подушка",
		"Other_translations": "підкладка, подушечка, класти голову",
		"Synonyms": "cushion, bolster, headrest, lay, rest"
	},
	{
		"word": "dictionary",
		"translation": "словник",
		"Other_translations": "довідник",
		"Use_examples": [
			"I'll look up ‘love’ in the dictionary",
			"the dictionary definition of ‘smile’",
			"the website gives access to an online dictionary"
		],
		"Synonyms": "lexicon, glossary, word list"
	},
	{
		"word": "translation",
		"translation": "переклад",
		"Other_translations": "процес перекладу, пояснення",
		"Use_examples": [
			"the translation of the relics of St. Thomas of Canterbury",
			"the translation of research findings into clinical practice"
		]
	},
	{
		"word": "process",
		"translation": "процес",
		"Use_examples": [
			"the aging process"
		]
	},
	{
		"word": "aging",
		"translation": "старіння",
		"Other_translations": "дозріваючий, старіючий",
		"Use_examples": [
			"the external signs of aging",
			"an aging population"
		]
	}
];

const burger = document.querySelector(".header__burger");
const wordsList = document.querySelector(".words__list");
const showFullInfo = document.querySelector(".show-word");
const addNewWordForm = document.forms["add-new-word"];
const clearStoageButton = document.querySelector(".clear-storage");
const searchingForm = document.forms["form-for-searching"];
const searchingInput = searchingForm["searchingInput"];
const searchListResult = document.querySelector(".results-search__list");

burger.addEventListener('click', () => {
	burger.classList.toggle('active');
	wordList.classList.toggle('open');
	if (window.innerWidth <= 768) {
		body.classList.toggle('_lock');
	}
});

clearStoageButton.addEventListener('click', () => {
	localStorage.clear();
	fillInTheListOfWords(wordsList, "words__word");
	console.log('Сховище очищене!');
});

//==============<functions>============================================================

// функція для завантаження слів у localStorage
// виконується один раз і тільки після завантаження сторінки
function loadLocalStorage(objectWithWords) {
	let wordsToLoad = objectWithWords.reduce((accumulator, currentValue) => (
		{ ...accumulator, [currentValue.word]: currentValue }
	), {});

	for (let word in wordsToLoad) {
		localStorage.setItem(`${word}`, JSON.stringify(wordsToLoad[word]));
	}

	console.log(`Данні завантажені у словник.`);
}

// функція для виведення слів у список з класом "parentForWords"
// залежно від методу або виводить весь відсортований список слів, або шукає і виводить якісь конкретні слова
// може бути викликана багато разів
function fillInTheListOfWords(parentForWords, classNameForChildren, method, wordOrPart = '') {
	let wordsToFillIn = [];

	if (parentForWords.children) {
		Array.from(parentForWords.children).forEach(result => result.remove());
	}

	switch (method) {
		case 'allWords':
			Object.keys(window.localStorage).forEach((word) => (
				wordsToFillIn.push({ [word]: getWordObjectFromStorage(word).translation })
			));
			break;
		case 'singleWord':
			Object.keys(window.localStorage).forEach((word) => {
				const wordObject = getWordObjectFromStorage(word),
					translation = wordObject.translation;
				if (wordOrPart && (word.startsWith(wordOrPart) || translation.startsWith(wordOrPart)))
					wordsToFillIn.push({ [word]: getWordObjectFromStorage(word).translation })
			});
			break;
		default:
			return console.error(`Method is invalid!!!`);
	}

	wordsToFillIn.sort((a, b) => {
		return Object.keys(a) < Object.keys(b);
	});

	wordsToFillIn.forEach((wordObject) => {
		parentForWords.insertAdjacentHTML('afterbegin', `
		<li class="${classNameForChildren}" >
			<span class="word">${Object.keys(wordObject)}</span>
			-
			<span class="translation">${wordObject[Object.keys(wordObject)]}</span>
		</li>
		`)
	})

	console.log(`Данні виведені у список.`);
}

// функція для отримання об'єкта слова із сховища
function getWordObjectFromStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}

//==============</functions>============================================================

window.addEventListener('load', () => {
	loadLocalStorage(fetchedWords);
	fillInTheListOfWords(wordsList, "words__word", 'allWords');
});

wordsList.addEventListener('click', (e) => {
	let target = e.target;

	if (target.classList.contains('words__list')) {
		return 0;
	}

	if (!target.classList.contains('words__word')) {
		target = target.parentElement;
	}

	let theWord = target.firstElementChild.textContent;
	let theTranslation = target.lastElementChild.textContent;
	let children = Array.from(showFullInfo.children);
	let theWordObject = getWordObjectFromStorage(theWord)

	if (children.length) {
		children.forEach(child => child.remove())
	}

	showFullInfo.insertAdjacentHTML('beforeend', `
		<div class="show-word__word">
			<span class="word"> ${theWord}</span>
			-
			<span class="translation"> ${theTranslation}</span>
		</div>
	`);

	for (let theWordObjectKey in theWordObject) {
		if (theWordObjectKey !== 'word' && theWordObjectKey !== 'translation' && theWordObject[theWordObjectKey] !== '') {
			let theWordObjectValue = theWordObject[theWordObjectKey];
			showFullInfo.insertAdjacentHTML('beforeend', `
				<div class="show-word__block">
					<h2 class="show-word__title">
					${theWordObjectKey.split('_').reduce((prevTitlePart, titlePart) => `${prevTitlePart} ${titlePart}`, '')}
					</h2>
					<div class="show-word__content">
					${Array.isArray(theWordObjectValue)
					? theWordObjectValue.reduce((previnfoItem, currentInfoItem) => `${previnfoItem}<br>${currentInfoItem}`, '')
					: theWordObjectValue}
					</div >
				</div >
			`);
		}
	}
});

addNewWordForm.addEventListener('submit', (e) => {
	e.preventDefault();

	let newWord = addNewWordForm['new-word'].value;
	let translation = addNewWordForm['translation'].value;
	let otherTranslations = addNewWordForm['other-translations'].value;
	let examples = addNewWordForm['examples'].value;
	let synonyms = addNewWordForm['synonyms'].value;
	let antonyms = addNewWordForm['antonyms'].value;

	localStorage.setItem(`${newWord}`, JSON.stringify({
		"word": newWord,
		"translation": translation,
		"Other_translations": otherTranslations,
		"Use_examples": examples,
		"Synonyms": synonyms,
		"Antonyms": antonyms,
	}));

	Array.from(addNewWordForm.elements).forEach(element => element.value = '');

	fillInTheListOfWords(wordsList, "words__word");
});

searchingInput.addEventListener('input', () => {
	const printedText = searchingInput.value.toLowerCase();

	fillInTheListOfWords(searchListResult, "results-search__word", 'singleWord', printedText);
});