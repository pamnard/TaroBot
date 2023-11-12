function chatgpt(ask) {
	const api_key = "*************************************************************";
	const openai = new OpenAIApp(api_key);
	const rasklad = getRasklad();
	const temp = 1;
	const top_p = 1;
	var reply_to_guest = [];
	var messages = [];
	for (var i = 0; i < rasklad.length; i++) {
		if (i === 0) {
			let text = `Ты профессиональная гадалка-цыганка. К тебе пришел посетитель, погадать на картах таро. \nГадание будет в виде расклада из трех карт - Прошлое, Настроящее и Будущее. \nВ качестве того "о чем именно гадаем" - посетитель ответил "${ask}". \nКарта "прошлого" которая ему выпала, это "${rasklad[i].card.description}" \nИстолкуй эту карту для посетителя в контексте его вопроса. Не говори о чем в третьем лице - ответь именно ему.`;
			let message_obj = {
				role: 'user',
				content: text
			}
			messages.push(message_obj);
		}
		if (i === 1) {
			let text = `Карта "настоящего" которая ему выпала, это "${rasklad[i].card.description}" \nИстолкуй эту карту для посетителя в контексте его вопроса. Не говори о чем в третьем лице - ответь именно ему.`;
			let message_obj = {
				role: 'user',
				content: text
			}
			messages.push(message_obj);
		}
		if (i === 2) {
			let text = `Карта "будущего" которая ему выпала, это "${rasklad[i].card.description}" \nИстолкуй эту карту для посетителя в контексте его вопроса. Не говори о чем в третьем лице - ответь именно ему.`;
			let message_obj = {
				role: 'user',
				content: text
			}
			messages.push(message_obj);
		}
		let response = openai.Chat().CreateChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: messages,
			temperature: temp,
			top_p: top_p
		});
		let answer = response.choices[0].message.content.replace(/^\n\n/, '');
		reply_to_guest.push({
			rasklad: rasklad[i],
			reply: answer
		});
		messages.push({
			role: 'assistant',
			content: answer
		})
	}
	let final_text = `Теперь истолкуй посетителю расклад в целом. Помни, что карты не говорят ничего о намерениях и мыслях посетителя, только о возможностях поворотов судьбы. Что сулит посетителю такое сочетание карт в контексте его вопроса? Не говори о чем в третьем лице - ответь именно ему.`;
	let final_message_obj = {
		role: 'user',
		content: final_text
	}
	messages.push(final_message_obj);
	let response = openai.Chat().CreateChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: messages,
		temperature: temp,
		top_p: top_p
	});
	const final_answer = response.choices[0].message.content.replace(/^\n\n/, '');
	reply_to_guest.push({
		rasklad: null,
		reply: final_answer
	});
	return reply_to_guest;
}