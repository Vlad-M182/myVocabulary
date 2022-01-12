"use strict";

const fetchedWords = [
	{
		"word": "conclusion",
		"translation": "висновок",
		"other_translations": "завершення, закінчення, результат",
		"use_examples": [
			"Eeach research group came to a similar conclusion.-Кожна з груп прийшла до однакового висновку.",
		],
		"synonyms": "end, finish, close, termination",
		"antonyms": ""
	},
	{
		"word": "pillow",
		"translation": "подушка",
		"other_translations": "підкладка, подушечка, класти голову",
		"use_examples": [],
		"synonyms": "cushion, bolster, headrest, lay, rest",
		"antonyms": ""
	},
	{
		"word": "dictionary",
		"translation": "словник",
		"other_translations": "довідник",
		"use_examples": [
			"I'll look up ‘love’ in the dictionary.-Я знайду в словнику слово «любов».",
			"The dictionary definition of ‘smile’.-Cловникове визначення слова «усмішка».",
			"The website gives access to an online dictionary.-Цей сайт дає доступ до онлайн словника."
		],
		"synonyms": "lexicon, glossary, word list",
		"antonyms": ""
	},
	{
		"word": "translation",
		"translation": "переклад",
		"other_translations": "процес перекладу, пояснення",
		"use_examples": [
			"The translation of the relics of St. Thomas of Canterbury.-Переклад мощей святого Фоми Кентерберійського",
			"The translation of research findings into clinical practice.-Переведення результатів досліджень у клінічну практику."
		],
		"synonyms": "",
		"antonyms": ""
	},
	{
		"word": "process",
		"translation": "процес",
		"other_translations": "",
		"use_examples": [
			"The aging process.-Процес старіння."
		],
		"synonyms": "",
		"antonyms": ""
	},
	{
		"word": "aging",
		"translation": "старіння",
		"other_translations": "дозріваючий, старіючий",
		"use_examples": [
			"The external signs of aging.-Зовнішні ознаки старіння.",
			"An aging population.-Старіюче населення."
		],
		"synonyms": "",
		"antonyms": ""
	}
];

const classes = {
	wordsListFromStorage: 'words__list',
	wordsListForSearchedWords: 'results-search__list',
	searchedWord: 'results-search__word',
	wordInList: 'words__word',
	deleteTheWordButton: 'delete-word',
	editTheWordButton: 'edit-word',
};

const body = document.querySelector("body");
const burger = document.querySelector(".header__burger");
const wordList = document.querySelector(".word-list");
const listForWordsFromStorage = document.querySelector(`.${classes.wordsListFromStorage}`);
const showFullInfo = document.querySelector(".show-word");
const addNewWordForm = document.forms["add-new-word"];
const clearStoageButton = document.querySelector(".clear-storage");
const searchingForm = document.forms["form-for-searching"];
const searchingInput = searchingForm["searchingInput"];
const searchListResult = document.querySelector(".results-search__list");
const searchResult = document.querySelector(".results-search");
const addNewFuildButton = document.querySelector(".add-new-field");

burger.addEventListener('click', () => {
	burger.classList.toggle('active');
	wordList.classList.toggle('open');
	if (window.innerWidth <= 768) {
		body.classList.toggle('_lock');
	}
});

clearStoageButton.addEventListener('click', () => {
	localStorage.clear();
	fillInTheListOfWords(listForWordsFromStorage, classes.wordInList);
	console.log('Сховище очищене!');
});

addNewFuildButton.addEventListener('click', () => {
	const translateToLastExampleName = addNewWordForm['use-examples'].lastElementChild.name;
	const exampleNumber = translateToLastExampleName.substring(translateToLastExampleName.length - 1);

	addNewWordForm['use-examples'].insertAdjacentHTML('beforeend', `
		<textarea class="add-word__examples" name="example${+exampleNumber + 1}" placeholder="Enter example №${+exampleNumber + 1}"></textarea>
		<textarea class="add-word__examples" name="translate-to-example${+exampleNumber + 1}" placeholder="Enter translate to example №${+exampleNumber + 1}"></textarea>
	`);
});

//==============<functions>============================================================

function removeClassesForBurger() {
	burger.classList.remove('active');
	wordList.classList.remove('open');
	if (window.innerWidth <= 768) {
		body.classList.remove('_lock');
	}
}

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
				wordsToFillIn.push(`${word}-${getWordObjectFromStorage(word).translation}`)
			));
			break;
		case 'singleWord':
			Object.keys(window.localStorage).forEach((word) => {
				const wordObject = getWordObjectFromStorage(word),
					translation = wordObject.translation;
				if (wordOrPart && (word.startsWith(wordOrPart) || translation.startsWith(wordOrPart)))
					wordsToFillIn.push(`${word}-${getWordObjectFromStorage(word).translation}`)
			});
			break;
		default:
			return console.error(`Method is invalid!!!`);
	}

	wordsToFillIn.sort((a, b) => {
		return a.localeCompare(b);
	}).reverse();

	wordsToFillIn.forEach((wordText) => {
		parentForWords.insertAdjacentHTML('afterbegin', `
		<li class="${classNameForChildren}" >
			<span class="word">${wordText.split('-')[0]}</span>
			-
			<span class="translation">${wordText.split('-')[1]}</span>
		</li>
		`)
	})

	console.log(`Данні виведені у список.`);
}

// функція для отримання об'єкта слова із сховища
function getWordObjectFromStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}

// функція для виведення абзаців з прикладами до слова
function showExamples(theWordObjectValue) {
	let examples = '';
	theWordObjectValue.forEach((text, i) => {
		examples += `
		<p class="example">${theWordObjectValue[i].substring(0, theWordObjectValue[i].indexOf('-'))}</p>
		<p class="translate">${theWordObjectValue[i].substring(theWordObjectValue[i].indexOf('-') + 1)}</p>
		`;
	})
	return examples;
}

// фунуція для відображення всієї інформації про слово
function displayFullWordInfo(parentForInfo, clickedWord) {
	const children = Array.from(parentForInfo.children),
		theWord = clickedWord.firstElementChild.textContent,
		theTranslation = clickedWord.lastElementChild.textContent,
		theWordObject = getWordObjectFromStorage(theWord);

	if (children.length) {
		children.forEach(child => child.remove())
	}

	parentForInfo.insertAdjacentHTML('beforeend', `
		<div class="show-word__word">
			<span class="word"> ${theWord}</span>
			-
			<span class="translation"> ${theTranslation}</span>
		</div>
	`);

	for (let theWordObjectKey in theWordObject) {
		let theWordObjectValue = theWordObject[theWordObjectKey];
		if (theWordObjectKey !== 'word' && theWordObjectKey !== 'translation' && theWordObjectValue.length) {
			parentForInfo.insertAdjacentHTML('beforeend', `
				<div class="show-word__block">
					<h2 class="show-word__title">
					${theWordObjectKey.split('_').reduce((prevTitlePart, titlePart) => `${prevTitlePart} ${titlePart}`, '')}
					</h2>
					<div class="show-word__content">
					${Array.isArray(theWordObjectValue)
					? showExamples(theWordObjectValue)
					: theWordObjectValue}
					</div >
				</div >
			`);
		}
	}

	parentForInfo.insertAdjacentHTML('beforeend', `
		<button class="button button-for-word ${classes.deleteTheWordButton}">Delete word</button>
		<button class="button button-for-word ${classes.editTheWordButton}">Edit word</button>
	`);

	document.querySelector(`.${classes.deleteTheWordButton}`).addEventListener('click', () => deleteTheWord(theWord));
	document.querySelector(`.${classes.editTheWordButton}`).addEventListener('click', () => editTheWord(theWord));
}

function deleteTheWord(theWord) {
	localStorage.removeItem(theWord);
	fillInTheListOfWords(listForWordsFromStorage, classes.wordInList, 'allWords');
}

function editTheWord(theWord) {
	const theWordObject = getWordObjectFromStorage(theWord),
		examplesLength = theWordObject['use_examples'].length;

	if (examplesLength) {
		addNewWordForm['example1'].value =
			theWordObject['use_examples'][0].substring(0, theWordObject['use_examples'][0].indexOf('-'));
		addNewWordForm['translate-to-example1'].value =
			theWordObject['use_examples'][0].substring(theWordObject['use_examples'][0].indexOf('-') + 1);

		if (examplesLength >= 2) {
			theWordObject['use_examples'].forEach((example, index) => {
				if (index >= 1) {
					addNewWordForm['use-examples'].insertAdjacentHTML('beforeend', `
						<textarea class="add-word__examples"
						name="example${+index + 1}"
						placeholder="Enter example №${+index + 1}"
						value="${example.substring(0, example.indexOf('-'))}"
						>${example.substring(0, example.indexOf('-'))}</textarea>
						<textarea class="add-word__examples" 
						name="translate-to-example${+index + 1}" 
						placeholder="Enter translate to example №${+index + 1}"
						value="${example.substring(example.indexOf('-') + 1)}"
						>${example.substring(example.indexOf('-') + 1)}</textarea>
					`);
				}
			})
		}
	}

	addNewWordForm['new-word'].value = theWordObject.word;
	addNewWordForm['translation'].value = theWordObject.translation;
	addNewWordForm['other-translations'].value = theWordObject?.Other_translations || '';
	addNewWordForm['synonyms'].value = theWordObject?.Synonyms || '';
	addNewWordForm['antonyms'].value = theWordObject?.Antonyms || '';
}

//==============</functions>============================================================

window.addEventListener('load', () => {
	loadLocalStorage(fetchedWords);
	fillInTheListOfWords(listForWordsFromStorage, classes.wordInList, 'allWords');
});

listForWordsFromStorage.addEventListener('click', (e) => {
	let target = e.target;

	if (window.innerWidth <= 992) {
		removeClassesForBurger();
	}

	if (target.classList.contains(classes.wordsListFromStorage)) {
		return 0;
	}

	if (!target.classList.contains(classes.wordInList)) {
		target = target.parentElement;
	}

	displayFullWordInfo(showFullInfo, target);
});

searchListResult.addEventListener('click', (e) => {
	let target = e.target;

	if (window.innerWidth <= 992) {
		removeClassesForBurger();
	}

	searchingInput.value = '';
	searchResult.style.display = 'none';

	if (target.classList.contains(classes.wordsListForSearchedWords)) {
		return 0;
	}

	if (!target.classList.contains(classes.searchedWord)) {
		target = target.parentElement;
	}

	displayFullWordInfo(showFullInfo, target);
});

addNewWordForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const examplesChildren = Array.from(addNewWordForm['use-examples'].children),
		examplesArray = [];

	for (let i = 0; i < examplesChildren.length; i += 2) {
		if (!examplesChildren[i].value || !examplesChildren[i + 1].value) continue;
		examplesArray.push(`${examplesChildren[i].value}-${examplesChildren[i + 1].value}`);
	}

	const newWord = addNewWordForm['new-word'].value,
		translation = addNewWordForm['translation'].value,
		otherTranslations = addNewWordForm['other-translations'].value,
		examples = examplesArray,
		synonyms = addNewWordForm['synonyms'].value,
		antonyms = addNewWordForm['antonyms'].value;

	localStorage.setItem(`${newWord}`, JSON.stringify({
		"word": newWord,
		"translation": translation,
		"other_translations": otherTranslations,
		"use_examples": examples,
		"synonyms": synonyms,
		"antonyms": antonyms,
	}));

	Array.from(addNewWordForm.elements).forEach(element => element.value = '');

	if (examplesChildren.length > 2) {
		examplesChildren.forEach((child, index) => {
			if (index > 1) {
				child.remove();
			}
		})
	}

	fillInTheListOfWords(listForWordsFromStorage, classes.wordInList, 'allWords');
});

searchingInput.addEventListener('input', () => {
	const printedText = searchingInput.value.toLowerCase();

	if (searchingInput.value) {
		searchResult.style.display = 'block';
	} else {
		searchResult.style.display = 'none';
	}

	fillInTheListOfWords(searchListResult, classes.searchedWord, 'singleWord', printedText);
});