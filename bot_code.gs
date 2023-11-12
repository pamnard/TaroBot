const token = '************************************';
const webhookUrl = 'https://**************************************';
const myBot = new TelegramApp(token, true);
const type = myBot.Type();
const cache = CacheService.getScriptCache();
const chat_logging = false;

/**
 * Обрабатывает POST запросы.
 * @param {Object} e - Объект с данными запроса.
 * @return {Promise<void>}
 */
async function doPost(e) {
	try {
		const update = JSON.parse(e.postData.contents);
		if (update.callback_query) {
			await myBot.answerCallbackQuery({
				callback_query_id: update.callback_query.id,
				text: `Хорошо ${update.callback_query.from.first_name}...`,
				cache_time: 0
			});
		}
		if (chat_logging) {
			myBot.sendMessage({
				chat_id: '132384373',
				text: 'update - \n' + JSON.stringify(update)
			});
		}
		await main(update);
	} catch (e) {
		Logger.log(JSON.stringify(e));
	}
}

/**
 * Обрабатывает основную логику бота.
 * @param {Object} update - Объект с данными обновления от Telegram API.
 * @return {Promise<void>}
 */
async function main(update) {
	if (update.callback_query) {
		if (update.callback_query.message) {
			await proceedCallback(update.callback_query);
		}
	}
	if ("message" in update && !update.callback_query) {
		if (!!update.message.entities && update.message.entities.some(item => item.type === "bot_command")) {
			await proceedBotCommand(update);
		} else {
			if (update.message?.animation || update.message?.document || update.message?.audio || update.message?.photo || update.message?.sticker || update.message?.photo || update.message?.voice) {
				await myBot.sendMessage({
					chat_id: update.message.chat.id,
					text: `Не понимаю тебя ${update.message.from.first_name}`
				});
			} else {
				await proceedText(update.message);
			}
		}
	}
}

/**
 * Обрабатывает callback_query, проверяет наличие 'ask' в поле data. Если присутствует, то добавляет информацию о пользователе в кэш и отправляет сообщение с просьбой задать вопрос.
 * @param {object} callback_query - Объект содержащий данные запроса.
 * @return {Promise<void>}
 */
async function proceedCallback(callback_query) {
	switch (callback_query.data) {
		case 'ask':
			cache.put(callback_query.message.chat.id + '_' + callback_query.from.id + '_waitforask', 'true', 21600);
			await myBot.sendMessage({
				chat_id: callback_query.message.chat.id,
				text: 'Задай волнующий тебя вопрос:'
			});
			break;
		case 'get_next_card':
			await sendRemainCard(
				callback_query.message.chat.id,
				callback_query.from.id
			);
			break;
		default:
			break;
	}
}

/**
 * Обрабатывает текстовое сообщение. Если пользователь ожидает ответа на свой вопрос, то запрашивает ответ от chatgpt и отправляет его пользователю. Если не ожидается ответ на вопрос, то отправляет сообщение с просьбой начать заново.
 * @param {object} message - Объект содержащий данные сообщения.
 * @return {Promise<void>}
 */
async function proceedText(message) {
	const status = cache.get(message.chat.id + '_' + message.from.id + '_waitforask');
	if (status == 'true') {
		cache.remove(message.chat.id + '_' + message.from.id + '_waitforask');
		await myBot.sendAnimation({
			chat_id: message.chat.id,
			animation: '***********************************************************',
			caption: `Минуточку ${message.from.first_name}, сейчас всё узнаем, уже тасую карты!`
		});
		const reply_arr = await chatgpt(message.text);
		await myBot.sendMessage({
			chat_id: message.chat.id,
			text: 'Итак, что тут у нас...'
		});
		const photo_one = reply_arr[0].rasklad.card.file_id;
		const caption_one = `<strong>${reply_arr[0].rasklad.card.name}</strong>\n\n${reply_arr[0].reply}`;
		const remains_arr = reply_arr.slice(1);
		cache.put(
			message.chat.id + '_' + message.from.id + '_remains',
			JSON.stringify({
				remains_arr: remains_arr
			}),
			21600
		);
		await myBot.sendPhoto({
			photo: photo_one,
			chat_id: message.chat.id,
			caption: caption_one,
			parse_mode: 'HTML',
			reply_markup: type.inlineKeyboardMarkup({
				inline_keyboard: [
					[{
						text: 'Дальше 👉',
						callback_data: `get_next_card`
					}]
				]
			})
		});
	} else {
		await myBot.sendMessage({
			chat_id: message.chat.id,
			text: `Я что-то потерял нить разговора... Начни сначала ${message.from.first_name}! - /new`
		});
	}
}

async function sendRemainCard(chat_id, user_id) {
	const remain_cache = cache.get(chat_id + '_' + user_id + '_remains');
	Logger.log(remain_cache);
	if (remain_cache != null) {
		const remain_json_obj = JSON.parse(remain_cache);
		const arr = remain_json_obj.remains_arr;
		let caption_one = arr[0].reply;
		const photo_one = arr[0].rasklad?.card?.file_id;
		if (photo_one) {
			caption_one = `<strong>${arr[0].rasklad.card.name}</strong>\n\n${arr[0].reply}`;
		}
		const remains_arr = arr.slice(1);
		cache.put(
			chat_id + '_' + user_id + '_remains',
			JSON.stringify({
				remains_arr: remains_arr
			}),
			21600
		);
		if (photo_one) {
			await myBot.sendPhoto({
				photo: photo_one,
				chat_id: chat_id,
				caption: caption_one,
				parse_mode: 'HTML',
				reply_markup: type.inlineKeyboardMarkup({
					inline_keyboard: [
						[{
							text: 'Дальше 👉',
							callback_data: `get_next_card`
						}]
					]
				})
			});
		} else {
			cache.remove(chat_id + '_' + user_id + '_remains');
			await myBot.sendPhoto({
				photo: '**********************************************************************',
				parse_mode: 'HTML',
				chat_id: chat_id,
				caption: caption_one
			});
		}
	}
}

/**
 * Обрабатывает команду бота. Если пришла команда /start, то отправляет приветственное сообщение с фотографией и кнопкой "Погадать". Если пришла команда /help, то отправляет сообщение со справочной информацией.
 * @param {object} update - Объект содержащий данные обновления.
 * @return {void}
 */
async function proceedBotCommand(update) {
	const entities = update.message.entities;
	const message_text = update.message.text.trim();
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i];
		if (entity.type === 'bot_command') {
			const commandtext = message_text;
			switch (commandtext) {
				case '/start':
					const start_message = getStartMessage(update.message.from.language_code, update.message.from.first_name);
					await myBot.sendPhoto({
						photo: '***********************************************************************',
						chat_id: update.message.chat.id,
						caption: start_message,
						parse_mode: 'HTML',
						reply_markup: type.inlineKeyboardMarkup({
							inline_keyboard: [
								[{
									text: '🃏 Погадать',
									callback_data: `ask`
								}]
							]
						})
					});
					break;
				case '/help':
					await myBot.sendMessage({
						chat_id: update.message.chat.id,
						text: 'Чип и дейл спешат на помощь'
					});
					break;
				case '/new':
					cache.remove(update.message.chat.id + '_' + update.message.from.id + '_waitforask');
					await myBot.sendPhoto({
						photo: '******************************************************************************',
						chat_id: update.message.chat.id,
						caption: `Ну давай попробуем ${update.message.from.first_name}...`,
						parse_mode: 'HTML',
						reply_markup: type.inlineKeyboardMarkup({
							inline_keyboard: [
								[{
									text: '🃏 Погадать',
									callback_data: `ask`
								}]
							]
						})
					});
					break;
				default:
					await myBot.sendMessage({
						chat_id: update.message.chat.id,
						text: 'Неизвестная команда'
					});
					break;
			}
		}
	}
}

/**
 * Устанавливает вебхук для Telegram бота.
 *
 * @async
 * @function setTgWebhook
 * @returns {Promise} Promise объект, который разрешается в результат установки вебхука.
 */
async function setTgWebhook() {
	try {
		var result = await myBot.setWebhook({
			url: webhookUrl,
			max_connections: 1,
			drop_pending_updates: true
		});
		Logger.log(result);
	} catch (e) {
		Logger.log(e);
	}
}

/**
 * Получает информацию о вебхуке для Telegram бота.
 *
 * @async
 * @function getTgWebhookInfo
 * @returns {Promise} Promise объект, который разрешается в информацию о вебхуке.
 */
async function getTgWebhookInfo() {
	var result = await myBot.getWebhookInfo();
	Logger.log(result);
}

/**
 * Устанавливает команды для Telegram бота.
 *
 * @async
 * @function set_commands
 * @returns {Promise} Promise объект, который разрешается в результат установки команд.
 */
async function set_commands() {
	var result = await myBot.setMyCommands({
		commands: [{
			command: '/start',
			description: 'Старт'
		},
		{
			command: '/help',
			description: 'Помощь'
		}
		],
		language_code: 'ru'
	});
	Logger.log(result);
}