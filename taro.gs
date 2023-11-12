/**
 * Возвращает случайное приветственное сообщение на основе выбранного языка.
 *
 * @param {string} lang - Язык, для которого нужно вернуть приветственное сообщение. Допустимые значения: 'ru'.
 * @returns {string} Случайное приветственное сообщение на выбранном языке.
 */
function getStartMessage(lang, name) {
	const welcome_messages = {
		ru: [
			`<b>Добро пожаловать, ${name}!</b>\nЯ - кот-провидец, который знает все тайны мистики и оккультизма.\nСейчас я могу погадить... тьфу, погадать тебе на картах таро, чтобы помочь тебе раскрыть тайны твоей жизни.Я знаю, что ты ищешь ответы на свои вопросы, и я готов помочь тебе в этом. Садись за стол, возьми чашку чая и дай мне показать тебе путь к светлому будущему. Я уверен, что ты найдешь то, что ищешь, в моем мире мистики и оккультизма. \nДобро пожаловать в мой шатер, где все возможно!`,
			`<b>Мяу! Добро пожаловать, ${name}!</b>\nЯ - кот-провидец, и я знаю, что ты здесь, чтобы гадить... Извини, я имел в виду, чтобы гадать! Я здесь, чтобы помочь тебе раскрыть тайны твоей жизни и показать тебе путь к светлому будущему. Мои карты таро готовы раскрыть все тайны твоей души. Садись, ${name}, и дай мне прочесть твою судьбу. Но не забывай, что раскрытие будущего, может иметь свои последствия. \nЕсли решимость еще с тобой - давай начнем, я уже готов!`,
			`<b>Добро пожаловать, ${name}.</b>\nЯ - кот-провидец, который знает тайные тайны и секретные секреты игры жизни. \nСейчас я готов раскрыть пару тайн и помочь тебе проложить путь в светлое будущее. Мои карты таро - это не только красивые картинки, но и ключ к твоей судьбе. Садись за стол со мной, взгляни на свечу, и я раскрою тебе тайны прошлого, настоящего и будущего. \nНо помни, ${name}, карты - предсказывают судьбу, а творишь ее только ты.`
		]
	}
	let welcome_message = getRandomElement(welcome_messages[lang]);
	return welcome_message;
}

/**
 * Возвращает массив из трех уникальных карт.
 *
 * @returns {Array} Массив, содержащий три уникальные карты.
 */
function getRasklad() {
	let rasklad = [];
	while (rasklad.length !== 3) {
		let card = getRandomCard(tarotDeck());
		if (typeof card === 'object' && !rasklad.includes(card)) {
			rasklad.push(card);
		}
	}
	console.log(rasklad);
	return rasklad;
}

/**
 * Возвращает случайную карту из колоды.
 *
 * @param {Array} deck - Массив, представляющий колоду карт.
 * @throws {Error} Если переданный параметр не является массивом.
 * @returns {{id: number, card: object}} Объект, содержащий id и объект случайной карты из колоды.
 */
function getRandomCard(deck) {
	const cardIndex = Math.floor(Math.random() * deck.length);
	const card = {
		id: cardIndex,
		card: deck[cardIndex]
	};
	console.log(deck[cardIndex].description);
	return card;
}

/**
 * Возвращает случайный элемент из массива.
 *
 * @param {Array} arr - Массив, из которого нужно выбрать элемент.
 * @returns {*} Случайный элемент из массива.
 */
function getRandomElement(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function tarotDeck() {
	var deck = [{
		arcana: 'Major',
		name: '0 – The Fool',
		description: 'Шут - карта, которая символизирует свободу, беззаботность, игривость и неопределенность. Она также может указывать на необходимость открытости к новым возможностям и приключениям, а также на необходимость не бояться ошибок и неудач.',
		file_id: "AgACAgIAAxkBAAIBHmR-XD0m-aQKMl5ZTFIAAWe6CYQjWwACttMxG5eI8Ut59c52WYHMQwEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Major',
		name: 'I – The Magician',
		description: 'Маг - карта, которая символизирует силу воли, умение управлять своими мыслями и эмоциями, а также способность к творчеству и интуиции.',
		file_id: "AgACAgIAAxkBAAIBFWR-W2VRMRl_k9REywEpirU78-NWAAKz0zEbl4jxS6owmE9wueXVAQADAgADeQADLwQ"
	},
	{
		arcana: 'Major',
		name: 'II – The High Priestess',
		description: 'Жрица - карта, которая символизирует мудрость, интуицию, тайны и мистику. Она также может указывать на необходимость внутреннего роста и развития.',
		file_id: "AgACAgIAAxkBAAIBGGR-W8M7s4laLMwHqs0kBcVTZD82AAK00zEbl4jxSypEtvU_dBIgAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'III – The Empress',
		description: 'Императрица - карта, которая символизирует материнство, плодородие, уют и комфорт. Она также может указывать на необходимость заботы о себе и своем здоровье.',
		file_id: "AgACAgIAAxkBAAIBG2R-W-zxM9YAAeyO4sVYdWzmzZaREwACtdMxG5eI8UvDJ4tOapX3iAEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Major',
		name: 'IV – The Emperor',
		description: 'Император - карта, которая символизирует власть, авторитет, стабильность и организованность. Она также может указывать на необходимость принятия решительных действий.',
		file_id: "AgACAgIAAxkBAAIBIWR-XGsiiPkQhy9pMdLKHj46wu6vAAK30zEbl4jxS2rxGG1mTfxeAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'V – The Hierophant',
		description: 'Иерофант - карта, которая символизирует духовное руководство, учение и обучение. Она также может указывать на необходимость поиска духовного пути и развития.',
		file_id: "AgACAgIAAxkBAAIBJGR-XI0Q1ZV51ap_P4KecHzMtTlaAAK40zEbl4jxSyJxf-iqFNmcAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'VI – The Lovers',
		description: 'Влюбленные - карта, которая символизирует любовь, страсть, выбор и романтику. Она также может указывать на необходимость принятия важных решений в отношениях.',
		file_id: "AgACAgIAAxkBAAIBJ2R-XLVlnkGR_P-o7h8Q-_Of2Q-gAAK50zEbl4jxSz2E7qrIhoKmAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'VII – The Chariot',
		description: 'Колесница - карта, которая символизирует движение, прогресс, целеустремленность и успех. Она также может указывать на необходимость преодоления препятствий и достижения поставленных целей.',
		file_id: "AgACAgIAAxkBAAIBLWR-XSktMTwZ7vgfyGwGG56ExQJyAAK80zEbl4jxSwHuodZLh2-tAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'VIII – Strength',
		description: 'Сила - карта, которая символизирует силу, мужество, дисциплину и самоконтроль. Она также может указывать на необходимость преодоления своих страхов и слабостей.',
		file_id: "AgACAgIAAxkBAAIBKmR-XOMNNUzreYr4Ryx9iHzVblNDAAK60zEbl4jxS2hva3GNdO9QAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'IX – The Hermit',
		description: 'Отшельник - карта, которая символизирует уединение, мудрость, самопознание и духовность. Она также может указывать на необходимость временного отстранения от мира для внутреннего роста.',
		file_id: "AgACAgIAAxkBAAIBMGR-XVhagBrSkAABs2-3mLSPhuIxdAACvdMxG5eI8UuX3qdKQCZQfwEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Major',
		name: 'X – Wheel of Fortune',
		description: 'Колесо Фортуны - карта, которая символизирует перемену, удачу, судьбу и карму. Она также может указывать на необходимость принятия рисков и изменений в жизни.',
		file_id: "AgACAgIAAxkBAAIBM2R-XYXabNrAVw9giaJbbZz3w6GWAAK-0zEbl4jxS5w7tKsEuj7XAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XI – Justice',
		description: 'Справедливость - карта, которая символизирует баланс, справедливость, порядок и закон. Она также может указывать на необходимость принятия ответственности за свои поступки.',
		file_id: "AgACAgIAAxkBAAIBNmR-XbSLmgkz4SpTFFXZ3dJB18oHAAK_0zEbl4jxSxpaJGVbGTZeAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XII – The Hanged Man',
		description: 'Повешенный - карта, которая символизирует жертву, самопожертвование, принятие неизбежного и духовное прозрение. Она также может указывать на необходимость отказа от чего-то важного для достижения большей цели.',
		file_id: "AgACAgIAAxkBAAIBOWR-XeQW1d_DgcqHObzoHe_x4PV2AALA0zEbl4jxS6NEg6N-p3kmAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XIII – Death',
		description: 'Смерть - карта, которая символизирует конец, преобразование, переход и новое начало. Она также может указывать на необходимость принятия изменений и отказа от старых привычек.',
		file_id: "AgACAgIAAxkBAAIBPGR-Xgf_mf_AauADjHjH31kz5BlkAALB0zEbl4jxS2jqIe49RuTMAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XIV – The Temperance',
		description: 'Умеренность - карта, которая символизирует гармонию, баланс, сдержанность и самообладание. Она также может указывать на необходимость нахождения в среде, где сохраняется равновесие, и способности достичь компромисса в сложных ситуациях.',
		file_id: "AgACAgIAAxkBAAIBVGR-X7PGLvHoqMyae_IfJZrs573qAALL0zEbl4jxS4ZfnowpHuwEAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XV – The Devil',
		description: 'Дьявол - карта, которая символизирует искушение, материализм, зависимость и страх. Она также может указывать на необходимость преодоления своих слабостей и зависимостей.',
		file_id: "AgACAgIAAxkBAAIBP2R-XjK1Xi_CNJt3FRp8va4nFCCoAALD0zEbl4jxS6_ZjJ5Z-9WGAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XVI – The Tower',
		description: 'Башня - карта, которая символизирует крушение, разрушение, изменение и катаклизмы. Она также может указывать на необходимость принятия решительных действий для изменения ситуации.',
		file_id: "AgACAgIAAxkBAAIBQmR-XmM7Po6EMwUicd7BwmWtNPWuAALE0zEbl4jxS3qN0xAvl2HzAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XVII – The Star',
		description: 'Звезда - карта, которая символизирует надежду, вдохновение, духовность и гармонию. Она также может указывать на необходимость веры в будущее и поиска своего пути.',
		file_id: "AgACAgIAAxkBAAIBRWR-XonoRyxiSlqM4L6Uwo7Q05DbAALF0zEbl4jxSxVdcejrk5QnAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XVIII – The Moon',
		description: 'Луна - карта, которая символизирует интуицию, фантазию, тайны и иллюзии. Она также может указывать на необходимость преодоления своих страхов и сомнений.',
		file_id: "AgACAgIAAxkBAAIBSGR-XrPOqnoZDr_pSTWj97YKWakDAALG0zEbl4jxS_ndLQJE2LUQAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XIX – The Sun',
		description: 'Солнце - карта, которая символизирует радость, счастье, успех и достижение целей. Она также может указывать на необходимость принятия своей индивидуальности и выражения своих талантов.',
		file_id: "AgACAgIAAxkBAAIBS2R-XtYs12hpdJ1fl8kAAeel73YrNQACx9MxG5eI8UtnA-2_rAj_BAEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Major',
		name: 'XX – Judgement',
		description: 'Суд - карта, которая символизирует судьбу, карму, ответственность и принятие решений. Она также может указывать на необходимость принятия ответственности за свои поступки и принятия решительных действий.',
		file_id: "AgACAgIAAxkBAAIBTmR-Xx2pa9wPRT0nS_nFalS0tvMwAALI0zEbl4jxS1cHb8SEzsIFAQADAgADeQADLwQ",
	},
	{
		arcana: 'Major',
		name: 'XXI – The World',
		description: 'Мир - карта, которая символизирует гармонию, совершенство, благополучие и достижение целей. Она также может указывать на необходимость поиска внутренней гармонии и сбалансированности.',
		file_id: "AgACAgIAAxkBAAIBUWR-X0ibQ6bMxE2bpSgfFq-m_FL2AALJ0zEbl4jxS59bIo8aZSEqAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Ace of Wands',
		description: 'Туз Жезлов - карта, которая символизирует начало нового проекта, идею или возможность. Она также может указывать на необходимость действия и энергичности.',
		file_id: "AgACAgIAAxkBAAIBV2R-YKBSOZfP1oNIxqaF2gOH0TeAAALN0zEbl4jxS1jZWIQdJD4kAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Two of Wands',
		description: 'II Жезлов - карта, которая символизирует партнерство, сотрудничество и согласие. Она также может указывать на необходимость баланса и гармонии в отношениях.',
		file_id: "AgACAgIAAxkBAAIBWmR-YM7Q-JgeVc0p3UBd2JwiDNp-AALO0zEbl4jxS7BEJvpLEXf3AQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Three of Wands',
		description: 'III Жезлов - карта, которая символизирует рост, развитие и расширение. Она также может указывать на необходимость сотрудничества и командной работы.',
		file_id: "AgACAgIAAxkBAAIBXWR-YRoAAbMXsLlGRr0e2oDJDLmY-wACz9MxG5eI8UtBcQfSREEQ2gEAAwIAA3kAAy8E"
	},
	{
		arcana: 'Minor',
		name: 'Four of Wands',
		description: 'IV Жезлов - карта, которая символизирует стабильность, уверенность и успех. Она также может указывать на необходимость сохранения достигнутых результатов.',
		file_id: "AgACAgIAAxkBAAIBYGR-YUIIqEdOOoKI_6gbbR7609_2AALQ0zEbl4jxS1cO_PMPF17GAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Five of Wands',
		description: 'V Жезлов - карта, которая символизирует конфликт, соперничество и препятствия. Она также может указывать на необходимость преодоления трудностей и поиска компромиссов.',
		file_id: "AgACAgIAAxkBAAIBY2R-YW5DHhGlROZLDGhZqMNhfCKfAALR0zEbl4jxS4S1a4wF8fQRAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Six of Wands',
		description: 'VI Жезлов - карта, которая символизирует победу, достижение целей и признание. Она также может указывать на необходимость уважения и признания достижений других людей.',
		file_id: "AgACAgIAAxkBAAIBZmR-YZGl6uE6btwNY0KTneRXIcqXAALS0zEbl4jxSyJUS4J-yzYqAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Seven of Wands',
		description: 'VII Жезлов - карта, которая символизирует настойчивость, упорство и целеустремленность. Она также может указывать на необходимость преодоления препятствий и достижения поставленных целей.',
		file_id: "AgACAgIAAxkBAAIBaWR-YbyjE1z8KKy9hibjV3fy_2DFAALU0zEbl4jxS-JTwrF0Ov-2AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Eight of Wands',
		description: 'VIII Жезлов - карта, которая символизирует движение, прогресс и развитие. Она также может указывать на необходимость принятия рисков и изменений в жизни.',
		file_id: "AgACAgIAAxkBAAIBbGR-Yefyn5pb1XsJHfN8HMfvKXB4AALV0zEbl4jxS-jh8Hb2EyUwAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Nine of Wands',
		description: 'IX Жезлов - карта, которая символизирует достижение высоких целей, удачу и благополучие. Она также может указывать на необходимость сохранения достигнутых результатов и уважения других людей.',
		file_id: "AgACAgIAAxkBAAIBb2R-YhkBJr1wRTht63QsaqzSJauqAALW0zEbl4jxSygnfqU7IhQDAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Ten of Wands',
		description: 'X Жезлов - карта, которая символизирует перегрузку, перегруженность и изнеможение. Она также может указывать на необходимость отдыха и восстановления сил.',
		file_id: "AgACAgIAAxkBAAIBcmR-Yjb0GJiqpCXCDPD6cTMLOzcOAALX0zEbl4jxS7b8F2BV7lRQAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Page of Wands',
		description: 'Паж Жезлов - карта, которая символизирует молодость, энергию и творчество. Она также может указывать на необходимость развития своих талантов и способностей.',
		file_id: "AgACAgIAAxkBAAIBdWR-Ym0F_QABUSfyIH7450oFB2UsxAAC2dMxG5eI8UvfiGgIIRWtWAEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Minor',
		name: 'Knight of Wands',
		description: 'Рыцарь Жезлов - карта, которая символизирует энергию, страсть, решительность и действие. Она также может указывать на необходимость принятия рисков и действий для достижения поставленных целей.',
		file_id: "AgACAgIAAxkBAAIBeGR-YqqLIxI8_WFG7HHOmr85huTGAALa0zEbl4jxS1XL3NVDodi6AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Queen of Wands',
		description: 'Королева Жезлов - карта, которая символизирует лидерство, уверенность и энергичность. Она также может указывать на необходимость принятия решительных действий и управления своей жизнью.',
		file_id: "AgACAgIAAxkBAAIBe2R-YtRe5ZjjWUsYxsbwQA8LXBH6AALb0zEbl4jxSxs8VAQAAbThcwEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Minor',
		name: 'King of Wands',
		description: 'Король Жезлов - карта, которая символизирует власть, авторитет и успех. Она также может указывать на необходимость принятия ответственности за свои поступки и управления своей жизнью.',
		file_id: "AgACAgIAAxkBAAIBfmR-Yvvw9JnvDqRcVxxOgMtnjjsAA9zTMRuXiPFLVERi5eioVF4BAAMCAAN5AAMvBA",
	},
	{
		arcana: 'Minor',
		name: 'Ace of Cups',
		description: 'Туз Кубков - карта, которая символизирует начало новых отношений, любовь, счастье и радость. Она также может указывать на необходимость открыть свое сердце для новых возможностей.',
		file_id: "AgACAgIAAxkBAAIBgWR-Yy7kKoTLcya7SaD3wONIlFNpAALf0zEbl4jxS3CPLvAv5xYBAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Two of Cups',
		description: 'II Кубков - карта, которая символизирует партнерство, гармонию и баланс в отношениях. Она также может указывать на необходимость принятия компромиссов и сбалансированности в жизни.',
		file_id: "AgACAgIAAxkBAAIBhGR-Y1MJtuDYiaxUSnpc_wdkehR-AALg0zEbl4jxS0_8dldXy5AvAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Three of Cups',
		description: 'III Кубков - карта, которая символизирует общение, социальные связи и дружбу. Она также может указывать на необходимость нахождения своего места в обществе и поиска поддержки у друзей.',
		file_id: "AgACAgIAAxkBAAIBh2R-Y3Y_xY2vTbYk1xSCO2V8_6wIAALh0zEbl4jxSwfnaHqWhqcCAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Four of Cups',
		description: 'IV Кубков - карта, которая символизирует семейную жизнь, домашний уют и комфорт. Она также может указывать на необходимость заботы о своих близких и создания гармоничной атмосферы в доме.',
		file_id: "AgACAgIAAxkBAAIBimR-Y5QXl7tfvxHx9gkJvsxEN4cQAALj0zEbl4jxS6T1m25cdwztAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Five of Cups',
		description: 'V Кубков - карта, которая символизирует потерю, грусть и разочарование. Она также может указывать на необходимость принятия прошлого и перехода к новому этапу жизни.',
		file_id: "AgACAgIAAxkBAAIBjWR-Y7HtpCJqqTn6i25s9_BYAUs1AALk0zEbl4jxS5EYosg2tUjAAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Six of Cups',
		description: 'VI Кубков - карта, которая символизирует щедрость, благодарность и радость. Она также может указывать на необходимость делиться своими эмоциями и чувствами с другими.',
		file_id: "AgACAgIAAxkBAAIBkGR-Y9h1g-_ylFipXH3WEtx_cEQBAALl0zEbl4jxS3Z55T6EAAFRrgEAAwIAA3kAAy8E"
	},
	{
		arcana: 'Minor',
		name: 'Seven of Cups',
		description: 'VII Кубков - карта, которая символизирует успех, достижение целей и удовлетворение. Она также может указывать на необходимость продолжения начатого дела и достижения новых высот.',
		file_id: "AgACAgIAAxkBAAIBk2R-Y_h0lmNRHZMZB-sz2mBHI72QAALm0zEbl4jxSx0ssn297Le_AQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Eight of Cups',
		description: 'VIII Кубков - карта, которая символизирует удовлетворение, благополучие и достаток. Она также может указывать на необходимость наслаждаться жизнью и радоваться маленьким вещам.',
		file_id: "AgACAgIAAxkBAAIBlmR-ZBsEcDsb99-PETWZHEXvGpNuAALn0zEbl4jxS4yS76mXFBL8AQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Nine of Cups',
		description: 'IX Кубков - карта, которая символизирует удовлетворение, достижение целей и благодарность. Она также может указывать на необходимость нахождения своего места в жизни и поиска своего пути.',
		file_id: "AgACAgIAAxkBAAIBmWR-ZD4c240hH-2ohtdOb3cumCrfAALo0zEbl4jxSw6G82jYnkdOAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Ten of Cups',
		description: 'X Кубков - карта, которая символизирует благополучие, достаток и удовлетворение. Она также может указывать на необходимость наслаждаться жизнью и радоваться маленьким вещам.',
		file_id: "AgACAgIAAxkBAAIBnGR-ZFwH53rQsPDeTPkZ-MGw4U1mAALp0zEbl4jxSxH6dhCFR_HHAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Page of Cups',
		description: 'Паж Кубков - карта, которая символизирует молодость, энергию и творчество. Она также может указывать на необходимость проявления своих талантов и увлечений.',
		file_id: "AgACAgIAAxkBAAIBn2R-ZHs2NcJhJaEywemNsjaiPKMKAALq0zEbl4jxS265WrdR1ivEAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Knight of Cups',
		description: 'Рыцарь Кубков - карта, которая символизирует романтику, страсть и любовь. Она также может указывать на необходимость проявления своей эмоциональности и чувствительности.',
		file_id: "AgACAgIAAxkBAAIBomR-ZJ33p5s5gsTrGp_CD9awK9JDAALr0zEbl4jxS4WEGRjw8_aWAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Queen of Cups',
		description: 'Королева Кубков - карта, которая символизирует женственность, красоту и эмоциональность. Она также может указывать на необходимость проявления своей интуиции и чувствительности.',
		file_id: "AgACAgIAAxkBAAIBpWR-ZMC-sciMvQ4KsidOyUXvaEBSAALs0zEbl4jxS8_FcpxO2MaCAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'King of Cups',
		description: 'Король Кубков - карта, которая символизирует власть, авторитет и стабильность. Она также может указывать на необходимость принятия решительных действий и управления своей жизнью.',
		file_id: "AgACAgIAAxkBAAIBqGR-ZOLjvfwVNfJW7ORRvhsOEHCBAALt0zEbl4jxSwQ352ey2cHJAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Ace of Swords',
		description: 'Туз Мечей - карта, которая символизирует новое начало, решительность, логику и рациональность. Она также может указывать на необходимость принятия решительных действий и начала нового этапа в жизни.',
		file_id: "AgACAgIAAxkBAAIBq2R-ZQltlwb2ibv3lVQ_J4j-L7kaAALu0zEbl4jxS4ODbvFr8h-fAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Two of Swords',
		description: 'II Мечей - карта, которая символизирует разрыв, конфликт, неопределенность и неуверенность. Она также может указывать на необходимость принятия решения и выбора между двумя путями.',
		file_id: "AgACAgIAAxkBAAIBrmR-ZU3qD9guBcxZwjt2vEFs0nGtAALx0zEbl4jxS8AvpzFPvc-sAQADAgADeQADLwQ"
	},
	{
		arcana: 'Minor',
		name: 'Three of Swords',
		description: 'III Мечей - карта, которая символизирует разрушение, разочарование, измену и предательство. Она также может указывать на необходимость принятия болезненных решений и переживания эмоциональной боли.',
		file_id: "AgACAgIAAxkBAAIBsWR-ZXLIYOd98e-qQNSRmqzYPW2LAALy0zEbl4jxSyywC-mWAAGyFAEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Minor',
		name: 'Four of Swords',
		description: 'IV Мечей - карта, которая символизирует покой, уединение, отстранение и отрешенность. Она также может указывать на необходимость временного отстранения от мира для внутреннего роста и восстановления сил.',
		file_id: "AgACAgIAAxkBAAIBtGR-ZZEHOhreBMKH1TkYQaZCdVZEAALz0zEbl4jxS2eQrVxP-Ij2AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Five of Swords',
		description: 'V Мечей - карта, которая символизирует потерю, поражение, предательство и разочарование. Она также может указывать на необходимость принятия уроков из прошлого и переоценки своих ценностей.',
		file_id: "AgACAgIAAxkBAAIBt2R-ZbLR3fh3R6gPYas9X_e4tyFSAAL00zEbl4jxSxSjDUT95NP-AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Six of Swords',
		description: 'VI Мечей - карта, которая символизирует перемещение, уход, бегство и изменение. Она также может указывать на необходимость принятия рисков и изменений в жизни.',
		file_id: "AgACAgIAAxkBAAIBumR-ZdfmwZ45oxxzTcnchxjQkea_AAL20zEbl4jxS7mUptxv2z2TAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Seven of Swords',
		description: 'VII Мечей - карта, которая символизирует уклонение, обман, хитрость и уклонение от ответственности. Она также может указывать на необходимость принятия ответственности за свои поступки и преодоления своих страхов.',
		file_id: "AgACAgIAAxkBAAIBvWR-ZfRJgGAAAQLxk6weLPiMKQQxHgAC99MxG5eI8UsFd_pSaXbtjgEAAwIAA3kAAy8E",
	},
	{
		arcana: 'Minor',
		name: 'Eight of Swords',
		description: 'VIII Мечей - карта, которая символизирует уход, изменение, предательство и обман. Она также может указывать на необходимость принятия решительных действий и изменения ситуации.',
		file_id: "AgACAgIAAxkBAAIBwGR-ZhJ9i8vAM0pITITiS72tVWDoAAL40zEbl4jxS5Xp5vN6V2s7AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Nine of Swords',
		description: 'IX Мечей - карта, которая символизирует страх, тревогу, беспокойство и сомнения. Она также может указывать на необходимость преодоления своих страхов и сомнений и поиска внутренней уверенности.',
		file_id: "AgACAgIAAxkBAAIBw2R-ZjBnC_88pWt1IzbSG323sr4nAAL50zEbl4jxS31RAzBfxI_4AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Ten of Swords',
		description: 'X Мечей - карта, которая символизирует конец, разрушение, поражение и катаклизмы. Она также может указывать на необходимость принятия изменений и отказа от старых привычек.',
		file_id: "AgACAgIAAxkBAAIBxmR-Zk_Q_aXxFjCPyfxjj6ZM3UzIAAL60zEbl4jxS0yeosmDk27-AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Page of Swords',
		description: 'Паж Мечей - карта, которая символизирует изменение, новые возможности, риск и молодость. Она также может указывать на необходимость принятия рисков и изменений в жизни.',
		file_id: "AgACAgIAAxkBAAIByWR-Zm9BBOslx8NV99vXjZd1uVDLAAL70zEbl4jxS4FzwjWPUPIjAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Knight of Swords',
		description: 'Рыцарь Мечей - карта, которая символизирует решительность, действие, логику и амбиции. Она также может указывать на необходимость принятия решительных действий и достижения поставленных целей.',
		file_id: "AgACAgIAAxkBAAIBzGR-ZpKm-GNLUGZxMhOkSfGjYJQ0AAL80zEbl4jxS4S0lYXX0MY8AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Queen of Swords',
		description: 'Королева Мечей - карта, которая символизирует интеллект, логику, рациональность и справедливость. Она также может указывать на необходимость принятия рациональных решений и поиска справедливости.',
		file_id: "AgACAgIAAxkBAAIBz2R-ZrExLxcKszY24iNIxW5VtQbxAAL90zEbl4jxS3CqfacRai1FAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'King of Swords',
		description: 'Король Мечей - карта, которая символизирует власть, авторитет, лидерство и рациональность. Она также может указывать на необходимость принятия решительных действий и управления ситуацией.',
		file_id: "AgACAgIAAxkBAAIB0mR-ZtAKN6fb_t5unWjkJQ3NrAEoAAL-0zEbl4jxSzq8gsfqpTRUAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Ace of Pentacles',
		description: 'Туз Пентаклей - карта, которая символизирует трудолюбие, настойчивость и упорство в достижении целей. Она также может указывать на необходимость осторожности и предусмотрительности в финансовых вопросах.',
		file_id: "AgACAgIAAxkBAAIB1WR-ZvG0ntJ3RK31W7DWQFgCQ5NYAAL_0zEbl4jxS7mX1Q7aCJOgAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Two of Pentacles',
		description: 'II Пентаклей - карта, которая символизирует баланс и гармонию в финансовых вопросах. Она также может указывать на необходимость гибкости и адаптации к изменяющимся обстоятельствам.',
		file_id: "AgACAgIAAxkBAAIB2GR-Zw-ZZ-nJ5a98m7MF2RdJ2DwsAAPUMRuXiPFLZinQjKwYE5ABAAMCAAN5AAMvBA",
	},
	{
		arcana: 'Minor',
		name: 'Three of Pentacles',
		description: 'III Пентаклей - карта, которая символизирует трудолюбие, усердие и стремление к совершенству в работе. Она также может указывать на необходимость сотрудничества и командной работы.',
		file_id: "AgACAgIAAxkBAAIB22R-ZywXyf23eA_D-sTNT2tbH2RiAAIB1DEbl4jxS2q91TsSL5BkAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Four of Pentacles',
		description: 'IV Пентаклей - карта, которая символизирует жадность, страх потери и защиту своих материальных благ. Она также может указывать на необходимость отказа от жадности и открытости к новым возможностям.',
		file_id: "AgACAgIAAxkBAAIB3mR-Z0ufqe-8J8pwReBW11Su49qRAAIC1DEbl4jxS6WX0EbZt1aYAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Five of Pentacles',
		description: 'V Пентаклей - карта, которая символизирует бедность, неудачу и потерю материальных благ. Она также может указывать на необходимость принятия помощи и поддержки в трудные времена.',
		file_id: "AgACAgIAAxkBAAIB4WR-Z2sNMcH5VLnLM7vt0XUXertkAAID1DEbl4jxS02szDIUlCFyAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Six of Pentacles',
		description: 'VI Пентаклей - карта, которая символизирует щедрость, благотворительность и поддержку других людей. Она также может указывать на необходимость открытости и щедрости в отношениях с другими людьми.',
		file_id: "AgACAgIAAxkBAAIB5GR-Z46e9DKbrnHkilnTktNt6YvCAAIE1DEbl4jxS0TgYaz4ai_9AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Seven of Pentacles',
		description: 'VII Пентаклей - карта, которая символизирует терпение, настойчивость и постоянство в достижении финансовых целей. Она также может указывать на необходимость инвестирования времени и ресурсов в свой бизнес или карьеру.',
		file_id: "AgACAgIAAxkBAAIB52R-Z69aLjZougZa3xsLwPn-5WTIAAIF1DEbl4jxS2Nse0bFc-pLAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Eight of Pentacles',
		description: 'VIII Пентаклей - карта, которая символизирует мастерство, умение и опыт в работе. Она также может указывать на необходимость постоянного обучения и совершенствования своих навыков.',
		file_id: "AgACAgIAAxkBAAIB6mR-Z82ADuUdqZTcthosC9j2FIeAAAIG1DEbl4jxS8rRUKMb7wWqAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Nine of Pentacles',
		description: 'IX Пентаклей - карта, которая символизирует достаток, благополучие и удовлетворение от своей работы. Она также может указывать на необходимость наслаждаться жизнью и находить радость в мелочах.',
		file_id: "AgACAgIAAxkBAAIB7WR-Z-dMG--ELBxrl5iHwwwqMj-YAAII1DEbl4jxS8PdTGFC0LuuAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Ten of Pentacles',
		description: 'X Пентаклей - карта, которая символизирует процветание, богатство и успех в финансовых вопросах. Она также может указывать на необходимость благодарности и щедрости в отношениях с другими людьми.',
		file_id: "AgACAgIAAxkBAAIB8GR-aATf52sGvQISKUw9-h-zC9qVAAIJ1DEbl4jxS1IwGR4yQ3OZAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Page of Pentacles',
		description: 'Паж Пентаклей - карта, которая символизирует начало нового бизнеса или карьеры, учебу и обучение. Она также может указывать на необходимость открытости к новым возможностям и идеям.',
		file_id: "AgACAgIAAxkBAAIB82R-aClw6N3ndmBKecNpbYZxYzO5AAIK1DEbl4jxS84FGyOhGEb1AQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Knight of Pentacles',
		description: 'Рыцарь Пентаклей - карта, которая символизирует уверенность, надежность и ответственность в работе. Она также может указывать на необходимость принятия рисков и принятия решительных действий.',
		file_id: "AgACAgIAAxkBAAIB9mR-aEqxJzzh0WvIkNTxjj4D9P22AAIL1DEbl4jxS1diKS6t9B6pAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'Queen of Pentacles',
		description: 'Королева Пентаклей - карта, которая символизирует богатство, процветание и умение управлять своими финансами. Она также может указывать на необходимость заботы о своем здоровье и благополучии.',
		file_id: "AgACAgIAAxkBAAIB-WR-aHGBzu0raaPQEttgD3BTZC7iAAIM1DEbl4jxS_EXZssl21tFAQADAgADeQADLwQ",
	},
	{
		arcana: 'Minor',
		name: 'King of Pentacles',
		description: 'Король Пентаклей - карта, которая символизирует власть, авторитет и умение управлять бизнесом или карьерой. Она также может указывать на необходимость принятия ответственности за свои поступки и принятия решительных действий.',
		file_id: "AgACAgIAAxkBAAIB_GR-aI7J8NwPvOSBiCIrzziiaq9NAAIN1DEbl4jxS1XZ53TFS-pGAQADAgADeQADLwQ",
	}
	];
	return deck;
}